import express from 'express';
import checkJwt from '../middleware/authMiddleware.js';
import { 
    registerUser, 
    updatePassword 
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.put('/update-password', checkJwt, updatePassword);

export default router;