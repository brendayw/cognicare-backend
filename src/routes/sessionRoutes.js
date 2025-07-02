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

router.post('/sessions', checkJwt, logSession);
router.get('/patients/:id/sessions', checkJwt, getSessionsByPatient);
router.get('/sessions/:patientId/last', checkJwt, getLastSessionForPatient);
router.put('/sessions/:sessionId', checkJwt, updateSession);
router.put('/sessions/:sessionId/soft-delete', checkJwt, softDeleteSession);

export default router;