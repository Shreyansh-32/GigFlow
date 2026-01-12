"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validate_1 = require("../middleware/validate");
const zod_1 = require("../config/zod");
const router = express_1.default.Router();
router.post('/register', (0, validate_1.validate)(zod_1.registerSchema), authController_1.registerUser);
router.post('/login', (0, validate_1.validate)(zod_1.loginSchema), authController_1.loginUser);
router.post('/logout', authController_1.logoutUser);
exports.default = router;
