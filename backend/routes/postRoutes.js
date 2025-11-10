import express from "express";
import multer from "multer";
import {
  createPost,
  getAllPosts,
  likePost,
  commentPost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPost } from "../middleware/upload.js";

const router = express.Router();

router.post("/create", protect, uploadPost.single("image"), createPost);
router.get("/all", protect, getAllPosts);
router.post("/like", protect, likePost);
router.post("/comment", protect, commentPost);

export default router;
