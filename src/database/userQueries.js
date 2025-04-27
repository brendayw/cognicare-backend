import pool from '../config/db.js';

//query para verificar si existe un usuario registrado
//con ese mail y para obtener un usuario por su email
export function verifyRegisteredEmailQuery(email) {
    const query = `
        SELECT * FROM usuario
        WHERE email = $1
    `;
    return runQuery(query, [email]);
}

//query para crear el usuario
export function createUserQuery(username, email, password) {   
    const params = [username, email, password]
    const query = `
        INSERT INTO usuario (usuario, email, password)
        VALUES ($1, $2, $3)
    `;
    return runQuery(query, params);
}

//actualiza la contraseña del usuario
export function updatePasswordQuery(email, newPassword) {
    const query = `
        UPDATE usuario
        SET password = $1
        WHERE email = $2;
    `;
    return runQuery(query, [email, newPassword]);
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