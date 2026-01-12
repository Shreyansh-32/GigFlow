"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bidController_1 = require("../controllers/bidController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const zod_1 = require("../config/zod");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.protect, (0, validate_1.validate)(zod_1.createBidSchema), bidController_1.createBid);
router.get('/my-bids', authMiddleware_1.protect, bidController_1.getUserBids);
router.get('/:gigId', authMiddleware_1.protect, bidController_1.getBidsByGig);
exports.default = router;
