import supabase from '../config/db.js';

//query para obtener el id del usuario a traves del email
export async function getUserIdByEmailQuery(email) {
    const { data, error } = await supabase
        .from('usuario')
        .select('id')
        .eq('email', email);
    
    if (error) throw error;
    return data;
}

//query para obtener los datos del profesional usando el id de usuario
export async function getProfesionalProfileQuery(id_usuario) {
    const { data, error } = await supabase
    .from('profesional')
    .select('id, nombre_completo, especialidad, matricula, telefono, email, dias_atencion, horarios_atencion, genero')
    .is('deleted_at', null)
    .eq('id_usuario', id_usuario);

    if (error) throw error;
    return data;
}

//query para crear un profesional
export async function createProfesionalQuery(profesional) {
    const { email, nombre_completo, especialidad, matricula, telefono, 
        genero, dias_atencion, horarios_atencion, fecha_nacimiento, id_usuario } = profesional;

    const { data, error } = await supabase
    .from('profesional')
    .insert([
        {
            email,
            nombre_completo,
            especialidad,
            matricula,
            telefono,
            genero,
            dias_atencion,
            horarios_atencion,
            fecha_nacimiento,
            id_usuario
        }
    ]);

    if (error) throw error;
    return data;
}

export async function updateProfesionalProfileQuery(idProfesional, nuevoEmail, nuevoNombre, nuevaFecha, nuevaEspecialidad,
    nuevaEdad, nuevaMatricula, nuevoTelefono, nuevoGenero, nuevosDias, nuevosHorarios) {  
        
    console.log('📝 Parámetros recibidos en la consulta:');
    console.log('ID:', idProfesional);
    console.log('Datos:', {
        email: nuevoEmail,
        nombre_completo: nuevoNombre,
        fecha_nacimiento: nuevaFecha,
        especialidad: nuevaEspecialidad,
        edad: nuevaEdad,
        matricula: nuevaMatricula,
        telefono: nuevoTelefono,
        genero: nuevoGenero,
        dias_atencion: nuevosDias,
        horarios_atencion: nuevosHorarios
    });

    const { data, error } = await supabase
    .from('profesional')
    .update({
        email: nuevoEmail,
        nombre_completo: nuevoNombre,
        fecha_nacimiento: nuevaFecha,
        especialidad: nuevaEspecialidad,
        edad: nuevaEdad,
        matricula: nuevaMatricula,
        telefono: nuevoTelefono,
        genero: nuevoGenero,
        dias_atencion: nuevosDias,
        horarios_atencion: nuevosHorarios,
        fecha_actualizacion: new Date().toISOString()
    })
    .eq('id', idProfesional)
    .select();

    console.log('📊 Resultado de Supabase:');
    console.log('Data:', data);
    console.log('Error:', error);

    if (error) throw error;
    return data;
}

//query para eliminar el profesional
export async function softDeleteProfesionalQuery(id) {
    const { data, error } = await supabase
        .from('profesional')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
}