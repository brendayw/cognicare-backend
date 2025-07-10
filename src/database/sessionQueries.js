import supabase from '../config/db.js'

// query para crear sesion
export async function logSessionQuery(fecha, hora, duracion, estado, tipoSesion, observaciones, idProfesional, idPaciente) {
  const profesionalId = parseInt(idProfesional)
  const pacienteId = parseInt(idPaciente)
  
  const { data, error } = await supabase
  .from('sesion')
  .insert([
    {
      fecha,
      hora,
      duracion,
      observaciones,
      estado,
      tipoSesion,
      idProfesional: profesionalId,
      idPaciente: pacienteId,
    }
  ])

  if (error) throw error
  return data
}

// query para obtener la sesion por su id
export async function getSessionById (idSesion, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deletedAt', null)
    .eq('id', idSesion)
    .eq('idProfesional', idProfesional)

  if (error) throw error
  return data
}

// query para obtener todas las sesiones del paciente
export async function getSessionsByPatientIdQuery (idPaciente, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deletedAt', null)
    .eq('idPaciente', idPaciente)
    .eq('idProfesional', idProfesional)

  if (error) throw error
  return data
}

// query para obtener la ultima sesion registrada para un paciente
export async function getLastSessionForPatientQuery (idPaciente, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deletedAt', null)
    .eq('idProfesional', idProfesional)
    .eq('idPaciente', idPaciente)
    .order('fecha', { ascending: false })
    .limit(1)

  if (error) throw error
  return data
}

// query para editar la sesion
export async function updateSessionQuery(idSesion, idProfesional, nuevaFecha, 
  nuevaHora, nuevaDuracion, nuevasObservaciones, nuevotTipo, nuevoEstado) {
  const { data, error } = await supabase
    .from('sesion')
    .update({
      fecha: nuevaFecha,
      hora: nuevaHora,
      duracion: nuevaDuracion,
      observaciones: nuevasObservaciones,
      tipoSesion: nuevotTipo,
      estado: nuevoEstado,
      fechaActualizacion: new Date().toISOString()
    })
    .eq('id', idSesion)
    .eq('idProfesional', idProfesional)
    .select()

  if (error) { 
    console.error(error.message)
    throw error
  }
  return data
}

// query para eliminar la sesion
export async function softDeleteSessionQuery (idSesion, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .update({ deletedAt: new Date().toISOString() })
    .eq('id', idSesion)
    .eq('idProfesional', idProfesional)
    .select('*', { count: 'exact' })

  if (error) throw error
  return data
}
