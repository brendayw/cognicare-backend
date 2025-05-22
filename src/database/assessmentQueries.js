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

//query para obtener las evaluaciones asociadas a un paciente
export async function getAssessmentByPatientQuery(idProfesional, idPatient) {
    const { data, error } = await supabase
    .from('evaluacion')
    .select('*')
    .eq('id_profesional', idProfesional)
    .eq('id_paciente', idPatient)
    .single();
    
    if (error) throw error;
    return data;
}

//query para actualizar una evaluacion
export async function updateAssessmentQuery(idPaciente, nombreEvaluacion, tipoEvaluacion, nuevasObservaciones) {
    const { data, error } = await supabase
    .from('evaluacion')
    .update( {
        observaciones: nuevasObservaciones
    })
    .eq('id_paciente', idPaciente)
    .eq('nombre_evaluacion', nombreEvaluacion)
    .eq('tipo_evaluacion', tipo_evaluacion)
    
    if (error) throw (error);
    return data;
}

//query para eliminar una evaluacion
export async function deleteAssessmentQuery(idEvaluacion) {
    const { data, error } = await supabase
    .from('evaluacion')
    .select('*')
    .eq('id', idEvaluacion)

    if (error) {
        console.error('Error al eliminar evaluación: ', error)
        throw error;
    }
    return { message: 'Sesión eliminada correctamente'}
}