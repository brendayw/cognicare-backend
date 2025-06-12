import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthToken {
    static generateToken(payload) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // El token vence en 1 hora
      return token;
    }
  
    static verifyToken(token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
      } catch (error) {
        throw new Error('Token inválido o expirado');
      }
    }
}
  
export default AuthToken;