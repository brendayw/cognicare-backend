import 'dotenv/config';
import Server from './src/models/server.js'; 

console.log('PORT:', process.env.PORT);
console.log('SESSION_SECRET:', process.env.SESSION_SECRET); 

const servidor = new Server();

servidor.listen();