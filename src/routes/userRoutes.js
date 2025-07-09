import express from 'express'
import checkJwt from '../middleware/authMiddleware.js'
import {
  registerUser,
  resetPassword,
  verifyEmail,
  updatePassword
} from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', registerUser)
router.post('/verify-email', verifyEmail)
router.post('/password/reset', resetPassword)
router.put('/password/update', checkJwt, updatePassword)

export default router
