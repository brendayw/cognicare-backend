import { comparePassword } from '../helpers/hashPassword.js';
import { verifyRegisteredEmailQuery } from '../database/userQueries.js';

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const userResult = await verifyRegisteredEmailQuery(email);
        if (!userResult || !userResult[0]) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
    
        const user = userResult[0];
        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }
    
        req.session.userId = user.id;
        req.session.correo_electronico = user.email;
        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
                username: user.usuario,
                email: user.email
            }
        });
    
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }    
}