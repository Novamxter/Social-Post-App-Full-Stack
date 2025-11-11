import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinaryConfig.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "username you entered does not exists.",
        errorIn: "username",
      });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res
        .status(400)
        .json({ error: "Invalid Password", errorIn: "password" });
    }

    const accessToken = await generateAccessToken(user);
    if (!accessToken)
      return res.status(400).json({ error: "token not generated." });

    res.status(200).json({ user: user, accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message, error: err });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        error: "User already exists with this username",
        errorIn: "username",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "User already exists with this email",
        errorIn: "email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const accessToken = await generateAccessToken(newUser);
    if (!accessToken)
      return res.status(400).json({ error: "token not generated." });

    res.status(200).json({ user: newUser, accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message, error: err });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// export const updateProfilePic = async (req, res) => {
//   try {
//     const { user } = req;
//     // console.log("File received:", req.file);
//     if (!req.file)
//       return res.status(400).json({ message: "No image uploaded" });

//     // const base64Image = req.file.buffer.toString("base64");

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { profilePic: `/uploads/profilePics/${req.file.filename}` },
//       { new: true }
//     ).select("-password");

//     // console.log("User updated:", user);
//     res.json({ message: "Profile picture updated", user: updatedUser });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ message: "Error updating profile", error });
//   }
// };

export const updateProfilePic = async (req, res) => {
  try {
    const { user } = req;

    if (!req.file)
      return res.status(400).json({ message: "No image uploaded" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilePics",
      resource_type: "image",
    });

    // Optional: delete old profile pic from Cloudinary if you store public_id
    if (user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    // Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { profilePic: result.secure_url, profilePicId: result.public_id },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile picture updated", user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    { _id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );
}
