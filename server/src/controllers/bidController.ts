import { Request, Response } from 'express';
import Bid from '../models/Bid';
import Gig from '../models/Gig';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

export const createBid = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      res.status(404).json({ message: 'Gig not found' });
      return;
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
        res.status(400).json({ message: 'You cannot bid on your own gig' });
        return;
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
      res.status(400).json({ message: 'You have already placed a bid on this gig' });
      return;
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
      status:"Pending"
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getBidsByGig = async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      res.status(404).json({ message: 'Gig not found' });
      return;
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to view bids for this gig' });
      return;
    }

    const bids = await Bid.find( {gigId : gigId as any} ).populate('freelancerId', 'name email');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserBids = async (req: AuthRequest, res: Response) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user._id })
      .populate('gigId', 'title status') 
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};