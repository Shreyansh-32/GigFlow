import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password cannot exceed 20 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password cannot exceed 20 characters"),
});

export const createGigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number("Budget must be a number").positive("Budget must be positive"),
});

export const createBidSchema = z.object({
  gigId: z.string().min(1, "Gig ID is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  price: z.number("Price must be a number").positive("Price must be positive"),
});