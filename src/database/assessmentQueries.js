import supabase from '../config/db.js';

//query para crear una evaluacion
export async function logAssessmentQuery(assessment) {
    const { fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, 
        observaciones, id_profesional, id_paciente } = assessment;
    
    const { data, error } = await supabase
    .from('evaluacion')
    .insert([
        {
            fecha_evaluacion,
            nombre_evaluacion,
            tipo_evaluacion,
            resultado,
            observaciones,
            id_profesional,
            id_paciente
        },
    ]);

    if (error) throw error;
    return data;
}

//query para obtener las evaluaciones
export async function getAssessmentsQuery(idProfesional) {
    const { data, error } = await supabase
        .from('evaluacion')
        .select(`
            id,
            nombre_evaluacion,
            fecha_evaluacion,
            id_paciente,
            resultado,
            observaciones,
            tipo_evaluacion,
            paciente!inner(id, nombre_completo)
        `)
        .is('deleted_at', null)
        .eq('id_profesional', idProfesional)
        .order('fecha_evaluacion', { ascending: false });

    if (error) throw error;
    return data;
}

//query para obtener las evaluaciones asociadas a un paciente
export async function getAssessmentByPatientQuery(idProfesional, idPatient) {
    const { data, error } = await supabase
    .from('evaluacion')
    .select('*')
    .is('deleted_at', null)
    .eq('id_profesional', idProfesional)
    .eq('id_paciente', idPatient)
    
    if (error) throw error;
    return data;
}

//query para actualizar una evaluacion
export async function updateAssessmentQuery(idProfesional, id_evaluacion, actualizoResultado, nuevasObservaciones) {
    const { data, error } = await supabase
    .from('evaluacion')
    .update( {
        resultado: actualizoResultado,
        observaciones: nuevasObservaciones,
        fecha_actualizacion: new Date()
    })
    .eq('id', id_evaluacion)
    .eq('id_profesional', idProfesional)
    .select()
    .single();
        
    if (error) throw (error);

    console.log('Datos actualizados:', data);
    return data;
}

//query para eliminar una evaluacion
export async function softDeleteAssessmentQuery(idEvaluacion) {
    const { error } = await supabase
    .from('evaluacion')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', idEvaluacion)

    if (error) throw error;
    return { message: 'Sesión eliminada correctamente'}
}