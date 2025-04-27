import pool from '../config/db.js';

//query para crear sesion
export function logSessionQuery(fecha, hora, duracion, estado, tipo_sesion, observaciones, id_profesional, id_paciente) {
    const query = `
        INSERT INTO sesion (fecha, hora, duracion, estado, tipo_sesion, 
            observaciones, id_profesional, id_paciente)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;
    return runQuery(query, [fecha, hora, duracion, estado, tipo_sesion, observaciones, id_profesional, id_paciente]);
}

//query para obtener la sesion por su id
export function getSessionById(idSession) {
    const query = `
    SELECT * FROM sesion
    WHERE id = $1
    `;
    return runQuery(query, [idSession]);
}

//query para obtener todas las sesiones del paciente
export function getSessionsByPatientIdQuery(idPatient) {
    const query = `
        SELECT * FROM sesion
        WHERE id_paciente = $1
        ORDER BY fecha DESC, hora DESC
    `;
    return runQuery(query, [idPatient]);
}

//query para obtener la ultima sesion registrada para un paciente
export function getLastSessionForPatientQuery(idPatient) {
    const query = `
        SELECT * FROM sesion
        WHERE id_paciente = $1
        ORDER BY fecha DESC, hora DESC
        LIMIT 1
    `;
    return runQuery(query, [idPatient]);
}

//query para editar la sesion
export function updateSessionQuery(observaciones, idProfesional, idSession) {
    const query = `
        UPDATE sesion
        SET observaciones = $1
        WHERE id = $2 AND id_profesional =$3
    `;
    return runQuery(query, [observaciones, idProfesional, idSession]);
}

//query para eliminar la sesion
export function deleteSessionQuery(idSession) {
    const query = `
        DELETE FROM sesion
        WHERE id = $1
        RETURNING *
    `;
    return runQuery(query, [idSession]);
}

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