import { Request, Response } from 'express';
import Gig from '../models/Gig';

interface AuthRequest extends Request {
  user?: any;
}

export const getAllGigs = async (req: Request, res: Response) => {
  try {
    const searchQuery = typeof req.query.search === 'string' ? req.query.search : '';

    const query = searchQuery
      ? { title: { $regex: searchQuery, $options: 'i' }, status: 'Open' }
      : { status: 'Open' };

    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createGig = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getGigById = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');

    if (!gig) {
      res.status(404).json({ message: 'Gig not found' });
      return; 
    }

    res.json(gig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getUserGigs = async (req: AuthRequest, res: Response) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};