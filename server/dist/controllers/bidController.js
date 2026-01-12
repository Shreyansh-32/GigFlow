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
exports.getUserBids = exports.getBidsByGig = exports.createBid = void 0;
const Bid_1 = __importDefault(require("../models/Bid"));
const Gig_1 = __importDefault(require("../models/Gig"));
const createBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId, message, price } = req.body;
        const gig = yield Gig_1.default.findById(gigId);
        if (!gig) {
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        if (gig.ownerId.toString() === req.user._id.toString()) {
            res.status(400).json({ message: 'You cannot bid on your own gig' });
            return;
        }
        const existingBid = yield Bid_1.default.findOne({ gigId, freelancerId: req.user._id });
        if (existingBid) {
            res.status(400).json({ message: 'You have already placed a bid on this gig' });
            return;
        }
        const bid = yield Bid_1.default.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price,
            status: "Pending"
        });
        res.status(201).json(bid);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createBid = createBid;
const getBidsByGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gigId } = req.params;
        const gig = yield Gig_1.default.findById(gigId);
        if (!gig) {
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized to view bids for this gig' });
            return;
        }
        const bids = yield Bid_1.default.find({ gigId: gigId }).populate('freelancerId', 'name email');
        res.json(bids);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getBidsByGig = getBidsByGig;
const getUserBids = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bids = yield Bid_1.default.find({ freelancerId: req.user._id })
            .populate('gigId', 'title status')
            .sort({ createdAt: -1 });
        res.json(bids);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getUserBids = getUserBids;
