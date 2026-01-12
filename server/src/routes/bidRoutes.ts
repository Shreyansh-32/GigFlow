import express from 'express';
import { createBid, getBidsByGig, getUserBids } from '../controllers/bidController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';
import { createBidSchema } from '../config/zod';

const router = express.Router();

router.post('/', protect, validate(createBidSchema), createBid);
router.get('/my-bids', protect, getUserBids);
router.get('/:gigId', protect, getBidsByGig);

export default router;