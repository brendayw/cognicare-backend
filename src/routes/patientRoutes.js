import express from'express';
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

router.get('/patients', getAllPatients);
router.post('/patients', registerPatient );

router.get('/patients/diagnosis', getPatientsUnderDiagnosis); 
router.get('/patients/treatment', getPatientsUnderTreatment); 
router.get('/patients/discharged', getPatientsDischarged);
router.get('/patients/updated', getRecentlyUpdatedPatients);
router.get('/patients/recently', getLatestCreatedPatients);

router.get('/patients/:id', getPatientProfile);
router.put('/patients/:id', updatePatient );

export default router;