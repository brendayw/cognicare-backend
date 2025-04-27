import pool from '../config/db.js';

//query para crear el reporte
export function logReportQuery(tipo_reporte, fecha_reporte, descripcion, archivo, idAssessment, idPatient) {
    const query = `
        INSERT INTO reporte (tipo_reporte, fecha_reporte, descripcion, archivo, id_evaluacion, id_paciente)
        VALUES ($1,$2,$3,$4,$5,$6)
    `;
    return runQuery(query, [tipo_reporte, fecha_reporte, descripcion, archivo, idAssessment, idPatient])
}

//query para obtener id del reporte
export function getReportByIdQuery(idReport) {
    const query = `
        SELECT * FROM reporte
        WHERE id = $1
    `;
    return runQuery(query, [idReport]);
}

//query para obtener los reportes del paciente
export function getReportsByPatientIdQuery(idPatient) {
    const query = `
        SELECT * FROM reporte
        WHERE id_paciente = $1
    `;
    return runQuery(query, [idPatient]);
}

//query para actualziar reporte
export function updateReportQuery(archivo, descripcion, idPatient, tipo_reporte, id) {
    const query = `
        UPDATE reporte
        SET archivo = $1, descripcion = $2
        WHERE id_paciente = $3 AND tipo_reporte = $4 AND id = $5
    `;
    return runQuery(query, [archivo, descripcion, idPatient, tipo_reporte, id]);
}

//query para eliminar reporte
export function deleteReportQuery(idReport) {
    const query = `
        DELETE FROM reporte
        WHERE id = $1
        RETURNING *
    `;
    return runQuery(query, [idReport]);
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