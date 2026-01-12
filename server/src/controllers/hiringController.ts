import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Bid from '../models/Bid';
import Gig from '../models/Gig';
import { getIO, getUserSocket } from '../socket';


interface AuthRequest extends Request {
  user?: any;
}

export const hireFreelancer = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.body;
    const userId = req.user._id;


    const bid = await Bid.findById(bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: 'Bid not found' });
      return;
    }


    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      res.status(404).json({ message: 'Gig not found' });
      return;
    }


    if (gig.ownerId.toString() !== userId.toString()) {
      await session.abortTransaction();
      session.endSession();
      res.status(403).json({ message: 'Not authorized to hire for this gig' });
      return;
    }


    if (gig.status === 'Assigned') {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: 'This gig is already Assigned' });
      return;
    }


    bid.status = 'Hired';
    await bid.save({ session });

    
    gig.status = 'Assigned';
    await gig.save({ session });

    
    await Bid.updateMany(
      { gigId: gig._id , _id: { $ne: bid._id } } as any, 
      { status: 'Rejected' },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const io = getIO();
    const freelancerSocketId = getUserSocket(bid.freelancerId.toString());

    console.log("--- DEBUGGING NOTIFICATION ---");
    console.log("Target User (Freelancer):", bid.freelancerId.toString());
    console.log("Found Socket ID:", freelancerSocketId);

    if (freelancerSocketId) {
        io.to(freelancerSocketId).emit('notification', {
            message: `You have been hired for the project: ${gig.title}!`,
            gigId: gig._id,
        });
    }

    res.status(200).json({ message: 'Freelancer hired successfully', bid });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: 'Hiring failed due to server error' });
  }
};