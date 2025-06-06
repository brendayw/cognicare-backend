import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import upload from '../middleware/fileUpload.js';
import { 
    logReport,
    getReportsByPatientId,
    updateReport,
    softDeleteReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/patients/:id/reports', checkJwt, getReportsByPatientId);
router.post('/report', checkJwt, upload.single('archivo'), logReport);
router.put('/reports/:id', checkJwt, upload.single('archivo'), updateReport);
router.put('/report/:id', checkJwt, softDeleteReport);

export default router;