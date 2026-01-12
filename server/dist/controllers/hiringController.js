"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hireFreelancer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Bid_1 = __importDefault(require("../models/Bid"));
const Gig_1 = __importDefault(require("../models/Gig"));
const socket_1 = require("../socket");
const hireFreelancer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { bidId } = req.body;
        const userId = req.user._id;
        const bid = yield Bid_1.default.findById(bidId).session(session);
        if (!bid) {
            yield session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Bid not found' });
            return;
        }
        const gig = yield Gig_1.default.findById(bid.gigId).session(session);
        if (!gig) {
            yield session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        if (gig.ownerId.toString() !== userId.toString()) {
            yield session.abortTransaction();
            session.endSession();
            res.status(403).json({ message: 'Not authorized to hire for this gig' });
            return;
        }
        if (gig.status === 'Assigned') {
            yield session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'This gig is already Assigned' });
            return;
        }
        bid.status = 'Hired';
        yield bid.save({ session });
        gig.status = 'Assigned';
        yield gig.save({ session });
        yield Bid_1.default.updateMany({ gigId: gig._id, _id: { $ne: bid._id } }, { status: 'Rejected' }, { session });
        yield session.commitTransaction();
        session.endSession();
        const io = (0, socket_1.getIO)();
        const freelancerSocketId = (0, socket_1.getUserSocket)(bid.freelancerId.toString());
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
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Hiring failed due to server error' });
    }
});
exports.hireFreelancer = hireFreelancer;
