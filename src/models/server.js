import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session'; //para iniciar sesion
import pool from '../config/db.js';

//rutas
// import cuentaRoutes from '../routes/cuentaRoutes.js';
// import profesionalRoutes from '../routes/profesionalRoutes.js';
// import pacienteRoutes from '../routes/pacienteRoutes.js';
// import sesionRoutes from '../routes/sesionRoutes.js';
// import evaluacionRoutes from '../routes/evaluacionRoutes.js';
// import reporteRoutes from '../routes/reporteRoutes.js';

class Server {
  constructor () {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.testPostgresConnection();
    this.middleware();
    this.rutas(); // rutas
  }

  async testPostgresConnection() {
    try {
      // Intentamos conectarnos a PostgreSQL
      await pool.connect();
      console.log('Conexión exitosa a PostgreSQL');
    } catch (err) {
      console.error('Error al conectar con PostgreSQL:', err.stack);
    }
  }

  middleware () {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));

    this.app.use(express.static('public'));
    this.app.use('/assets', express.static('assets'));
    this.app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

    //para la sesion
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'default_secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { 
        secure: process.env.NODE_ENV === 'production', //true si usa https
        httpOnly: true,  // Asegura que la cookie solo sea accesible desde el servidor
        sameSite: 'lax'  // Esto ayuda a que las cookies se envíen correctamente en solicitudes cross-origin
    }
    }));

    this.app.use(express.json());
  }

  rutas () {
    //rutas de la api
    // this.app.use('/api', cuentaRoutes);
    // this.app.use('/api', profesionalRoutes);
    // this.app.use('/api', pacienteRoutes);
    // this.app.use('/api', sesionRoutes);
    // this.app.use('/api', evaluacionRoutes);
    // this.app.use('/api', reporteRoutes);
    
    //aca van las rutas para ver front (views)
    // this.app.get('/login', (req, res) => {
    //   res.render('login');
    // });
    
    // this.app.get('/dashboard', (req, res) => {
    //   res.render('dashboard');
    // });

    // this.app.get('/profesional', (req, res) => {
    //   res.render('profesional');
    // });

    // this.app.get('/editarprofesional', (req, res) => {
    //   res.render('editarprofesional');
    // });

    // this.app.get('/pacientes', (req, res) => {
    //   res.render('pacientes');
    // });

    // this.app.get('/pacientes/perfil_paciente/:id', (req, res) => {
    //   const idPaciente = req.params.id; 
    //   res.render('perfil_paciente', { idPaciente });
    // });
   
    // this.app.get('/settings', (req, res) => {
    //   res.render('settings');
    // })

    // this.app.get('/endiagnostico', (req, res) => {
    //   res.render('endiagnostico');
    // });

    // this.app.get('/entratamiento', (req, res) => {
    //   res.render('entratamiento');
    // });

    // this.app.get('/dealta', (req, res) => {
    //   res.render('dealta');
    // });

    // this.app.get('/add_paciente', (req, res) => {
    //   res.render('add_paciente');
    // });

    // this.app.get('/add_seguimiento', (req, res) => {
    //   res.render('add_seguimiento');
    // });

    // this.app.get('/add_evaluacion', (req, res) => {
    //   res.render('add_evaluacion');
    // });

    // this.app.get('/add_reporte', (req, res) => {
    //   res.render('add_reporte');
    // });

    // this.app.get('/pacientes/perfil_paciente/editarpaciente/:id', (req, res) => {
    //   const idPaciente = req.params.id;
    //   res.render('editarpaciente', { idPaciente });
    // });

    // this.app.get('/pacientes/perfil_paciente/:idPaciente/editar_evaluacion', (req, res) => {
    //   const { idPaciente } = req.params;
    //   res.render('editar_evaluacion', { idPaciente });
    // });

    // this.app.get('/pacientes/perfil_paciente/:idPaciente/editar_reporte', (req, res) => {
    //   const { idPaciente } = req.params;
    //   res.render('editar_reporte', { idPaciente });
    // });

  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`La API está escuchando en el puerto ${this.port}`)
    })
  }
}

export default Server;