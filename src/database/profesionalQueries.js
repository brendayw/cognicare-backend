import supabase from '../config/db.js';

//query para obtener el id del usuario a traves del email
export async function getUserIdByEmailQuery(email) {
    const { data, error } = await supabase
        .from('usuario')
        .select('id')
        .eq('email', email);
    
    if (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error;
    }
    return data;
}

//query para obtener los datos del profesional usando el id de usuario
export async function getProfesionalProfileQuery(id_usuario) {
    const { data, error } = await supabase
    .from('profesional')
    .select('id, nombre_completo, especialidad, matricula, telefono, email, dias_atencion, horarios_atencion, genero')
    .is('deleted_at', null)
    .eq('id_usuario', id_usuario);

    if (error) {
        console.error('Error al obtener perfil profesional:', error);
        throw error;
    }
    return data;
}

//query para crear un profesional
export async function createProfesionalQuery(profesional) {
    const { data, error } = await supabase
    .from('profesional')
    .insert([profesional]);

    if (error) {
        console.error('Error al crear profesional:', error);
        throw error;
    }
    return data;
}

export async function updateProfesionalProfileQuery(idProfesional, params) {
    const { data, error } = await supabase
        .from('profesional')
        .update(params)
        .eq('id', idProfesional)
        .select();
;

    if (error) {
        console.error('Error al actualizar perfil profesional:', error);
        throw error;
    }
    return data;
}

//query para eliminar el profesional
export async function softDeleteProfesionalQuery(id) {
    const { data, error } = await supabase
        .from('profesional')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) {
        console.error('Error al eliminar profesional:', error);
        throw error;
    }
    return data;
}