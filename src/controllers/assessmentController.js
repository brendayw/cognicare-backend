import {
    logAssessmentQuery,
    getAssessmentByPatientQuery,
    updateAssessmentQuery,
    deleteAssessmentQuery
} from '../database/assessmentQueries.js';
import { verifySession } from './profesionalController.js';

export async function logAssessment(req, res) {
    const id_profesional = req.session.userId;
    const { fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, 
        observaciones, id_paciente } = req.body;
    
    if (!id_profesional) {
        await verifySession(email);
    }

    if ( !fecha_evaluacion || !nombre_evaluacion || !tipo_evaluacion || !resultado ) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
        });
    }

    try {
        const assessmentData = {
            fecha_evaluacion, 
            nombre_evaluacion, 
            tipo_evaluacion, 
            resultado, 
            observaciones, 
            id_profesional,
            id_paciente
        };
        await logAssessmentQuery(assessmentData);
        res.status(200).json({
            success: true,
            message: 'Evaluación creada con éxito'
        });
    } catch (error) {
        console.error('Error al crear la evaluación', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la evaluación'
        });
    }
}

export async function getAssessmentByPatientId(req, res) {
    const idPatient = parseInt(req.params.id, 10);
    const idProfesional = req.session.userId;
    
    try {
        const results = await getAssessmentByPatientQuery(idProfesional, idPatient);

        if (!results || !results.lenght === 0) {
            return res.status(400).json({
                success: false,
                message: 'Evaluación no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            message: results[0]
        });

    } catch (error) {
        console.error('Error al obtener las evaluaciones del paciente');
        res.status(500).json({
            success: false,
            message: 'Error al obtener las evaluaciones del paciente'
        });
    }

}

export async function updateAssessment(req, res) {
    const idPatient = parseInt(req.params.id,10);
    const { nombre_evaluacion, tipo_evaluacion, observaciones } = req.body;

    if (!nombre_evaluacion || !tipo_evaluacion || !observaciones) {
        return res.status(400).json({
            success: false,
            message: 'Nombre, tipo y observaciones son campos obligatorios'
        });
    }

    try {
        const update = await updateAssessmentQuery(observaciones, idPatient, nombre_evaluacion, tipo_evaluacion);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Evaluación no ha podido ser actualizada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluación actualizada con éxito'
        });

    } catch (error) {
        console.error('Error al actualizar la evaluación');
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la evaluación'
        });
    }
}

export async function deleteAssessment(req, res) {
    const idEvaluacion = parseInt(req.params.id, 10);
    if (!idEvaluacion) {
        return res.status(400).json({
            success: false,
            message: 'ID de evaluación no válido'
        });
    }

    try {
        const result = await deleteAssessmentQuery(idEvaluacion);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la evaluación para eliminar'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluación eliminada con éxito'
        })
    } catch (error) {
        console.error('Error al eliminar la evaluación', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la evaluación'
        });
    }
}