"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gigController_1 = require("../controllers/gigController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const zod_1 = require("../config/zod");
const router = express_1.default.Router();
router.get('/', gigController_1.getAllGigs);
router.get('/my-gigs', authMiddleware_1.protect, gigController_1.getUserGigs);
router.get('/:id', authMiddleware_1.protect, gigController_1.getGigById);
router.post('/', authMiddleware_1.protect, (0, validate_1.validate)(zod_1.createGigSchema), gigController_1.createGig);
exports.default = router;
