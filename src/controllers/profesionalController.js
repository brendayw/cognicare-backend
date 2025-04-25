import {
    getUserIdByEmailQuery,
    createProfesionalQuery,
    getProfesionalProfileQuery,
    updateProfesionalProfileQuery,
} from '../database/profesionalQueries.js';

//query para verificar que el usuario esta autenticado
export function verifySession(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            message: 'No autorizado'
        });
    }
    next();
}

export async function registerProfesional(req, res) {
    const { nombre_completo, especialidad, matricula, telefono,
        correo_electronico, fecha_nacimiento, dias_atencion, horarios_atencion, id_usuario } = req.body
    console.log("Datos que obtengo ", req.body);

    if (! nombre_completo || !especialidad || !matricula || !telefono ||
        !correo_electronico || !fecha_nacimiento || !dias_atencion || !horarios_atencion) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
        });
    }

    try {
        const existingUser = await getUserIdByEmailQuery(correo_electronico);
        console.log("Resultado de getUserIdByEmailQuery:", existingUser);

        if (!existingUser || existingUser.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no encontrado por email'
            });
        }

        const id_usuario = existingUser[0]?.id;
        await createProfesionalQuery({
            nombre_completo,
            especialidad,
            matricula,
            telefono,
            correo_electronico,
            fecha_nacimiento,
            dias_atencion,
            horarios_atencion,
            id_usuario
        });
        console.log("Datos que paso: " , req.body);

        res.status(200).json({
            success: true,
            message: 'Profesional credo con éxito'
        });

    } catch (error) {
        console.error('Error al crear al profesional', error);
        res.status(500).json({
            success: false,
            messag: 'Error al crear al profesional'
        });
    }
}

export async function getProfesional(req, res) {
    const userId = req.session.userId;
    if (!userId) {
        await verifySession(email);
    }

    try {
        const profesional = await getProfesionalProfileQuery(userId);
        console.log("Datos del profesional: ", profesional);

        if (!profesional) {
            return res.status(404).json({
                success: false,
                message: 'Perfil del profesional no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: profesional
        });

    } catch (error) {
        console.error('Error al obtener el perfil del profesional', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil del profesional'
        });
    }
}

export async function updateProfesional(req, res) {
    const userId = req.session.userId;
    if (!userId) {
        await verifySession(email);
    }

    const params = req.body;
    try {       
        const update = await updateProfesionalProfileQuery(userId, params);
        console.log("Datos a actualizar: ", update);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Perfil del profesional no actualizado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesional actualizado con éxito'
        });

    } catch (error) {
        console.error('Error al actualizar el perfil del profesional');
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfil del profesional',
            error: error.message
        });
    }
}

