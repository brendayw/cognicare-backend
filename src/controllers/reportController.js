import { 
    deleteReportQuery,
    getReportsByPatientIdQuery,
    logReportQuery,
    updateReportQuery
} from '../database/reportQueries.js';

export async function logReport(req, res) {
    if (!req.file) {
        return res.status(400).json({ 
            error: 'No se subio ningún archivo'
        });
    }
    const idAssessment = req.params.assessmentId;
    const idPatient = req.params.patientId;
    const { tipo_reporte, fecha_reporte, descripcion } = req.body;
    
    const archivo = req.file.path;

    if ( !tipo_reporte || !fecha_reporte || !descripcion || !archivo) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
        });
    }

    try {
        const result = await logReportQuery(tipo_reporte, fecha_reporte, descripcion, archivo, idAssessment, idPatient);
        res.status(200).json({
            success: true,
            message: 'Reporte creado con éxito',
            data: result
        });

    } catch (error) {
        console.error('Error al crear el reporte', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el reporte'
        });
    }
}

export async function getReportByPatient(req, res) {
    const idPatient = parseInt(req.params.patientId, 10);

    try {
        const results = await getReportsByPatientIdQuery(idPatient);
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