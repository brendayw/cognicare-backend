import { getPatientsByNameQuery } from '../database/patientQueries.js'
import {
  logSessionQuery,
  getSessionsByPatientIdQuery,
  getLastSessionForPatientQuery,
  updateSessionQuery,
  softDeleteSessionQuery
} from '../database/sessionQueries.js'

// insertar sesion
export async function logSession (req, res) {
  const idProfessional = req.user.sub
  const { fecha, hora, duracion, estado, tipoSesion, observaciones, nombreCompleto } = req.body

  if (!fecha || !hora || !duracion || !estado || !tipoSesion || !nombreCompleto) {
    return res.status(400).json({
      success: false,
      message: 'Faltan completar campos obligatorios'
    })
  }

  try {
    const patients = await getPatientsByNameQuery(nombreCompleto)

    if (!patients || patients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Faltan completar campos obligatorios'
      })
    }

    const patient = patients[0]
    const idPatient = patient.id

    const result = await logSessionQuery(fecha, hora, duracion, estado, tipoSesion,
      observaciones, idProfessional, idPatient)

    res.status(200).json({
      success: true,
      message: 'Sesión creada con éxito',
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la sesión'
    })
  }
}

// obtener las sesiones por paciente
export async function getSessionsByPatient (req, res) {
  const idPatient = parseInt(req.params.id, 10)
  const idProfessional = req.user.sub

  try {
    const results = await getSessionsByPatientIdQuery(idPatient, idProfessional)

    if (!results) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener las sesiones registradas del pacientes'
      })
    }

    if (results.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'El paciente aún no tiene sesiones registradas',
        data: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'Sesiones del paciente obtenidas con éxito',
      data: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las sesiones asociadas al paciente',
      error: error.message
    })
  }
}

// obtener la ultima sesion por paciente
export async function getLastSessionForPatient (req, res) {
  const idPatient = parseInt(req.params.patientId, 10)
  const idProfessional = req.user.sub

  try {
    const result = await getLastSessionForPatientQuery(idPatient, idProfessional)

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener la última sesión asociada al paciente'
      })
    }

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'El paciente aún no tiene sesiones registradas',
        data: []
      })
    }

    res.status(200).json({
      success: true,
      message: 'Última sesión del paciente obtenida con éxito',
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la útlima sesión asociada al paciente'
    })
  }
}

// actualizar la sesion
export async function updateSession (req, res) {
  const idSession = parseInt(req.params.sessionId, 10)
  const idProfessional = req.user.sub
  const { fecha, hora, duracion, observaciones, tipoSesion, estado } = req.body

  if (fecha === undefined && hora === undefined && duracion === undefined &&
        tipoSesion === undefined && estado === undefined && observaciones === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos resultado u observaciones para actualizar'
    })
  }

  try {
    const update = await updateSessionQuery(idSession, idProfessional, fecha, hora, duracion,
      observaciones, tipoSesion, estado)
    if (!update) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no ha podido ser actualizada'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Sesión actualizada con éxito',
      data: update[0]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la sesión'
    })
  }
}

// borrar la sesion
export async function softDeleteSession (req, res) {
  const idSession = parseInt(req.params.sessionId, 10)
  const idProfessional = req.user.sub

  if (!idSession) {
    return res.status(400).json({
      success: false,
      message: 'ID de sesión no válido'
    })
  }

  try {
    const result = await softDeleteSessionQuery(idSession, idProfessional)

    if (!result || result.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron sesiones registradas para eliminar',
        data: result
      })
    }

    res.status(200).json({
      success: true,
      message: 'Sesión eliminada con éxito'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la sesión'
    })
  }
}
