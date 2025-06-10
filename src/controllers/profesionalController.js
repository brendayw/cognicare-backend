import {
    getUserIdByEmailQuery,
    createProfesionalQuery,
    getProfesionalProfileQuery,
    updateProfesionalProfileQuery,
    softDeleteProfesionalQuery
} from '../database/profesionalQueries.js';


export async function registerProfesional(req, res) {
    const { nombre_completo, especialidad, matricula, telefono,
        email, fecha_nacimiento, dias_atencion, horarios_atencion, genero } = req.body
    const id_usuario_autenticado = req.user.sub;

    if ( !nombre_completo || !especialidad || !matricula || !telefono ||
        !email || !fecha_nacimiento || !dias_atencion || !horarios_atencion || !genero) {
        return res.status(400).json({
            success: false,
            message: 'Faltan completar campos obligatorios'
        });
    }

    const existingUser = await getUserIdByEmailQuery(email)

    if (!existingUser || existingUser.length === 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Usuario no encontrado' 
        });
    }

    if (existingUser[0].id !== id_usuario_autenticado) {
        return res.status(403).json({ 
            success: false, 
            message: 'No tienes permiso para registrar un profesional con este email' 
        });
    }

    try {
        await createProfesionalQuery({
            nombre_completo,
            especialidad,
            matricula,
            telefono,
            email,
            fecha_nacimiento,
            dias_atencion,
            horarios_atencion,
            genero,
            id_usuario_autenticado
        });

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
    const userId = req.user.sub;

    try {
        const result = await getProfesionalProfileQuery(userId);
        
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Perfil del profesional no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesional obtenido con éxito',
            data: result[0]
        });

    } catch (error) {
        console.error('Error al obtener el perfil del profesional', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil del profesional'
        });
    }
}

export async function getProfesionalByUserId(req, res) {
    const userId = req.params.idUsuario;
    if (!userId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Falta idUsuario' 
        });
    }

    try {
        const data = await getProfesionalProfileQuery(userId);

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró profesional asociado a ese usuario'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profesional obtenido con éxito',
            data: data[0]
        });

    } catch (error) {
        console.error('Error al obtener profesional por idUsuario', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener profesional por idUsuario'
        });
    }

}

export async function updateProfesional(req, res) {
    const idProfesional= req.params.id;
    const params = req.body;

    try {       
        const update = await updateProfesionalProfileQuery(idProfesional, params);
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

export async function softDeleteProfesional(req, res) {
    const idProfesional = req.params.id;
    if (!idProfesional) {
        return res.status(400).json({
            success: false, 
            message: 'ID del profesional no válido'
        });
    }

    try {
        const result = await softDeleteProfesionalQuery(idProfesional);
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró un profesional para eliminar',
                data: result
            });
        }
        res.status(200).json({
            success: true,
            message: 'Profesional eliminado con éxito'
        });
    } catch (error) {
        console.error('Error al eliminar profesional', error.message);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el profesional'
        });
    }
}