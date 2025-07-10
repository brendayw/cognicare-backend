import supabase from '../config/db.js'

// query para crear una evaluacion
export async function logAssessmentQuery (assessment) {
  const {
    fechaEvaluacion, nombreEvaluacion, tipoEvaluacion, resultado,
    observaciones, idProfesional, idPaciente
  } = assessment

  const { data, error } = await supabase
    .from('evaluacion')
    .insert([
      {
        fechaEvaluacion,
        nombreEvaluacion,
        tipoEvaluacion,
        resultado,
        observaciones,
        idProfesional,
        idPaciente
      }
    ])

  if (error) throw error
  return data
}

// query para obtener las evaluaciones
export async function getAssessmentsQuery (idProfesional) {
  const { data, error } = await supabase
    .from('evaluacion')
    .select(`
            id,
            nombreEvaluacion,
            fechaEvaluacion,
            idPaciente,
            resultado,
            observaciones,
            tipoEvaluacion,
            paciente!inner(id, nombreCompleto)
        `)
    .is('deletedAt', null)
    .eq('idProfesional', idProfesional)
    .order('fechaEvaluacion', { ascending: false })

  if (error) throw error
  return data
}

// query para obtener las evaluaciones asociadas a un paciente
export async function getAssessmentByPatientQuery (idProfesional, idPatient) {
  const { data, error } = await supabase
    .from('evaluacion')
    .select('*')
    .is('deletedAt', null)
    .eq('idProfesional', idProfesional)
    .eq('idPaciente', idPatient)

  if (error) throw error
  return data
}

// query para actualizar una evaluacion
export async function updateAssessmentQuery (idProfesional, idEvaluacion, actualizoResultado, nuevasObservaciones) {
  const { data, error } = await supabase
    .from('evaluacion')
    .update({
      resultado: actualizoResultado,
      observaciones: nuevasObservaciones,
      fechaActualizacion: new Date()
    })
    .eq('id', idEvaluacion)
    .eq('idProfesional', idProfesional)
    .select()
    .single()

  if (error) throw (error)
  return data
}

// query para eliminar una evaluacion
export async function softDeleteAssessmentQuery (idEvaluacion) {
  const { data, error } = await supabase
    .from('evaluacion')
    .update({ deletedAt: new Date().toISOString() })
    .eq('id', idEvaluacion)
    .select('*', { count: 'exact' })

  if (error) throw error
  return data
}
