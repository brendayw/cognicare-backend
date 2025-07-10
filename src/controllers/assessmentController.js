import {
  logAssessmentQuery,
  getAssessmentsQuery,
  getAssessmentByPatientQuery,
  updateAssessmentQuery,
  softDeleteAssessmentQuery
} from '../database/assessmentQueries.js'
import { getPatientsByNameQuery } from '../database/patientQueries.js'

export async function logAssessment (req, res) {
  const idProfesional = req.user.sub
  const { fechaEvaluacion, nombreEvaluacion, tipoEvaluacion, resultado, observaciones, nombreCompleto } = req.body

  if (!fechaEvaluacion || !nombreEvaluacion || !tipoEvaluacion || !resultado || !nombreCompleto) {
    return res.status(400).json({
      success: false,
      message: 'Faltan completar campos obligatorios.'
    })
  }

  try {
    const patients = await getPatientsByNameQuery(nombreCompleto)
    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un paciente con ese nombre.'
      })
    }

    const patient = patients[0]

    const assessmentData = {
      fechaEvaluacion,
      nombreEvaluacion,
      tipoEvaluacion,
      resultado,
      observaciones,
      idProfesional,
      idPaciente: patient.id
    }

    const result = await logAssessmentQuery(assessmentData);

    res.status(200).json({
      success: true,
      message: 'Evaluación creada con éxito',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la evaluación.'
    })
  }
}

export async function getAssessments (req, res) {
  const idProfesional = req.user.sub

  try {
    if (!idProfesional) {
      return res.status(404).json({
        success: false,
        message: 'ID del profesional no encontrado en el token.'
      })
    }

    const data = await getAssessmentsQuery(idProfesional)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener evaluaciones.'
      })
    }

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aún no hay evaluaciones registradas para el profesional.',
        data: []
      })
    }

    const formattedData = data.map(item => ({
      id: item.id,
      nombre: item.nombreEvaluacion,
      fecha: item.fechaEvaluacion,
      resultado: item.resultado,
      observaciones: item.observaciones,
      tipo: item.tipoEvaluacion,
      paciente: {
        id: item.idPaciente,
        nombre: item.paciente?.nombreCompleto || 'Nombre no disponible'
      }
    }))

    res.status(200).json({
      success: true,
      message: 'Evaluaciones obtenidas con éxito.',
      data: formattedData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las evaluaciones del paciente.',
      error: error.message
    })
  }
}

export async function getAssessmentByPatientId (req, res) {
  const idPatient = parseInt(req.params.id, 10)
  const idProfesional = req.user.sub

  if (!idPatient) {
    return res.status(404).json({
        success: false,
        message: 'Paciente con ese ID no existe.'
      })
  }

  try {
    const results = await getAssessmentByPatientQuery(idProfesional, idPatient)

    if (!results) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener evaluaciones del paciente o el paciente no existe.'
      })
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'El paciente no tiene evaluaciones asociadas disponibles.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Evaluciones del paciente obtenidas con éxito.',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las evaluaciones del paciente.'
    })
  }
}

export async function updateAssessment (req, res) {
  const idProfesional = req.user.sub
  const idEvaluacion = req.params.id
  const { resultado, observaciones } = req.body

  if (!idEvaluacion) {
    return res.status(400).json({
      success: false,
      message: 'ID de evaluación es requerido.'
    })
  }

  if (resultado === undefined && observaciones === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos resultado u observaciones para actualizar.'
    })
  }

  try {
    const update = await updateAssessmentQuery(idProfesional, idEvaluacion, resultado, observaciones)

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Evaluación no ha podido ser actualizada.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Evaluación actualizada con éxito.',
      data: update[0]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la evaluación.'
    })
  }
}

export async function softDeleteAssessment (req, res) {
  const idEvaluacion = parseInt(req.params.id, 10)

  if (!idEvaluacion) {
    return res.status(400).json({
      success: false,
      message: 'ID de evaluación no válido.'
    })
  }

  try {
    const result = await softDeleteAssessmentQuery(idEvaluacion)
    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Evaluación ha eliminar no encontrado.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Evaluación eliminada con éxito.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la evaluación.'
    })
  }
}
