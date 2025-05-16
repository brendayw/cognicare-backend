import express from'express';
import checkJwt from '../middleware/authMiddleware.js';
import { getAllPatients, 
    getPatientProfile, 
    registerPatient, 
    updatePatient,
    getPatientsUnderDiagnosis,
    getPatientsUnderTreatment,
    getPatientsDischarged,
    getRecentlyUpdatedPatients,
    getLatestCreatedPatients
    //getPatientsByName, 
    } from '../controllers/patientController.js';

const router = express.Router();

router.get('/patients', checkJwt, getAllPatients);
router.post('/patients', checkJwt, registerPatient );

router.get('/patients/diagnosis', checkJwt, getPatientsUnderDiagnosis); 
router.get('/patients/treatment', checkJwt, getPatientsUnderTreatment); 
router.get('/patients/discharged', checkJwt, getPatientsDischarged);
router.get('/patients/updated', checkJwt, getRecentlyUpdatedPatients);
router.get('/patients/recently', checkJwt, getLatestCreatedPatients);

router.get('/patients/:id', checkJwt, getPatientProfile);
router.put('/patients/:id', checkJwt, updatePatient );

export default router;