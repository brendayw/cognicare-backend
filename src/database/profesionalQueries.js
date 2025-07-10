import supabase from '../config/db.js'

// query para obtener el id del usuario a traves del email
export async function getUserIdByEmailQuery (email) {
  const { data, error } = await supabase
    .from('usuario')
    .select('id')
    .eq('email', email)

  if (error) throw error
  return data
}

// query para obtener los datos del profesional usando el id de usuario
export async function getProfesionalProfileQuery (idUsuario) {
  const { data, error } = await supabase
    .from('profesional')
    .select('id, nombreCompleto, especialidad, matricula, telefono, email, diasAtencion, horariosAtencion, genero')
    .is('deletedAt', null)
    .eq('idUsuario', idUsuario)
    .select('*', { count: 'exact' })

  if (error) throw error
  return data
}

// query para crear un profesional
export async function createProfesionalQuery (profesional) {
  const {
    email, nombreCompleto, especialidad, matricula, telefono,
    genero, diasAtencion, horariosAtencion, fechaNacimiento, idUsuario
  } = profesional

  const { data, error } = await supabase
    .from('profesional')
    .insert([
      {
        email,
        nombreCompleto,
        especialidad,
        matricula,
        telefono,
        genero,
        diasAtencion,
        horariosAtencion,
        fechaNacimiento,
        idUsuario
      }
    ])

  if (error) throw error
  return data
}

export async function updateProfesionalProfileQuery (idProfesional, nuevoEmail, nuevoNombre, nuevaFecha, nuevaEspecialidad,
  nuevaEdad, nuevaMatricula, nuevoTelefono, nuevoGenero, nuevosDias, nuevosHorarios) {
  const { data, error } = await supabase
    .from('profesional')
    .update({
      email: nuevoEmail,
      nombreCompleto: nuevoNombre,
      fechaNacimiento: nuevaFecha,
      especialidad: nuevaEspecialidad,
      edad: nuevaEdad,
      matricula: nuevaMatricula,
      telefono: nuevoTelefono,
      genero: nuevoGenero,
      diasAtencion: nuevosDias,
      horariosAtencion: nuevosHorarios,
      fechaActualizacion: new Date().toISOString()
    })
    .eq('id', idProfesional)
    .select()

  if (error) throw error
  return data
}

// query para eliminar el profesional
export async function softDeleteProfesionalQuery (id) {
  const { data, error } = await supabase
    .from('profesional')
    .update({ deletedAt: new Date().toISOString() })
    .eq('id', id)
    .select('*', { count: 'exact' })

  if (error) throw error
  return data
}
