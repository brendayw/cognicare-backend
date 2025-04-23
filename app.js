import dotenv from 'dotenv';
import Server from './src/models/server.js'; 

dotenv.config();

console.log('PORT:', process.env.PORT);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET); 

const servidor = new Server();

servidor.listen();