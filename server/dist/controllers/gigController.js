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
exports.getUserGigs = exports.getGigById = exports.createGig = exports.getAllGigs = void 0;
const Gig_1 = __importDefault(require("../models/Gig"));
const getAllGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = typeof req.query.search === 'string' ? req.query.search : '';
        const query = searchQuery
            ? { title: { $regex: searchQuery, $options: 'i' }, status: 'Open' }
            : { status: 'Open' };
        const gigs = yield Gig_1.default.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });
        res.json(gigs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getAllGigs = getAllGigs;
const createGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, budget } = req.body;
        const gig = yield Gig_1.default.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });
        res.status(201).json(gig);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createGig = createGig;
const getGigById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = yield Gig_1.default.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) {
            res.status(404).json({ message: 'Gig not found' });
            return;
        }
        res.json(gig);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getGigById = getGigById;
const getUserGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gigs = yield Gig_1.default.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getUserGigs = getUserGigs;
