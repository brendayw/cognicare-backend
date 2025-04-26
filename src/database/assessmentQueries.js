import pool from '../config/db.js';

//query para crear una evaluacion
export function logAssessmentQuery(assessment) {
    const { fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, observaciones, id_profesional, id_paciente } = assessment;
    
    const query = `
        INSERT INTO evaluacion (fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, observaciones, id_profesional, id_paciente)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
    `;
    const params = [fecha_evaluacion, nombre_evaluacion, tipo_evaluacion, resultado, observaciones, id_profesional, id_paciente];
    return runQuery(query, params);
}

//query para obtener las evaluaciones asociadas a un paciente
export function getAssessmentByPatientQuery(idProfesional, idPatient) {
    const query = `
        SELECT * FROM evaluacion
        WHERE id_profesional = $1 AND id_paciente = $2
    `;
    return runQuery(query, [idProfesional, idPatient]);
}

//query para actualizar una evaluacion
export function updateAssessmentQuery(observaciones, idPaciente, nombreEvaluacion, tipoEvaluacion) {
    const query = `
        UPDATE evaluacion
        SET observaciones = $1
        WHERE id_paciente = $2 AND nombre_evaluacion = $3 AND tipo_evaluacion = $4
    `;
    return runQuery(query, [observaciones, idPaciente, nombreEvaluacion, tipoEvaluacion]);
}

//query para eliminar una evaluacion
export function deleteAssessmentQuery(idEvaluacion) {
    const query = `
        DELETE FROM evaluacion
        WHERE id = $1
        RETURNING *
    `;
    return runQuery(query, [idEvaluacion]);
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