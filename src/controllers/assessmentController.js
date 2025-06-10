import {
    logAssessmentQuery,
    getAssessmentsQuery,
    getAssessmentByPatientQuery,
    updateAssessmentQuery,
    softDeleteAssessmentQuery
} from '../database/assessmentQueries.js';
import { getPatientsByNameQuery } from '../database/patientQueries.js';

export async function logAssessment(req, res) {
    const id_profesional = req.user.sub;

    const { fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, 
        observaciones, nombre_completo } = req.body;

    if ( !fecha_evaluacion || !nombre_evaluacion || !tipo_evaluacion || !resultado || !nombre_completo) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
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

        const patient = patients[0]; 

        const assessmentData = { 
            fecha_evaluacion, 
            nombre_evaluacion, 
            tipo_evaluacion, 
            resultado, 
            observaciones, 
            id_profesional, 
            id_paciente: patient.id
        };
        
        await logAssessmentQuery(assessmentData);
        res.status(200).json({
            success: true,
            message: 'Evaluación creada con éxito',
            data: assessmentData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la evaluación'
        });
    }
}

export async function getAssessments(req, res) {
    const idProfesional = req.user.sub;

    try {
        if (!idProfesional) {
            return res.status(400).json({
                success: false,
                message: 'ID del profesional no encontrado en el token'
            });
        }

        const data = await getAssessmentsQuery(idProfesional);
        
        if (!data || data.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay evaluaciones registradas',
                data: []
            });
        }

        const formattedData = data.map(item => ({
            id: item.id,
            nombre: item.nombre_evaluacion,
            fecha: item.fecha_evaluacion,
            resultado: item.resultado,
            observaciones: item.observaciones,
            tipo: item.tipo_evaluacion,
            paciente: {
                id: item.id_paciente,
                nombre: item.paciente?.nombre_completo || 'Nombre no disponible'
            }
        }));

        res.status(200).json({
            success: true,
            message: 'Evaluaciones obtenidas con éxito',
            data: formattedData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las evaluaciones del paciente',
            error: error.message
        });
    }
}

export async function getAssessmentByPatientId(req, res) {
    const idPatient = parseInt(req.params.id, 10);
    const idProfesional = req.user.sub;
    
    try {
        const results = await getAssessmentByPatientQuery(idProfesional, idPatient);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'El paciente no tiene evaluaciones registradas',
                data: results
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluciones obtenidas con éxito',
            data: results
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las evaluaciones del paciente'
        });
    }

}

export async function updateAssessment(req, res) {
    const id_profesional = req.user.sub;
    const id_evaluacion = req.params.id;
    const { resultado, observaciones } = req.body;

    if (!id_evaluacion) {
        return res.status(400).json({
            success: false,
            message: 'ID de evaluación es requerido'
        });
    }

    if (resultado === undefined && observaciones === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Debe proporcionar al menos resultado u observaciones para actualizar'
        });
    }

    try {
        const update = await updateAssessmentQuery(id_profesional, id_evaluacion, resultado, observaciones);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Evaluación no ha podido ser actualizada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluación actualizada con éxito',
            data: update[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la evaluación'
        });
    }
}

export async function softDeleteAssessment(req, res) {
    const idEvaluacion = parseInt(req.params.id, 10);
    if (!idEvaluacion) {
        return res.status(400).json({
            success: false,
            message: 'ID de evaluación no válido'
        });
    }

    try {
        const result = await softDeleteAssessmentQuery(idEvaluacion);
        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontraron evaluaciones para eliminar',
                data: result
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluación eliminada con éxito'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la evaluación'
        });
    }
}