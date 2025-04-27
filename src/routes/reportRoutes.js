import express from 'express';
import { upload } from '../middleware/multer.js';
import { 
    logReport,
    getReportByPatient,
    updateReport,
    deleteReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/report/:patientId', getReportByPatient);
router.post('/report/:patientId', upload.single('archivo'), logReport);
router.put('/report/:patientId/:id', upload.single('archivo'), updateReport);
router.delete('/report/:id', deleteReport);

export default router;