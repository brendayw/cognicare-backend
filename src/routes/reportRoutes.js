import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import upload from '../middleware/fileUpload.js';
import { 
    logReport,
    getReportByPatient,
    updateReport,
    deleteReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/report/:patientId', checkJwt, getReportByPatient);
router.post('/report', checkJwt, upload.single('archivo'), logReport);
router.put('/report/:id', checkJwt, upload.single('archivo'), updateReport);
router.delete('/report/:id', checkJwt, deleteReport);

export default router;