import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload subfolders exist
const baseUploadPath = path.resolve("uploads");
const profilePath = path.join(baseUploadPath, "profilePics");
const postPath = path.join(baseUploadPath, "posts");

[baseUploadPath, profilePath, postPath].forEach((p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p);
});

// --- Multer storage for profile pics ---
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, profilePath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// --- Multer storage for post images ---
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, postPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// --- Export uploaders ---
export const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadPost = multer({
  storage: postStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// --- Middleware to delete old profile pic ---
export const deleteOldProfilePic = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) return next();

    if (user.profilePic) {
      const oldPath = path.join(process.cwd(), user.profilePic);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log("Old profile pic deleted:", oldPath);
      }
    }

    next();
  } catch (err) {
    console.error("Error deleting old profile pic:", err);
    next(); // don’t block if deletion fails
  }
};

// --- Middleware to delete old post image ---
export const deleteOldPostImage = async (req, res, next) => {
  try {
    const { post } = req; // attach post in previous middleware if needed
    if (!post) return next();

    if (post.image) {
      const oldPath = path.join(process.cwd(), post.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log("Old post image deleted:", oldPath);
      }
    }

    next();
  } catch (err) {
    console.error("Error deleting old post image:", err);
    next();
  }
};
