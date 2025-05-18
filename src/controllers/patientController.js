import {
    createPatientQuery,
    getPatientProfileQuery,
    getAllPatientsQuery,
    updatePatientQuery,
    getFilteredPatientsByStateQuery,
    // getPatientsByNameQuery,
    getLatestCreatedPatientsQuery,
    getRecentlyUpdatedPatientsQuery
} from '../database/patientQueries.js';

//crea al paciente
export async function registerPatient(req, res) {
    const { nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono,  email,
        fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
        sesiones_totales, estado, observaciones } = req.body;

    const id_profesional = req.session.userId;

    if (!nombre_completo || !fecha_nacimiento || !edad || !genero || !direccion || !telefono ||
        !fecha_inicio || !motivo_inicial || !sesiones_realizadas || !sesiones_totales || !estado) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorio'
        });
    }

    try {
        const patientData = {
            nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono,  email,
            fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
            sesiones_totales, estado, observaciones, id_profesional
        };

        await createPatientQuery(patientData);
        res.status(200).json({
            success: true,
            message: 'Paciente creado con éxito'
        });

    } catch (error) {
        console.error('Error al crear al paciente', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear al paciente'
        });
    }


}

//obtener el perfil de un paciente
export async function getPatientProfile(req, res) {
    const idPatient = parseInt(req.params.id, 10); 
    console.log('Usuario autenticado (sub):', req.user.sub);
    try {
        const patient = await getPatientProfileQuery(req.user.sub, idProfesional);
        if (!patient || patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Perfil del paciente no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Perfil obtenido con éxito',
            dat: patient[0]
        });

    } catch (error) {
        console.error('Error al obtener el perfil del paciente', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil del paciente'
        });
    }
}

//obtener todos los pacientes
export async function getAllPatients(req, res) {
    console.log('Usuario autenticado (sub):', req.user.sub);
    
    try {
        const results = await getAllPatientsQuery(req.user.sub);
        // Condición corregida para verificar si no hay resultados
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontraron pacientes registrados para el profesional',
                data: []
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Pacientes obtenidos con éxito',
            data: results
        });
        
    } catch (error) {
        console.error('Error al obtener todos los pacientes', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener todos los pacientes'
        });
    }
}

//actualizar perfil de un paciente
export async function updatePatient(req, res) {
    const idPatient = parseInt(req.params.id, 10);
    const params = req.body;

    try {
        const update = await updatePatientQuery(idPatient, params);
        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Perfil del paciente no actualizado'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Paciente actualizado con éxito'
        });

    } catch (error) {
        console.error('Error al actualizar el perfil del paciente');
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfil del paciente'
        });
    }
}

//obtener pacientes en diagnostico
export async function getPatientsUnderDiagnosis(req, res) {
    console.log('Usuario autenticado (sub):', req.user.sub);

    try {
        const pacientes = await getFilteredPatientsByStateQuery(req.user.sub, 'diagnóstico');
        if (pacientes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron pacientes en periodo diagnóstico para este profesional'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pacientes en diagnóstico obtenidos con éxito',
            data: pacientes
        });

    } catch (error) {
        console.error('Error al obtener los pacientes en diagnóstico', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener pacientes en periodo diagnóstico'
        });
    }
}

//obtiene pacientes en tratamiento
export async function getPatientsUnderTreatment(req, res) {
    console.log('Usuario autenticado (sub):', req.user.sub);

    try {
        const pacientes = await getFilteredPatientsByStateQuery(req.user.sub, 'tratamiento');
        if (pacientes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron pacientes en periodo de tratamiento para este profesional'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pacientes en tratamiento obtenidos con éxito',
            data: pacientes
        });

    } catch (error) {
        console.error('Error al obtener los pacientes en tratamiento', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener pacientes en periodo de tratamiento'
        });
    }
}

//obtiene pacientes dados de alta
export async function getPatientsDischarged(req, res) {
    console.log('Usuario autenticado (sub):', req.user.sub);

    try {
        const pacientes = await getFilteredPatientsByStateQuery(req.user.sub, 'alta');
        if (pacientes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron pacientes dados de alta para este profesional'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pacientes de alta obtenidos con éxito',
            data: pacientes
        });

    } catch (error) {
        console.error('Error al obtener los pacientes de alta', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener pacientes de alta'
        });
    }
}

//obtiene pacientes actualizados recientemente
export async function getRecentlyUpdatedPatients(req, res) {
     console.log('Usuario autenticado (sub):', req.user.sub);

    try {
        const results = await getRecentlyUpdatedPatientsQuery(req.user.sub);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontraron pacientes actualizados recientemente',
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pacientes actualizados obtenidos con éxito',
            data: results
        });

    } catch (error) {
        console.error('Error al obtener pacientes actualizados', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener pacientes actualizados'
        });
    }
}

//obtiene los ultimos pacientes creados
export async function getLatestCreatedPatients(req, res) {
    console.log('Usuario autenticado (sub):', req.user.sub);

    try {
        const results = await getLatestCreatedPatientsQuery(req.user.sub);
        console.log('Resultados de la consulta:', results);
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No se encontraron pacientes creados recientemente',
                data: []
            });
        }
        res.status(200).json({
            success: true,
            message: 'Pacientes creados recientemente con éxito',
            data: results
        });
        
    } catch (error) {
        console.error('Error al obtener últimos pacientes creados', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener últimos pacientes creados',
            data: []
        });
    }
}