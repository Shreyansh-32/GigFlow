import express from 'express';
import { getAllGigs, createGig, getGigById, getUserGigs } from '../controllers/gigController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createGigSchema } from '../config/zod';


const router = express.Router();

router.get('/', getAllGigs);
router.get('/my-gigs', protect, getUserGigs);
router.get('/:id', protect, getGigById);
router.post('/', protect, validate(createGigSchema), createGig);

export default router;