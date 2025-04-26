import express from 'express';
import { 
    logAssessment,
    getAssessmentByPatientId,
    updateAssessment,
    deleteAssessment
} from '../controllers/assessmentController.js';

const router = express.Router();

router.post('/assessments', logAssessment);
router.get('/patients/assessments/:id', getAssessmentByPatientId);
router.put('/assessments/:id', updateAssessment);
router.delete('/assessments/:id', deleteAssessment);

export default router;