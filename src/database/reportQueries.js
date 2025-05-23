import supabase from '../config/db.js';

//query para crear el reporte
export async function logReportQuery(tipo_reporte, fecha_reporte, descripcion, archivo, idAssessment, idPatient) {
    const { data, error } = await supabase
    .from('reporte')
    .insert([ 
        {
            tipo_reporte,
            fecha_reporte,
            descripcion, 
            archivo,
            id_evaluacion, 
            id_paciente
        }
    ])
    .select();

    if (error) throw error;
    return data;
}

//query para obtener id del reporte
export async function getReportByIdQuery(idReport) {
    const { data, error } = await supabase
    .from('reporte')
    .select('*')
    .eq('id', idReport)
    .single();

    if (error) throw error;
    return data;
}

//query para obtener los reportes del paciente
export async function getReportsByPatientIdQuery(idPatient, idEvaluacion) {
    const { data, error } = await supabase
    .from('reporte')
    .select('*')
    .eq('id_paciente', idPatient)
    .eq('id_evaluacion', idEvaluacion)
    
    if (error) throw error;
    return data;
}

//query para actualziar reporte
export async function updateReportQuery(idReporte, idPatient, nuevoArchivo, nuevaDescripcion, tipo_reporte, fecha_reporte) {
    const { data, error } = await supabase
    .from('reporte')
    .update({
        archivo:  nuevoArchivo, 
        descripcion: nuevaDescripcion 
    })
    .eq('id', idReporte)
    .eq('id_paciente', idPatient)
    .eq('tipo_reporte', tipo_reporte)
    .eq('fecha_reporte', fecha_reporte)
    .select();
    
    if (error) throw error;
    return data;
}

//query para eliminar reporte
export async function deleteReportQuery(idReport) {
    const { data, error } = await supabase
    .from('reporte')
    .select('*')
    .eq('id', idReport)
    .single();

    if (error) throw error;
    return data;
}