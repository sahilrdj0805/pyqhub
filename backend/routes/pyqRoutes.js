import express from "express";
import upload from "../middlewares/upload.js";
import {
  addPYQ,
  getPYQs,
  getPYQsBySubject
} from "../controllers/pyqController.js";

const router = express.Router();


router.post("/", upload.single("pdf"), addPYQ);  // Add new PYQ with file upload
router.get("/", getPYQs);                        // Get all PYQs with filters
router.get("/by-subject", getPYQsBySubject);     // Get PYQs by subject name

export default router;
