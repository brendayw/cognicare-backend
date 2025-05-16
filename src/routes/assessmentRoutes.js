import express, { Router } from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    logAssessment,
    getAssessmentByPatientId,
    updateAssessment,
    deleteAssessment
} from '../controllers/assessmentController.js';

const router = express.Router();

router.post('/assessments', checkJwt, logAssessment);
router.get('/patients/assessments/:id', checkJwt, getAssessmentByPatientId);
router.put('/assessments/:id', checkJwt, updateAssessment);
router.delete('/assessments/:id', checkJwt, deleteAssessment);

export default router;