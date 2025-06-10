import { comparePassword } from '../helpers/hashPassword.js';
import { verifyRegisteredEmailQuery } from '../database/userQueries.js';
import AuthToken from '../utils/authToken.js';

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const userResult = await verifyRegisteredEmailQuery(email);

        if (!userResult || userResult.length === 0) {
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

        const payload = {
            sub: user.id,
            name: user.usuario,
            email: user.email
        };

        try {
            const token = AuthToken.generateToken(payload);
            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                user: {
                    username: user.usuario,
                    email: user.email
                },
                token: token
            });

        } catch (tokenError) {
            return res.status(500).json({
                success: false,
                message: 'Error al generar token de autenticación'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }    
}