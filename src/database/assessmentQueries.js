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
    .eq('id_profesional', idProfesional)
    .eq('id_paciente', idPatient)
    
    if (error) throw error;
    return data;
}

//query para actualizar una evaluacion
export async function updateAssessmentQuery(idPaciente, idProfesional, nombre_evaluacion, tipo_evaluacion, nuevasObservaciones) {
    const { data, error } = await supabase
    .from('evaluacion')
    .update( {
        observaciones: nuevasObservaciones
    })
    .eq('id_paciente', idPaciente)
    .eq('id_profesional', idProfesional)
    .eq('nombre_evaluacion', nombre_evaluacion)
    .eq('tipo_evaluacion', tipo_evaluacion)
    
    if (error) throw (error);
    return data;
}

//query para eliminar una evaluacion
export async function deleteAssessmentQuery(idEvaluacion) {
    const { error } = await supabase
    .from('evaluacion')
    .select('*')
    .eq('id', idEvaluacion)

    if (error) {
        console.error('Error al eliminar evaluación: ', error)
        throw error;
    }
    return { message: 'Sesión eliminada correctamente'}
}