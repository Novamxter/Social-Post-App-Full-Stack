import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";

export const protect = async (req, res, next) => {
  try {
    // console.log("🔹 Raw Authorization:", JSON.stringify(req.header("Authorization")));

    const authHeader = req.header("Authorization");
    if (!authHeader) {
      console.log("🚫 No Authorization header");
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.replace(/Bearer\s+/i, "").trim();
    // console.log("✅ Extracted token:", token);

    if (!token) {
      console.log("🚫 Token missing after replace()");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded payload:", decoded);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      console.log("🚫 User not found");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
