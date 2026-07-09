import express from "express";
import {
  signup,
  signin,
  adminLogin,
  logout,
  getMe
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/admin/login", adminLogin);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);

export default router;