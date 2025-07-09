import supabase from '../config/db.js'

// query para crear sesion
export async function logSessionQuery (fecha, hora, duracion, estado, tipo_sesion, observaciones, id_profesional, id_paciente) {
  const { data, error } = await supabase
    .from('sesion')
    .insert([
      {
        fecha,
        hora,
        duracion,
        estado,
        tipo_sesion,
        observaciones,
        id_profesional,
        id_paciente
      }
    ])

  if (error) throw error
  return data
}

// query para obtener la sesion por su id
export async function getSessionById (idSession, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deleted_at', null)
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)

  if (error) throw error
  return data
}

// query para obtener todas las sesiones del paciente
export async function getSessionsByPatientIdQuery (idPatient, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deleted_at', null)
    .eq('id_paciente', idPatient)
    .eq('id_profesional', idProfesional)

  if (error) throw error
  return data
}

// query para obtener la ultima sesion registrada para un paciente
export async function getLastSessionForPatientQuery (idPatient, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .select('*')
    .is('deleted_at', null)
    .eq('id_profesional', idProfesional)
    .eq('id_paciente', idPatient)
    .order('fecha', { ascending: false })
    .limit(1)

  if (error) throw error
  return data
}

// query para editar la sesion
export async function updateSessionQuery (idSession, idProfesional, nuevaFecha,
  nuevaHora, nuevaDuracion, nuevotTipo, nuevoEstado, nuevasObservaciones) {
  const { data, error } = await supabase
    .from('sesion')
    .update({
      fecha: nuevaFecha,
      hora: nuevaHora,
      duracion: nuevaDuracion,
      observaciones: nuevasObservaciones,
      tipo_sesion: nuevotTipo,
      estado: nuevoEstado,
      fecha_actualizacion: new Date().toISOString()
    })
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)
    .select()
    .single()

  if (error) throw error
  return data
}

// query para eliminar la sesion
export async function softDeleteSessionQuery (idSession, idProfesional) {
  const { data, error } = await supabase
    .from('sesion')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', idSession)
    .eq('id_profesional', idProfesional)

  if (error) throw error
  return data
}
