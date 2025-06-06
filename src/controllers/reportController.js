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
            message: 'Faltan completar campos obligatorios',
            missing_fields: missingFields
        });
    }

    let filePath;

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
        filePath = `reportes/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('reportes')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('reportes')
            .getPublicUrl(filePath);

        let formattedDate = fecha_reporte;
        if (typeof fecha_reporte === 'string' && !fecha_reporte.includes('T')) {
            const date = new Date(fecha_reporte);
            if (isNaN(date.getTime())) {
                await supabase.storage.from('reportes').remove([filePath]);
                return res.status(400).json({
                    success: false,
                    message: 'Formato de fecha inválido. Use YYYY-MM-DD'
                });
            }
            formattedDate = date.toISOString();
        }

        const result = await logReportQuery( tipo_reporte, formattedDate, descripcion,
            publicUrl, parseInt(id_evaluacion), idPatient );

        return res.status(200).json({
            success: true,
            message: 'Reporte creado con éxito',
            data: result,
            file_url: publicUrl
        });

    } catch (error) {
        console.error('Error en logReport:', error);

        if (filePath) {
            await supabase.storage.from('reportes').remove([filePath])
                .catch(deleteError => console.error('Error al limpiar archivo:', deleteError));
        }

        if (error.message.includes('row-level security')) {
            return res.status(403).json({
                success: false,
                message: 'Permisos insuficientes. Configura políticas RLS en Supabase para la tabla "reporte"',
                error_details: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error al crear el reporte',
            error_details: error.message
        });
    }
}

export async function getReportsByPatientId(req, res) {
    const id_paciente = parseInt(req.params.id, 10);

    try {
        const results = await getReportsByPatientIdQuery(id_paciente);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'El paciente no tiene reportes registrados',
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
    const id_reporte = req.params.id;
    const id_profesional = req.user.sub;
    const { fecha_reporte, descripcion, tipo_reporte } = req.body;

    if (!req.file) {
        return res.status(400).json({ 
            error: 'No se subió ningún archivo' 
        });
    }

    if (descripcion === undefined && tipo_reporte === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Debe proporcionar al menos una descripcion o tipo de reporte para actualizar'
        });
    }

    const archivo = req.file.path;

    try {
        const update = await updateReportQuery(id_reporte, id_profesional, fecha_reporte, descripcion, tipo_reporte, archivo);
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