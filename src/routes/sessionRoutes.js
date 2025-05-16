import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    logSession,
    getSessionByPatient,
    getLastSessionForPatient,
    updateSession,
    deleteSession
 } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/session/:patientId', checkJwt, getSessionByPatient);
router.get('/session/:patientId/last', checkJwt, getLastSessionForPatient);
router.post('/session/:patientId', checkJwt, logSession);
router.put('/session/:sessionId', checkJwt, updateSession);
router.delete('/session/:sessionId', checkJwt, deleteSession);

export default router;