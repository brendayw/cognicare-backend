import supabase from '../config/db.js';

//query para crear sesion
export async function logSessionQuery(fecha, hora, duracion, estado, tipo_sesion, observaciones, id_profesional, id_paciente) {
    const { data, error } = await supabase
    .from('sesion')
    .insert([
        {
            fecha,
            hora,
            duracion,
            estado,
            tipo_sesion,
            observaciones, 
            id_profesional,
            id_paciente
        },
    ])
    .select();
    
    if (error) throw error;
    return data;
}

//query para obtener la sesion por su id
export async function getSessionById(idSession, idProfesional) {
    const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)
    .single();

    if (error) throw error;
    return data;

}

//query para obtener todas las sesiones del paciente
export async function getSessionsByPatientIdQuery(idPatient) {
    const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .eq('id_paciente', idPatient);

    if (error) throw error;
    return data;
}

//query para obtener la ultima sesion registrada para un paciente
export async function getLastSessionForPatientQuery(idPatient) {
    const { data, error} = await supabase
    .from('session')
    .select('*')
    .eq('id_paciente', idPatient)
    .order('fecha', { ascending: false})
    .limit(1)

    if (error) throw error;
    return data;
}

//query para editar la sesion
export async function updateSessionQuery(idSession, idProfesional, nuevasObservaciones) {
    const { data, error } = await supabase
    .from('sesuion')
    .update({ observaciones: nuevasObservaciones })
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)
    .select();

    if (error) throw error;
    return data;
}

//query para eliminar la sesion
export async function deleteSessionQuery(idSession, idProfesional) {
    const { data, error } = await supabase
    .from('sesion')
    .delete()
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)

    if (error) {
        console.error('Error al eliminar sesión:', error);
        throw error;
    }

    return {message: 'Sesión eliminada correctamente'}
}