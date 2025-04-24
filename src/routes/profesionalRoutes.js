import express from'express';
import { verifySession,
    registerProfesional, 
    getProfesional,
    updateProfesional } from '../controllers/profesionalController.js';

const router = express.Router();

router.get('/profesionalProfile', verifySession, getProfesional);
router.post('/createProfesional', verifySession, registerProfesional);
router.put('/updateProfesional', verifySession, updateProfesional);

export default router;