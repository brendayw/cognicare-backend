import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session'; //para iniciar sesion
import pool from '../config/db.js';

//rutas
import userRoutes from '../routes/userRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import profesionalRoutes from '../routes/profesionalRoutes.js';
import patientRoutes from '../routes/patientRoutes.js';
// import assessmentRoutes from '../routes/assessmentRoutes.js';
// import sessionRoutes from '../routes/sessionRoutes.js';
// import reportRoutes from '../routes/reportRoutes.js';

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.testPostgresConnection();
    this.middleware();
    this.rutas(); // rutas
  }

  async testPostgresConnection() {
    let client;
    try {
      client = await pool.connect();
      const result = await client.query('SELECT NOW() as now');
      console.log('Conexión exitosa a Supabase PostgreSQL');
      console.log('Timestamp del servidor:', result.rows[0].now);
      return true;
    } catch (err) {
      console.error('Error al conectar con Supabase PostgreSQL:', err.stack);
      return false;
    } finally {
      if (client) client.release();
    }
  }

  middleware() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app.use(cors(
      {
        origin: [                
          'https://cognicare-frontend.vercel.app'       // en producción
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, 
      }
    ));

    this.app.use(express.json());
    
    this.app.use(express.urlencoded({ extended: true }));
  
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));
    this.app.use(express.static('public'));
    this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
  }

  rutas() {
    this.app.get('/', (req, res) => {
      res.status(200).json({ 
        message: 'CogniCare Backend is running!',
        environment: process.env.NODE_ENV || 'development'
      });
    });
    this.app.use('/api', userRoutes);
    this.app.use('/api', authRoutes);
    this.app.use('/api', profesionalRoutes);
    this.app.use('/api', patientRoutes);
    // this.app.use('/api', assessmentRoutes);
    // this.app.use('/api', sessionRoutes);
    // this.app.use('/api', reportRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API está escuchando en el puerto ${this.port}`);
    });
  }
}

export default Server;