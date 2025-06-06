import supabase from '../config/db.js';

//query para crear el reporte
export async function logReportQuery(tipo_reporte, fecha_reporte, descripcion, archivo, id_evaluacion, id_paciente) {
    try {
        if (!tipo_reporte || !fecha_reporte || !archivo ){
            throw new Error('Campos requeridos: tipo de reporte, fecha del reporte y archivo');
        }

        const evaluacionId = parseInt(id_evaluacion);
        const pacienteId = parseInt(id_paciente);
        if (isNaN(evaluacionId) || isNaN(pacienteId)) {
            throw new Error("id_evaluacion e id_paciente deben ser números válidos");
        }

        const { data, error } = await supabase
            .from('reporte')
            .insert([
                {
                    tipo_reporte,
                    fecha_reporte,
                    descripcion,
                    archivo,
                    id_evaluacion: evaluacionId,
                    id_paciente: pacienteId
                }
            ])
            .select();

        if (error) {
            console.error('Error de Supabase:', error);
            throw new Error(`Error de base de datos: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error en logReportQuery:', error);
        throw error;
    }
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
export async function getReportsByPatientIdQuery(idPatient) {
    const { data, error } = await supabase
    .from('reporte')
    .select(`
      id,
      fecha_reporte,
      descripcion,
      archivo,
      tipo_reporte,
      id_evaluacion,
      evaluacion: id_evaluacion (
        nombre_evaluacion
      )
    `)
    .eq('id_paciente', idPatient)
    .order('fecha_reporte', { ascending: false });
    
    if (error) throw error;
    return data;
}

//query para actualziar reporte
export async function updateReportQuery(idReporte, nuevaFecha, nuevaDescripcion, nuevoTipo, nuevoArchivo, ) {
    const { data, error } = await supabase
    .from('reporte')
    .update({
        fecha_reporte: nuevaFecha,
        descripcion: nuevaDescripcion,
        tipo_reporte: nuevoTipo,
        archivo:  nuevoArchivo, 
    })
    .eq('id', idReporte)
    .select()
    .single();
    
    if (error) throw error;
    console.log('Datos actualizados:', data);
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