import { hashPassword } from '../helpers/hashPassword.js';
import { 
    verifyRegisteredEmailQuery,
    createUserQuery
} from '../database/userQueries.js';
import AuthToken from '../utils/authToken.js';

export async function registerUser(req, res) {
    const { usuario, email, password } = req.body;

    if (!usuario || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Falta completar campos obligatorios'
        });
    }

    try {
        const existingEmail = await verifyRegisteredEmailQuery(email);
        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un usuario registrado con ese email'
            });
        }

        const hashedPassword = await hashPassword(password);
        await createUserQuery(usuario, email, hashedPassword);

        res.status(200).json({
            success: true,
            message: 'Usuario creado con éxito'
        });

    } catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el usuario'
        });
    }
};
