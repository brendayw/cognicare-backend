import {
  getUserIdByEmailQuery,
  createProfesionalQuery,
  getProfesionalProfileQuery,
  updateProfesionalProfileQuery,
  softDeleteProfesionalQuery
} from '../database/profesionalQueries.js'

export async function registerProfesional (req, res) {
  const {
    nombreCompleto, especialidad, matricula, telefono,
    email, fechaNacimiento, diasAtencion, horariosAtencion, genero
  } = req.body;
  const idUsuarioAutenticado = req.user.sub;

  if (!nombreCompleto || !especialidad || !matricula || !telefono ||
        !email || !fechaNacimiento || !diasAtencion || !horariosAtencion || !genero) {
    return res.status(400).json({
      success: false,
      message: 'Faltan completar campos obligatorios'
    });
  }

  const existingUser = await getUserIdByEmailQuery(email);

  if (!existingUser || existingUser.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  if (existingUser[0].id !== id_usuario_autenticado) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permiso para registrar un profesional con este email'
    });
  }

  try {
    await createProfesionalQuery({
      nombreCompleto,
      especialidad,
      matricula,
      telefono,
      email,
      fechaNacimiento,
      diasAtencion,
      horariosAtencion,
      genero,
      idUsuario: idUsuarioAutenticado
    });

    res.status(200).json({
      success: true,
      message: 'Profesional creado con éxito'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear al profesional'
    });

  }
}

export async function getProfesional (req, res) {
  const userId = req.user.sub;

  try {
    const result = await getProfesionalProfileQuery(userId);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Perfil del profesional no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profesional obtenido con éxito',
      data: result[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil del profesional'
    });

  }
}

export async function getProfesionalByUserId (req, res) {
  const userId = req.params.idUsuario;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'Falta idUsuario'
    });
  }

  try {
    const data = await getProfesionalProfileQuery(userId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Error al obtener profesional asociado a ese usuario'
      });
    }

    if (data.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aún no hay profesionales registrados asociados al usuario',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profesional obtenido con éxito',
      data: data[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener profesional por idUsuario'
    });
  }
}

export async function updateProfesional (req, res) {
  const idProfessional = req.params.id;
  const {
    email, nombreCompleto, fechaNacimiento, especialidad, edad,
    matricula, telefono, genero, diasAtencion, horariosAtencion
  } = req.body;

  if (!email && !nombreCompleto && !fechaNacimiento && !especialidad &&
        !edad && !matricula && !telefono && !genero && !diasAtencion && !horariosAtencion) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar al menos un campo para actualizar'
    });
  }

  try {
    const update = await updateProfesionalProfileQuery(idProfessional,
      email, nombreCompleto, fechaNacimiento, especialidad, edad,
      matricula, telefono, genero, diasAtencion, horariosAtencion);

    if (!update || update.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Perfil del profesional no actualizado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profesional actualizado con éxito'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el perfil del profesional',
      error: error.message
    });
  }
}

export async function softDeleteProfesional (req, res) {
  const idProfessional = req.params.id;

  if (!idProfessional) {
    return res.status(400).json({
      success: false,
      message: 'ID del profesional no válido'
    });
  }

  try {
    const result = await softDeleteProfesionalQuery(idProfessional);
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un profesional para eliminar',
        data: result
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profesional eliminado con éxito'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el profesional'
    });
  }
}
