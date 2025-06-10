import { comparePassword } from '../helpers/hashPassword.js';
import { verifyRegisteredEmailQuery } from '../database/userQueries.js';
import AuthToken from '../utils/authToken.js';

export async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log('Datos recibidos en el backend:', { email, password });

    try {
        const userResult = await verifyRegisteredEmailQuery(email);
        
        if (!userResult || userResult.length === 0) {
            console.log('Usuario no encontrado:', email);
            return res.status(400).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        const user = userResult[0];
        console.log('Usuario encontrado:', user.usuario);

        const isPasswordCorrect = await comparePassword(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Contraseña incorrecta para usuario:', email);
            return res.status(400).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }
        
        console.log('Autenticación exitosa para:', email);
        const payload = {
            sub: user.id,
            name: user.usuario,
            email: user.email
        };

        try {
            const token = AuthToken.generateToken(payload);
            console.log('Token JWT generado correctamente');
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
            console.error('Error al generar token JWT:', tokenError);
            return res.status(500).json({
                success: false,
                message: 'Error al generar token de autenticación'
            });
        }
        
    } catch (error) {
        console.error('Error en el proceso de inicio sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }    
}