import pool from '../config/db.js';

//query para obtener el id del usuario a traves del email
export async function getUserIdByEmailQuery(email) {
    const query = `
        SELECT id FROM usuario
        WHERE email = $1
    `;
    return runQuery(query, [email]);
}

//query para obtener los datos del profesional usando el id de usuario
export function getProfesionalProfileQuery(id) {
    const query = `
        SELECT nombre_completo, especialidad, matricula, telefono,
        correo_electronico, dias_atencion, horarios_atencion
        FROM profesional
        WHERE id_usuario = $1
    `;
    return runQuery(query, [id]);
}

export function createProfesionalQuery({ nombre_completo, especialidad, matricula, telefono,
    correo_electronico, fecha_nacimiento, dias_atencion, horarios_atencion, id_usuario }) {
    
    const params = [nombre_completo, especialidad, matricula, telefono,
        correo_electronico, fecha_nacimiento, dias_atencion, horarios_atencion, id_usuario]
    
    const query = `
        INSERT INTO profesional (nombre_completo, especialidad, matricula, telefono,
            correo_electronico, fecha_nacimiento, dias_atencion, horarios_atencion, id_usuario)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `;
    return runQuery(query, params);
}

export function updateProfesionalProfileQuery(id, params) {
    const { nombre_completo, especialidad, correo_electronico, telefono, fecha_nacimiento,
        genero, dias_atencion, horarios_atencion } = params;
    const dias_atencion_string = dias_atencion;
    const horarios_atencion_string = horarios_atencion;
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
    if (genero) {
        actualizarCampos.push('genero = $' + (valores.length + 1));
        valores.push(genero);
    }
    if (especialidad) {
        actualizarCampos.push('especialidad = $' + (valores.length + 1));
        valores.push(especialidad);
    }
    if (telefono) {
        actualizarCampos.push('telefono = $' + (valores.length + 1));
        valores.push(telefono);
    }
    if (correo_electronico) {
        actualizarCampos.push('correo_electronico = $' + (valores.length + 1));
        valores.push(correo_electronico);
    }
    if (dias_atencion_string) {
        actualizarCampos.push('dias_atencion = $' + (valores.length + 1));
        valores.push(dias_atencion_string);
    }
    if (horarios_atencion_string) {
        actualizarCampos.push('horarios_atencion = $' + (valores.length + 1));
        valores.push(horarios_atencion_string);
    }

    if (actualizarCampos.length === 0) {
        throw new Error('No se proporcionaron datos para actualizar');
    }
    valores.push(id);

    const query = `
        UPDATE profesional
        SET ${actualizarCampos.join(', ')}
        WHERE id = $${valores.length};
    `;
    return runQuery(query, valores);
}

//query para eliminar el profesional

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