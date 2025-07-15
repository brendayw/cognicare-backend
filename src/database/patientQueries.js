import supabase from '../config/db.js'

// query para crear un paciente
export async function createPatientQuery (patient) {
  const {
    nombreCompleto, fechaNacimiento, edad, genero, direccion, telefono, email,
    fechaInicio, fechaFin, motivoInicial, motivoAlta, sesionesRealizadas,
    sesionesTotales, estado, observaciones, idProfesional
  } = patient

  const { data, error } = await supabase
    .from('paciente')
    .insert([
      {
        idProfesional, nombreCompleto, fechaNacimiento, edad, genero, direccion, telefono,
        email, fechaInicio, fechaFin, motivoInicial, motivoAlta,
        sesionesRealizadas, sesionesTotales, estado, observaciones
      }
    ])

  if (error) throw error
  return data
}

// query para obtener datos del paciente por su id
export async function getPatientProfileQuery (id, idProfesional) {
  const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .is('deletedAt', null)
    .eq('id', id)
    .eq('idProfesional', idProfesional)
    .single()

  if (error) throw error
  return data
}

// obtener todos los pacientes por profesional
export async function getAllPatientsQuery (idProfesional) {
  const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .is('deletedAt', null)
    .eq('idProfesional', idProfesional)

  if (error) throw error
  return data
}

// Query para obtener los pacientes segun su estado: diagnostico / tratamiento / alta
export async function getFilteredPatientsByStateQuery (idProfesional, estado) {
  const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('idProfesional', idProfesional)
    .is('deletedAt', null)
    .eq('estado', estado)
    .order('id', { ascending: false })

  if (error) throw error
  return data
}

// query para el searchbar
export async function getPatientsByNameQuery (searchText, professionalId) {
  const { data, error } = await supabase
    .from('paciente')
    .select('id, nombreCompleto')
    .is('deletedAt', null)
    .eq('idPofesional', professionalId)
    .ilike('nombreCompleto', `%${searchText}%`)

  if (error) throw error
  return data
}

// query para obtener ultimos pacientes creados
export async function getLatestCreatedPatientsQuery (idProfesional) {
  const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('idProfesional', idProfesional)
    .order('id', { ascending: false })
    .limit(3)

  if (error) throw error
  return data
}

// query para obtener los ultimos pacientes editados por el profesional
export async function getRecentlyUpdatedPatientsQuery (idProfesional) {
  const { data, error } = await supabase
    .from('paciente')
    .select('*')
    .eq('idProfesional', idProfesional)
    .not('fechaActualizacion', 'is', null)
    .order('fechaActualizacion', { ascending: false })
    .limit(3)

  if (error) throw error
  return data
}

// query para actualizar datos del paciente
export async function updatePatientQuery (idPatient, idProfesional, params) {
  params.fechaActualizacion = new Date().toISOString()

  const { data, error } = await supabase
    .from('paciente')
    .update(params)
    .eq('id', idPatient)
    .eq('idProfesional', idProfesional)
    .select()

  if (error) throw error
  return data
}

// query para eliminar al paciente
export async function softDeletePatientQuery (idPaciente, idProfesional) {
  const { data, error } = await supabase
    .from('paciente')
    .update({ deletedAt: new Date().toISOString() })
    .eq('id', idPaciente)
    .eq('idProfesional', idProfesional)
    .select('*', { count: 'exact' })

  if (error) {
    console.error("el error es:", error.message)
    throw error
  }
  return data
}
