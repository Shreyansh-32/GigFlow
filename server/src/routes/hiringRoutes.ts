import express from 'express';
import { hireFreelancer } from '../controllers/hiringController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.patch('/hire', protect, hireFreelancer);

export default router;