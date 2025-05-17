import supabase from '../config/db.js';

//query para crear un paciente
export async function createPatientQuery(patient) {
    const { nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono, email,
        fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
        sesiones_totales, estado, observaciones, id_profesional } = patient;

    const { data, error } = await supabase
    .from('paciente')
    .insert([
      {
        nombre_completo,
        fecha_nacimiento,
        edad,
        genero,
        direccion,
        telefono,
        email,
        fecha_inicio,
        fecha_fin,
        motivo_inicial,
        motivo_alta,
        sesiones_realizadas,
        sesiones_totales,
        estado,
        observaciones,
        id_profesional,
      },
    ]);

    if (error) throw error;
    return data;
}

//query para obtener datos del paciente por su id
export async function getPatientProfileQuery(id, idProfesional) {
    const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('id', id)
    .eq('id_profesional', idProfesional)
    .single();

    if (error) throw error;
    return data;
}

//obtener todos los pacientes por profesional
export async function getAllPatientsQuery(idProfesional) {
    const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('id_profesional', idProfesional);

    if (error) throw error;
    return data;
}

//query para actualizar datos del paciente
export async function updatePatientQuery(id, params) {
    if (Object.keys(params).length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
    }

    // Agregar fecha_actualizacion automáticamente
    params.fecha_actualizacion = new Date().toISOString();

    const { data, error } = await supabase
    .from('paciente')
    .update(params)
    .eq('id', id);

    if (error) throw error;
    return data;
}

// Query para obtener los pacientes segun su estado: diagnostico / tratamiento / alta
export async function getFilteredPatientsByStateQuery(idProfesional, estado) {
    const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('id_profesional', idProfesional)
    .eq('estado', estado)
    .order('id', { ascending: false });

    if (error) throw error;
    return data;
}

//query para el searchbar
export async function getPatientsByNameQuery(searchText) {
    const { data, error } = await supabase
    .from('paciente')
    .select('id, nombre_completo')
    .ilike('nombre_completo', `%${searchText}%`);

    if (error) throw error;
    return data;
}

//query para obtener ultimos pacientes creados
export async function getLatestCreatedPatientsQuery(idProfesional) {
    const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('id_profesional', idProfesional)
    .order('id', { ascending: false })
    .limit(3);

    if (error) throw error;
    return data;
}

//query para obtener los ultimos pacientes editados por el profesional
export async function getRecentlyUpdatedPatientsQuery(idProfesional) {
    const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('id_profesional', idProfesional)
    .not('fecha_actualizacion', 'is', null)
    .order('fecha_actualizacion', { ascending: false })
    .limit(3);

    if (error) throw error;
    return data;
}

//query para eliminar al paciente
export async function deletePatient(id, id_profesional) {
    const { error } = await supabase
    .from('paciente')
    .delete()
    .match({ id, id_profesional });

    if (error) {
        console.error('Error eliminando paciente:', error);
        throw error;
    }

    return { message: 'Paciente eliminado correctamente' };
}