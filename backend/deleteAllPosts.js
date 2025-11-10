import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Post from "./models/PostSchema.js"; // adjust path if needed

dotenv.config();

// 1. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const deleteAllPosts = async () => {
  try {
    // Delete all post images from uploads/posts
    const postsFolder = path.join(process.cwd(), "uploads/posts");
    if (fs.existsSync(postsFolder)) {
      fs.readdirSync(postsFolder).forEach((file) => {
        fs.unlinkSync(path.join(postsFolder, file));
      });
      console.log("✅ All post images deleted from uploads/posts");
    }

    // Delete all posts from MongoDB
    await Post.deleteMany({});
    console.log("✅ All posts deleted from MongoDB");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error deleting posts:", err);
    mongoose.disconnect();
  }
};

// Run the deletion
deleteAllPosts();
