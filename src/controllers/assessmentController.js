import {
    logAssessmentQuery,
    getAssessmentByPatientQuery,
    updateAssessmentQuery,
    deleteAssessmentQuery,
    getAssessmentsQuery
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
        console.error('Error al crear la evaluación', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la evaluación'
        });
    }
}

export async function getAssessments(req, res) {
    const idProfesional = req.user.sub;

    try {
        const { data, error } = await getAssessmentsQuery(idProfesional);

        if (error) throw error;
        
        if (!data || data.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay evaluaciones registradas',
                data: []
            });
        }

        const formattedData = data.map(item => ({
            id: item.id,
            nombre: item.nombre,
            fecha: item.fecha,
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
        console.error('Error al obtener las evaluaciones del paciente');
        res.status(500).json({
            success: false,
            message: 'Error al obtener las evaluaciones del paciente'
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
        const update = await updateAssessmentQuery(idPatient, idProfesional, observaciones, nombre_evaluacion, tipo_evaluacion);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Evaluación no ha podido ser actualizada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Evaluación actualizada con éxito',
            data: update
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
        console.error('Error al eliminar la evaluación', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la evaluación'
        });
    }
}