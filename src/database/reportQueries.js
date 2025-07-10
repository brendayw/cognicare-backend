import supabase from '../config/db.js'

// query para crear el reporte
export async function logReportQuery (tipoReporte, fechaReporte, descripcion, archivo, idEvaluacion, idPaciente) {
  try {
    if (!tipoReporte || !fechaReporte || !archivo) {
      throw new Error('Campos requeridos: tipo de reporte, fecha del reporte y archivo')
    }

    const evaluacionId = parseInt(idEvaluacion)
    const pacienteId = parseInt(idPaciente)
    if (isNaN(evaluacionId) || isNaN(pacienteId)) {
      throw new Error('idEvaluacion e idPaciente deben ser números válidos')
    }

    const { data, error } = await supabase
      .from('reporte')
      .insert([
        {
          tipoReporte,
          fechaReporte,
          descripcion,
          archivo,
          idEvaluacion: evaluacionId,
          idPaciente: pacienteId
        }
      ])
      .select()

    if (error) throw new Error(`Error de base de datos: ${error.message}`)
    return data
  } catch (error) {
    throw error
  }
}

// query para obtener id del reporte
export async function getReportByIdQuery (idReport) {
  const { data, error } = await supabase
    .from('reporte')
    .select('*')
    .is('deletedAt', null)
    .eq('id', idReport)
    .single()

  if (error) throw error
  return data
}

// query para obtener los reportes del paciente
export async function getReportsByPatientIdQuery (idPatient) {
  const { data, error } = await supabase
    .from('reporte')
    .select(`
      id,
      fechaReporte,
      descripcion,
      archivo,
      tipoReporte,
      idEvaluacion,
      evaluacion: idEvaluacion (
        nombreEvaluacion
      )
    `)
    .eq('idPaciente', idPatient)
    .is('deletedAt', null)
    .order('fechaReporte', { ascending: false })

  if (error) throw error
  return data
}

// query para actualziar reporte
export async function updateReportQuery (idReporte, nuevaFecha, nuevaDescripcion, nuevoArchivo, nuevoTipo) {
  const { data, error } = await supabase
    .from('reporte')
    .update({
      fechaReporte: nuevaFecha,
      descripcion: nuevaDescripcion,
      archivo: nuevoArchivo,
      tipoReporte: nuevoTipo,
      fechaActualizacion: new Date().toISOString()
    })
    .eq('id', idReporte)
    .select()

  if (error) throw error
  return data
}

// query para eliminar reporte
export async function softDeleteReportQuery (idReporte) {
  const { data, error } = await supabase
    .from('reporte')
    .update({ deletedAt: new Date().toISOString() })
    .eq('id', idReporte)
    .select('*', { count: 'exact' })

  if (error) throw error
  return data
}
