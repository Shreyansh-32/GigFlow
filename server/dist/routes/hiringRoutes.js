"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hiringController_1 = require("../controllers/hiringController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.patch('/hire', authMiddleware_1.protect, hiringController_1.hireFreelancer);
exports.default = router;
