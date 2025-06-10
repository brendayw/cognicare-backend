import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    logSession,
    getSessionsByPatient,
    getLastSessionForPatient,
    updateSession,
    softDeleteSession
 } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/session', checkJwt, logSession);
router.get('/patients/:id/sessions', checkJwt, getSessionsByPatient);
router.get('/session/:patientId/last', checkJwt, getLastSessionForPatient);
router.put('/session/:sessionId', checkJwt, updateSession);
router.put('/session/:sessionId/soft-delete', checkJwt, softDeleteSession);

export default router;