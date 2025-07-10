import {
  createPatientQuery,
  getPatientProfileQuery,
  getAllPatientsQuery,
  updatePatientQuery,
  getFilteredPatientsByStateQuery,
  getLatestCreatedPatientsQuery,
  getRecentlyUpdatedPatientsQuery,
  getPatientsByNameQuery,
  softDeletePatientQuery
} from '../database/patientQueries.js'

// crea al paciente
export async function registerPatient (req, res) {
  const { 
    nombreCompleto, fechaNacimiento, edad, direccion, telefono, email, fechaInicio, fechaFin, 
    motivoInicial, motivoAlta, sesionesRealizadas, sesionesTotales, observaciones, genero, estado  } = req.body

  const idProfesional = req.user.sub

  if (!nombreCompleto || !fechaNacimiento || !edad || !genero || !direccion || !telefono ||
    !fechaInicio || !motivoInicial || !sesionesRealizadas || !sesionesTotales || !estado) {
    return res.status(400).json({
      success: false,
      message: 'Faltan completar campos obligatorio.'
    })
  }

  try {
    const patientData = { idProfesional, nombreCompleto, fechaNacimiento, edad, direccion, telefono, email,
      fechaInicio, fechaFin, motivoInicial, motivoAlta, sesionesRealizadas, sesionesTotales, genero, estado, observaciones}

    const result = await createPatientQuery(patientData)

    res.status(200).json({
      success: true,
      message: 'Paciente creado con éxito.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear al paciente.'
    })
  }
}

// obtener el perfil de un paciente
export async function getPatientProfile (req, res) {
  const idPatient = parseInt(req.params.id, 10)

  try {
    const patient = await getPatientProfileQuery(idPatient, req.user.sub)

    if (!patient || patient.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener el perfil de paciente.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Perfil obtenido con éxito.',
      data: patient
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del paciente.'
    })
  }
}

// obtener todos los pacientes
export async function getAllPatients (req, res) {
  try {
    const results = await getAllPatientsQuery(req.user.sub)

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener todos los pacientes o aún no hay pacientes registrados para el profesional.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes obtenidos con éxito.',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los pacientes.'
    })
  }
}

// obtener pacientes en diagnostico
export async function getPatientsUnderDiagnosis (req, res) {
  try {
    const patients = await getFilteredPatientsByStateQuery(req.user.sub, 'diagnóstico')

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener pacientes en período diagnóstico o aún no hay pacientes en período diagnóstico registrados para el profesional.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes en diagnóstico obtenidos con éxito.',
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes en periodo diagnóstico.'
    })
  }
}

// obtiene pacientes en tratamiento
export async function getPatientsUnderTreatment (req, res) {
  try {
    const patients = await getFilteredPatientsByStateQuery(req.user.sub, 'tratamiento')

    if (!patients) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener pacientes en período de tratamiento.'
      })
    }

    if (patients.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aún no hay pacientes en período de tratamiento registrados para el profesional.',
        data: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes en tratamiento obtenidos con éxito.',
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes en periodo de tratamiento.'
    })
  }
}

// obtiene pacientes dados de alta
export async function getPatientsDischarged (req, res) {
  try {
    const patients = await getFilteredPatientsByStateQuery(req.user.sub, 'alta')

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener pacientes dados de alta o aún no hay pacientes dados de alta registrados para el profesional.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes de alta obtenidos con éxito.',
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes de alta.'
    })
  }
}

// obtiene pacientes actualizados recientemente
export async function getRecentlyUpdatedPatients (req, res) {
  try {
    const results = await getRecentlyUpdatedPatientsQuery(req.user.sub)

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener pacientes actualizados recientemente o aún no hay pacientes actualidazos recientemente para el profesional.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes actualizados obtenidos con éxito.',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes actualizados.'
    })
  }
}

// obtiene los ultimos pacientes creados
export async function getLatestCreatedPatients (req, res) {
  try {
    const results = await getLatestCreatedPatientsQuery(req.user.sub)

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener pacientes creados recientemente o aún no hay pacientes registrados para el profesional.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Pacientes creados recientemente con éxito.',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener últimos pacientes creados.',
      data: []
    })
  }
}

export async function getPatientsByName (req, res) {
  const searchText = req.params.searchText

  try {
    const patients = await getPatientsByNameQuery(searchText)

    res.status(200).json({
      success: true,
      data: patients
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar pacientes.'
    })
  }
}

// actualizar perfil de un paciente
export async function updatePatient (req, res) {
  const idPatient = parseInt(req.params.id, 10)
  const idProfesional = req.user.sub
  const params = req.body

  try {
    const update = await updatePatientQuery(idPatient, idProfesional, params)

    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Perfil del paciente no actualizado.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Paciente actualizado con éxito.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil del paciente.'
    })
  }
}

// eliminar paciente de la api (soft delete)
export async function softDeletePatient (req, res) {
  const idPaciente = parseInt(req.params.id, 10)
  const idProfesional = req.user.sub
  
  if (!idPaciente) {
    return res.status(400).json({
      success: false,
      message: 'ID de paciente no válido.'
    })
  }
  
  try {
    const result = await softDeletePatientQuery(idPaciente, idProfesional)
    
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paciente ha eliminar no encontrado.'
      })
    }
    
    res.status(200).json({
      success: true,
      message: 'Paciente eliminado con éxito.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar al paciente.'
    })
  }
}
