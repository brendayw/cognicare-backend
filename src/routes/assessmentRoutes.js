import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    logAssessment,
    getAssessments,
    getAssessmentByPatientId,
    updateAssessment,
    deleteAssessment
} from '../controllers/assessmentController.js';

const router = express.Router();

router.post('/assessments', checkJwt, logAssessment);
router.get('/asessments', checkJwt, getAssessments)
router.get('/patients/assessments/:id', checkJwt, getAssessmentByPatientId);
router.put('/assessments/:id', checkJwt, updateAssessment);
router.delete('/assessments/:id', checkJwt, deleteAssessment);

export default router;