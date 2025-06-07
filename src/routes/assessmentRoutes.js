import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    logAssessment,
    getAssessments,
    getAssessmentByPatientId,
    updateAssessment,
    softDeleteAssessment
} from '../controllers/assessmentController.js';

const router = express.Router();

router.get('/assessments', checkJwt, getAssessments)
router.get('/patients/:id/assessments', checkJwt, getAssessmentByPatientId);
router.put('/assessments/:id', checkJwt, updateAssessment);
router.post('/assessments', checkJwt, logAssessment);
router.put('/assessments/:id/soft-delete', checkJwt, softDeleteAssessment);

export default router;