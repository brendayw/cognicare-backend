import { hashPassword } from '../helpers/hashPassword.js';
import { comparePassword } from '../helpers/hashPassword.js';
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
    try {
        const { oldPassword, newPassword, confirmedNewPassword } = req.body;
        const userEmail = req.user.email;
        
        console.log('Iniciando actualización de contraseña para:', userEmail);
        
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
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }
        
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe ser diferente a la actual'
            });
        }

        const userResult = await verifyRegisteredEmailQuery(userEmail);
        
        console.log('=== DEBUG INFO ===');
        console.log('userEmail buscado:', userEmail);
        console.log('userResult:', userResult);
        console.log('userResult es array:', Array.isArray(userResult));
        console.log('userResult.length:', userResult?.length);
        console.log('==================');
        
        if (!userResult || userResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        const user = userResult[0];
        console.log('Usuario extraído:', user);
        console.log('user.password existe:', !!user?.password);
        
        if (!user.password) {
            console.log('ERROR: user.password es falsy:', user.password);
            return res.status(400).json({
                success: false,
                message: 'El usuario no tiene contraseña configurada'
            });
        }
        
        console.log('Verificando contraseña actual...');
        const isPasswordValid = await comparePassword(oldPassword, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }
        
        console.log('Hasheando nueva contraseña...');
        const newHashedPassword = await hashPassword(newPassword);
        
        console.log('Actualizando contraseña en la base de datos...');
        await updatePasswordQuery(userEmail, newHashedPassword);
        
        console.log('Contraseña actualizada exitosamente para:', userEmail);
        
        return res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
        
    } catch (error) {
        console.error('Error completo al actualizar contraseña:', error);
        
        // Diferentes tipos de errores
        if (error.message.includes('Data and hash arguments required')) {
            return res.status(400).json({
                success: false,
                message: 'Error en los datos de contraseña'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor al actualizar contraseña'
        });
    }
}

//funcion para verificar si existe el email ingresado ANTES
// cambiar la contraseña olvidada
export async function verifyEmail(req, res) {
    const { email } = req.body;

    try {
        const existingEmail = await verifyRegisteredEmailQuery(email);
        if (existingEmail.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No existe un usuario registrado con ese email'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email verificado correctamente'
        });
    } catch (error) {
        console.error('Error al verificar email', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar email'
        });
    }
}

export async function resetPassword(req, res) {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ 
            success: false, 
            message: 'Las contraseñas no coinciden' 
        });
    }

    try {
        const existingEmail = await verifyRegisteredEmailQuery(email);
        if (existingEmail.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No existe un usuario registrado con ese email'
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        await updatePasswordQuery(email, hashedPassword);

        return res.status(200).json({ 
            success: true, 
            message: 'Contraseña actualizada correctamente' 
        });
    } catch (error) {
        console.error('Error al cambiar contraseña olvidada', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña olvidada'
        });
    }
}