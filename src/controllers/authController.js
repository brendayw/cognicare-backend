import { comparePassword } from '../helpers/hashPassword.js';
import { verifyRegisteredEmailQuery } from '../database/userQueries.js';
import AuthToken from '../utils/authToken.js';

export async function loginUser(req, res) {
    const { email, password } = req.body;
    //console.log('Datos recibidos en el backend:', { email, password });

    try {
        const userResult = await verifyRegisteredEmailQuery(email);
        const user = userResult[0];
        if (!userResult || !userResult[0]) {
            return res.status(400).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
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

        const token = AuthToken.generateToken(payload);
    
        //req.session.userId = user.id;
        //req.session.correo_electronico = user.email;

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: {
                username: user.usuario,
                email: user.email
            },
            token: token
        });
    
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión'
        });
    }    
}