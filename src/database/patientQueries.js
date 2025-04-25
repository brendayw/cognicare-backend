import pool from '../config/db.js';

//query para crear un paciente
export function createPatientQuery(patient) {
    console.log("Datos del paciente recibidos:", patient); 

    const { nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono, correo_electronico,
        fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
        sesiones_totales, estado, observaciones, id_profesional } = patient;

    const query = `
        INSERT INTO paciente (nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono, 
        correo_electronico, fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
        sesiones_totales, estado, observaciones, id_profesional) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;

    const params = [
        nombre_completo, fecha_nacimiento, edad, genero, direccion, telefono, correo_electronico,
        fecha_inicio, fecha_fin, motivo_inicial, motivo_alta, sesiones_realizadas,
        sesiones_totales, estado, observaciones, id_profesional
    ];

    return runQuery(query, params);
}

//query para obtener datos del paciente por su id
export function getPatientProfileQuery(id, idProfesional) {
    const query = `
        SELECT * FROM paciente
        WHERE id = $1 AND id_profesional = $2
    `;
    return runQuery(query, [id, idProfesional]);
}

//obtener todos los pacientes por profesional
export function getAllPatientsQuery(idProfesional) {
    const query = `
        SELECT * FROM paciente
        WHERE id_profesional = $1
        `;
    return runQuery(query, [idProfesional]);
}

//query para actualizar datos del paciente
export function updatePatientQuery(id, params) {
    const {
        nombre_completo,
        fecha_nacimiento,
        edad,
        genero,
        direccion,
        telefono,
        email,
        fecha_inicio,
        motivo_inicial,
        fecha_alta,
        motivo_alta,
        sesiones_realizadas,
        sesiones_totales,
        estado,
        observaciones
    } = params;

    const actualizarCampos = [];
    const valores = [];

    if (nombre_completo) {
        actualizarCampos.push('nombre_completo = $' + (valores.length + 1));
        valores.push(nombre_completo);
    }
    if (fecha_nacimiento) {
        actualizarCampos.push('fecha_nacimiento = $' + (valores.length + 1));
        valores.push(fecha_nacimiento);
    }
    if (edad) {
        actualizarCampos.push('edad = $' + (valores.length + 1));
        valores.push(edad);
    }
    if (genero) {
        actualizarCampos.push('genero = $' + (valores.length + 1));
        valores.push(genero);
    }
    if (direccion) {
        actualizarCampos.push('direccion = $' + (valores.length + 1));
        valores.push(direccion);
    }
    if (telefono) {
        actualizarCampos.push('telefono = $' + (valores.length + 1));
        valores.push(telefono);
    }
    if (email) {
        actualizarCampos.push('email = $' + (valores.length + 1));
        valores.push(email);
    }
    if (fecha_inicio) {
        actualizarCampos.push('fecha_inicio = $' + (valores.length + 1));
        valores.push(fecha_inicio);
    }
    if (motivo_inicial) {
        actualizarCampos.push('motivo_inicial = $' + (valores.length + 1));
        valores.push(motivo_inicial);
    }
    if (fecha_alta) {
        actualizarCampos.push('fecha_alta = $' + (valores.length + 1));
        valores.push(fecha_alta);
    }
    if (motivo_alta) {
        actualizarCampos.push('motivo_alta = $' + (valores.length + 1));
        valores.push(motivo_alta);
    }
    if (sesiones_realizadas) {
        actualizarCampos.push('sesiones_realizadas = $' + (valores.length + 1));
        valores.push(sesiones_realizadas);
    }
    if (sesiones_totales) {
        actualizarCampos.push('sesiones_totales = $' + (valores.length + 1));
        valores.push(sesiones_totales);
    }
    if (estado) {
        actualizarCampos.push('estado = $' + (valores.length + 1));
        valores.push(estado);
    }
    if (observaciones) {
        actualizarCampos.push('observaciones = $' + (valores.length + 1));
        valores.push(observaciones);
    }
    actualizarCampos.push('fecha_actualizacion = NOW()');

    if (actualizarCampos.length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
    }

    valores.push(id);

    const query = `
        UPDATE paciente
        SET ${actualizarCampos.join(', ')}
        WHERE id = $${valores.length};
    `;
    console.log('QUERY:', query);
    console.log('VALORES:', valores);
    return runQuery(query, valores);
}

// Query para obtener los pacientes segun su estado: diagnostico / tratamiento / alta
export function getFilteredPatientsByStateQuery(idProfesional, estado) {
    const query = `
        SELECT * FROM paciente
        WHERE id_profesional = $1 AND estado = $2
        ORDER BY id DESC
    `;
    return runQuery(query, [idProfesional, estado]);
}

//query para el searchbar
export function getPatientsByNameQuery(searchText) {
    const query = `
        SELECT id, nombre_completo
        FROM paciente
        WHERE LOWER(nombre_completo) LIKE $1
    `;
    const searchTerm = `%${searchText.toLowerCase()}%`;
    return runQuery(query, [searchTerm]);
}

//query para obtener ultimos pacientes creados
export function getLatestCreatedPatientsQuery(idProfesional) {
    const query = `
        SELECT * FROM paciente
        WHERE id_profesional = $1
        ORDER BY id DESC
        LIMIT 3
    `;
    return runQuery(query, [idProfesional]);
}

//query para obtener los ultimos pacientes editados por el profesional
export function getRecentlyUpdatedPatientsQuery(idProfesional) {
    const query = `
        SELECT * FROM paciente
        WHERE id_profesional = $1 AND fecha_actualizacion IS NOT NULL
        ORDER BY fecha_actualizacion DESC
        LIMIT 3
    `;
    return runQuery(query, [idProfesional]);
}

//query para eliminar al paciente

function runQuery(query, params) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, results) => {
            if (error) {
                console.error('Error en la consulta:', error.message);
                reject(error);
            } else {
                resolve(results.rows);
            }
        });
    });
}