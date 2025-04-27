import express from 'express';
import { 
    logSession,
    getSessionByPatient,
    getLastSessionForPatient,
    updateSession,
    deleteSession
 } from '../controllers/sessionController.js';

const router = express.Router();

router.get('/session/:patientId', getSessionByPatient);
router.get('/session/:patientId/last', getLastSessionForPatient);
router.post('/session/:patientId', logSession);
router.put('/session/:sessionId', updateSession);
router.delete('/session/:sessionId', deleteSession);

export default router;