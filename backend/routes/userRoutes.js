import express from "express";
import {
  loginUser,
  registerUser,
  updateProfilePic,
  getCurrentUser
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadProfile, deleteOldProfilePic } from "../middleware/upload.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", protect, getCurrentUser);
// router.post("/upload-profile", verifyToken, upload.single("profilePic"), 
router.put(
  "/update-profile-pic",
  protect,
  uploadProfile.single("image"),
  deleteOldProfilePic,
  updateProfilePic
);

export default router;
