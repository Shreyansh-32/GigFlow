"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBidSchema = exports.createGigSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(100),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").max(20, "Password cannot exceed 20 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").max(20, "Password cannot exceed 20 characters"),
});
exports.createGigSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(100),
    description: zod_1.z.string().min(10, "Description must be at least 10 characters"),
    budget: zod_1.z.number("Budget must be a number").positive("Budget must be positive"),
});
exports.createBidSchema = zod_1.z.object({
    gigId: zod_1.z.string().min(1, "Gig ID is required"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
    price: zod_1.z.number("Price must be a number").positive("Price must be positive"),
});
