import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../config/zod';


const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;