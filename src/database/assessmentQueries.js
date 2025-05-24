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
    try {
        console.log('🔍 Ejecutando query con idProfesional:', idProfesional);
        
        // Primero, probemos una query simple para verificar conectividad
        const testQuery = await supabase
            .from('evaluacion')
            .select('id, nombre, id_profesional')
            .limit(1);
            
        console.log('🧪 Test query result:', testQuery);

        // Ahora la query principal
        const { data, error } = await supabase
            .from('evaluacion')
            .select(`
                id,
                nombre,
                fecha,
                id_paciente,
                paciente!inner(id, nombre_completo)
            `)
            .eq('id_profesional', idProfesional)
            .order('fecha', { ascending: false });

        console.log('📊 Query data:', data);
        console.log('❌ Query error:', error);

        if (error) {
            console.error('Error en la query de evaluaciones:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error completo en getAssessmentsQuery:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
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