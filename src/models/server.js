import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session'; //para iniciar sesion
import pool from '../config/db.js';

//rutas
import userRoutes from '../routes/userRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import profesionalRoutes from '../routes/profesionalRoutes.js';
import patientRoutes from '../routes/patientRoutes.js';
import assessmentRoutes from '../routes/assessmentRoutes.js';
import sessionRoutes from '../routes/sessionRoutes.js';
import reportRoutes from '../routes/reportRoutes.js';

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.testPostgresConnection();
    this.middleware();
    this.rutas(); // rutas
  }

  async testPostgresConnection() {
    try {
      await pool.connect();
      console.log('Conexión exitosa a PostgreSQL');
    } catch (err) {
      console.error('Error al conectar con PostgreSQL:', err.stack);
    }
  }

  middleware() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  
    this.app.use(session({
      secret: 'a9zK4!5lP1m', // poner uno fuerte en producción
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: false, // poner true si usás HTTPS
          maxAge: 1000 * 60 * 60 * 24 // 1 día
      }
  }));

    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.use(express.static('public'));
    this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
    //this.app.use(upload.single('archivo')); 
  }

  rutas() {
    this.app.use('/api', userRoutes);
    this.app.use('/api', authRoutes);
    this.app.use('/api', profesionalRoutes);
    this.app.use('/api', patientRoutes);
    this.app.use('/api', assessmentRoutes);
    this.app.use('/api', sessionRoutes);
    this.app.use('/api', reportRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API está escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;