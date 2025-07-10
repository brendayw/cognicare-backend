import supabase from '../config/db.js'
import { getPatientsByNameQuery } from '../database/patientQueries.js'
import {
  logReportQuery,
  getReportsByPatientIdQuery,
  updateReportQuery,
  softDeleteReportQuery
} from '../database/reportQueries.js'

export async function logReport (req, res) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Cuerpo de la solicitud inválido.'
    });
  }
  const { tipoReporte, fechaReporte, descripcion, nombreCompleto, idEvaluacion } = req.body;

  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      success: false,
      message: 'No se ha proporcionado un archivo válido.'
    });
  }

  const missingFields = {
    tipoReporte: !tipoReporte?.trim(),
    fechaReporte: !fechaReporte?.trim(),
    descripcion: !descripcion?.trim(),
    nombreCompleto: !nombreCompleto?.trim(),
    idEvaluacion: !idEvaluacion?.toString().trim()
  };

  if (Object.values(missingFields).some(Boolean)) {
    return res.status(400).json({
      success: false,
      message: 'Faltan completar campos obligatorios.',
      missing_fields: missingFields,
      received_values: { // Para debug
        nombreCompleto: nombreCompleto,
        tipo: typeof nombreCompleto
      }
    });
  }

  let filePath
  try {
    const patients = await getPatientsByNameQuery(nombreCompleto);

    if (!patients?.length) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un paciente con ese nombre.'
      });
    }
    const idPaciente = patients[0].id
    const fileExtension = req.file.originalname.split('.').pop() || 'pdf'
    const fileName = `reporte-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`
    filePath = `reportes/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('reportes')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype || 'application/octet-stream',
        upsert: false,
        cacheControl: '3600'
      })

     if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('reportes')
      .getPublicUrl(filePath)

    let formattedDate
    try {
      formattedDate = new Date(fechaReporte).toISOString();
      if (isNaN(new Date(formattedDate).getTime())) throw new Error('Fecha inválida');
    } catch (dateError) {
      await supabase.storage.from('reportes').remove([filePath]);
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD.',
        received_date: fechaReporte
      });
    }

    const result = await logReportQuery(tipoReporte, formattedDate, descripcion, publicUrl,
      parseInt(idEvaluacion), idPaciente)

    return res.status(201).json({
      success: true,
      message: 'Reporte creado con éxito.',
      data: result
    })
  } catch (error) {
    if (filePath) {
      await supabase.storage.from('reportes').remove([filePath])
        .catch(deleteError => console.error('Error al limpiar archivo:', deleteError))
    }

    if (error.message.includes('row-level security')) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes. Verifica las políticas RLS en Supabase.',
        error_details: error.message
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear el reporte',
      error_details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export async function getReportsByPatientId (req, res) {
  const idPatient = parseInt(req.params.id, 10)

  try {
    const results = await getReportsByPatientIdQuery(idPatient)

    if (!results) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener reportes del paciente o el paciente no existe.'
      })
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'El paciente no tiene reportes asociados disponibles.',
        data: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'Reportes del paciente obtenidos con éxito.',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los reportes asociados al paciente.'
    })
  }
}

export async function updateReport (req, res) {
  const idReport = req.params.id
  const { fechaReporte, descripcion, tipoReporte } = req.body

  if (!fechaReporte && !descripcion && !tipoReporte && !req.file) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos un campo para actualizar.'
    })
  }

  let filePath
  let publicUrl
  try {
    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop()
      const fileName = `reporte-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`
      filePath = `reportes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('reportes')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Error al subir archivo: ${uploadError.message}`)
      }

      const { data: { publicUrl: url } } = supabase.storage
        .from('reportes')
        .getPublicUrl(filePath)

      publicUrl = url
    }

    let formattedDate = fechaReporte
    if (fechaReporte && typeof fechaReporte === 'string' && !fechaReporte.includes('T')) {
      const date = new Date(fechaReporte)
      if (isNaN(date.getTime())) {
        if (filePath) {
          await supabase.storage.from('reportes').remove([filePath])
        }
        return res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido. Use YYYY-MM-DD.'
        })
      }
      formattedDate = date.toISOString()
    }

    const update = await updateReportQuery(idReport, formattedDate, descripcion, publicUrl, tipoReporte)

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no ha podido ser actualizado.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Reporte actualizado con éxito.',
      data: update[0] || update
    })
  } catch (error) {
    if (filePath) {
      try {
        await supabase.storage.from('reportes').remove([filePath])
      } catch (cleanupError) {
        console.error('Error al limpiar archivo:', cleanupError)
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar el reporte.'
    })
  }
}

export async function softDeleteReport (req, res) {
  const idReport = parseInt(req.params.id)

  if (!idReport) {
    return res.status(400).json({
      success: false,
      message: 'ID de reporte no válido.'
    })
  }

  try {
    const result = await softDeleteReportQuery(idReport)

    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
       message: 'Reporte ha eliminar no encontrado.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Reporte eliminado con éxito.',
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el reporte.'
    })
  }
}
