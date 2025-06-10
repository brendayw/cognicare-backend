import { hashPassword } from '../helpers/hashPassword.js';
import { 
    verifyRegisteredEmailQuery,
    createUserQuery,
    updatePasswordQuery
} from '../database/userQueries.js';


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

export async function updatePassword(req, res) {
    const { oldPassword, newPassword, confirmedNewPassword} = req.body;
    const userEmail = req.user.email;


    try {
        if (!oldPassword || !newPassword || !confirmedNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        if (newPassword !== confirmedNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'Las nuevas contraseñas no coinciden'
            });
        }

        const user = await verifyRegisteredEmailQuery(userEmail);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const isPasswordValid = await comparePassword(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        await updatePasswordQuery(userEmail, hashedPassword);

        return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al actualizar contraseña'
        });
    }
}