import supabase from '../config/db.js';
import { getPatientsByNameQuery } from '../database/patientQueries.js';
import { 
    deleteReportQuery,
    getReportsByPatientIdQuery,
    logReportQuery,
    updateReportQuery
} from '../database/reportQueries.js';

export async function logReport(req, res) {
    const { tipo_reporte, fecha_reporte, descripcion, nombre_completo, id_evaluacion } = req.body;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No se ha proporcionado ningún archivo'
        });
    }

    const missingFields = {
        tipo_reporte: !tipo_reporte,
        fecha_reporte: !fecha_reporte,
        descripcion: !descripcion,
        nombre_completo: !nombre_completo,
        id_evaluacion: !id_evaluacion
    };

    if (Object.values(missingFields).some(field => field)) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completas campos obligatorios',
            missing_fields: missingFields
        });
    }

    try {
        const patients = await getPatientsByNameQuery(nombre_completo);
        if (!patients || patients.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró un paciente con ese nombre'
            });
        }

        const idPatient = patients[0].id;

        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `reporte-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        const filePath = `reportes/${fileName}`; 

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('reportes')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false //evita la sobreescritura de archivos
            });

        if (uploadError) {
            console.error('Error al subir archivo:', uploadError);
            return res.status(500).json({
                success: false,
                message: 'Error al subir el archivo',
                error: uploadError.message
            });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('reportes')
            .getPublicUrl(filePath);

        // Formatear fecha
        let formattedDate = fecha_reporte;
        if (typeof fecha_reporte === 'string' && !fecha_reporte.includes('T')) {
            const date = new Date(fecha_reporte);
            if (isNaN(date.getTime())) {
                await supabase.storage.from('reportes').remove([filePath]);
                return res.status(400).json({
                    success: false,
                    message: 'Formato de fecha inválido'
                });
            }
            formattedDate = date.toISOString();
        }

        const result = await logReportQuery( tipo_reporte, formattedDate, descripcion, publicUrl,
            id_evaluacion, idPatient );

        res.status(200).json({
            success: true,
            message: 'Reporte creado con éxito',
            data: result,
            file_url: publicUrl
        });

    } catch (error) {
        console.error('Error detallado al crear el reporte:', error);

        if (filePath) {
            try {
                await supabase.storage.from('reportes').remove([filePath]);
            } catch (deleteError) {
                console.error('Error al limpiar archivo: ', deleteError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear el reporte',
            error_details: error.message || 'Error interno del servidor'
        });
    }
}

export async function getReportByPatient(req, res) {
    const idPatient = parseInt(req.params.patientId, 10);
    const idProfesional = req.user.sub

    try {
        const results = await getReportsByPatientIdQuery(idPatient, idProfesional);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay reportes asociados al paciente',
                data: results
            });
        }
        res.status(200).json({
            success: true,
            message: 'Reportes obtenidos con éxito',
            data: results
        });
        
    } catch (error) {
        console.error('Error al obtener los reportes asociados al paciente', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los reportes asociados al paciente'
        });
    }
}

export async function updateReport(req, res) {
    const { id } = req.params;
    const idPatient = parseInt(req.params.patientId, 10);
    const { tipo_reporte, descripcion } = req.body;
    if (!req.file) {
        return res.status(400).json({ 
            error: 'No se subió ningún archivo' 
        });
    }
    if (!tipo_reporte || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'El tipo de reporte y la descripcion son campos obligatorios'
        });
    }

    const archivo = req.file.path;

    try {
        const update = await updateReportQuery(archivo, descripcion, idPatient, tipo_reporte, id);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Reporte no ha podido ser actualizado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Reporte actualizado con éxito',
            data: update
        });

    } catch (error) {
        console.error('Error al actualizar el reporte', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el reporte'
        });
    }
}

export async function deleteReport(req, res) {
    const idReport = parseInt(req.params.id);
    if (!idReport) {
        return res.status(400).json({
            success: false,
            message: 'ID de reporte no válido'
        });
    }

    try {
        const result = await deleteReportQuery(idReport);
        
        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontró el reporte para eliminar',
                data: result
            });
        }
        res.status(200).json({
            success: true,
            message: 'Reporte eliminado con éxito',
            data: result
        });

    } catch (error) {
        console.error('Error al eliminar el reporte', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el reporte'
        });
    }
}