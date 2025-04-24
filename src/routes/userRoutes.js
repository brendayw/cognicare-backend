import express from 'express';
import { registerUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/createUser', registerUser);

export default router;