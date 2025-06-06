import { getPatientsByNameQuery } from "../database/patientQueries.js";
import { 
    logSessionQuery,
    getSessionsByPatientIdQuery,
    getLastSessionForPatientQuery,
    updateSessionQuery,
    softDeleteSessionQuery
} from "../database/sessionQueries.js";

//insertar sesion
export async function logSession(req, res) {
    const id_profesional = req.user.sub;

    const { fecha, hora, duracion, estado, tipo_sesion, observaciones, nombre_completo } = req.body;
    
    if ( !fecha || !hora || !duracion || !estado || !tipo_sesion || !nombre_completo) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
        });
    }

    try {
        const patients = await getPatientsByNameQuery(nombre_completo);
        if (!patients || patients.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Faltan completar campos obligatorios'
            });
        }

        const patient = patients[0];
        const id_paciente = patient.id;

        const result = await logSessionQuery(fecha, hora, duracion, estado, tipo_sesion, 
            observaciones, id_profesional, id_paciente);
        res.status(200).json({
            success: true,
            message: 'Sesión creada con éxito',
            data: result
        });

    } catch (error) {
        console.error('Error al crear la sesión', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la sesión'
        });
    }
}

//obtener las sesiones por paciente
export async function getSessionsByPatient(req, res) {
    const id_paciente = parseInt(req.params.id, 10);
    const id_profesional = req.user.sub
    try {
        const results = await getSessionsByPatientIdQuery(id_paciente, id_profesional);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'El paciente no tiene sesiones registradas',
                data: results
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sesiones obtenidas con éxito',
            data: results
        });
        
    } catch (error) {
        console.error('Error al obtener las sesiones asociadas al paciente');
        res.status(500).json({
            success: false,
            message: 'Error al obtener las sesiones asociadas al paciente',
            error: error.message
        });
    }
}

//obtener la ultima sesion por paciente
export async function getLastSessionForPatient(req, res) {
    const idPatient = parseInt(req.params.patientId, 10);
    const idProfesional = req.user.sub;

    try {
        const result = await getLastSessionForPatientQuery(idPatient, idProfesional);
        if (!result) {
            return res.status(200).json({
                success: true,
                message: 'No hay sesiones asociadas al paciente',
                data: result
            });
        }
        res.status(200).json({
            success: true,
            message: 'Última sesión del paciente obtenida con éxito',
            data: result
        });
        
    } catch (error) {
        console.error('Error al obtener la útlima sesión asociada al paciente');
        res.status(500).json({
            success: false,
            message: 'Error al obtener la útlima sesión asociada al paciente'
        });
    }
}

//actualizar la sesion
export async function updateSession(req, res) {
    const idSession = parseInt(req.params.sessionId,10);
    const idProfesional = req.user.sub;
    const { observaciones } = req.body;

    if ( !observaciones) {
        return res.status(400).json({
            success: false,
            message: 'Observaciones es un campo obligatorio para actualizar la sesión'
        });
    }

    try {
        const update = await updateSessionQuery(observaciones, idSession, idProfesional);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Sesión no ha podido ser actualizada'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sesión actualizada con éxito',
            data: update
        });

    } catch (error) {
        console.error('Error al actualizar la sesión');
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la sesión'
        });
    }
}

//borrar la sesion
export async function softDeleteSession(req, res) {
    const idSession = parseInt(req.params.sessionId, 10);
    if (!idSession) {
        return res.status(400).json({
            success: false,
            message: 'ID de sesión no válido'
        });
    }

    try {
        const result = await softDeleteSessionQuery(idSession);
        if (!result || result.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontraron sesiones registradas para eliminar',
                data: result
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sesión eliminada con éxito'
        });
        
    } catch (error) {
        console.error('Error al eliminar la sesión', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la sesión'
        });
    }
}