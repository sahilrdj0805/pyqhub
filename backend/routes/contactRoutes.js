import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  getContactStats
} from "../controllers/contactController.js";
import { protect, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

// Public route - anyone can send contact message
router.post("/", createContactMessage);

// Admin only routes
router.use(protect, adminOnly);
router.get("/", getAllContactMessages);
router.get("/stats", getContactStats);
router.put("/:id", updateMessageStatus);
router.delete("/:id", deleteContactMessage);

export default router;