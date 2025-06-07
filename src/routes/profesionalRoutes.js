import express from'express';
import checkJwt from '../middleware/authMiddleware.js';
import {
    registerProfesional, 
    getProfesional,
    updateProfesional, 
    softDeleteProfesional
} from '../controllers/profesionalController.js';

const router = express.Router();

router.get('/profesional', checkJwt, getProfesional);
router.post('/profesional', checkJwt, registerProfesional);
router.put('/profesional', checkJwt, updateProfesional);
router.put('/profesional/soft-delete', checkJwt, softDeleteProfesional);

export default router;