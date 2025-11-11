import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import Post from "./models/PostSchema.js";

dotenv.config();

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://social-post-app-full-stack.vercel.app"
    : "http://192.168.31.17:5173";

// "http://192.168.31.17:5173",
const app = express();
app.set("trust proxy", 1);

// const allowedOrigins = [
//   "https://social-post-app-full-stack.vercel.app",
//   "https://social-post-app-full-stack.vercel.app/",
// ];

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.path}`);
  next();
});
 
// ✅ Handle CORS manually for ALL requests including OPTIONS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log("🔵 Preflight request received:", req.path);
    return res.status(200).end() // ✅ reply with success for preflight
  }
  next();
});

// app.use(
//   cors({
//     origin: allowedOrigins, // 👈 exact origin of your frontend
//     credentials: true, // 👈 allow cookies/auth headers
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//     allowedHeaders: ["Content-Type", "Authorization"],
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );


app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigin, // replace '*' with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
  allowUpgrades: true,
  path: "/socket.io"
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/uploads", express.static("uploads"));

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("Social Post App Backend Running 🚀");
});

// Listen for socket connections
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listening for events from client
  socket.on("newPost", (post) => {
    // Broadcast the new post to all other clients except sender
    socket.broadcast.emit("receivePost", post);
  });

  socket.on("likePost", async ({ postId, username }) => {
    const post = await Post.findById(postId);
    if (!post) return;

    const alreadyLiked = post.likes.find((l) => l.username === username);
    if (alreadyLiked) {
      post.likes = post.likes.filter((l) => l.username !== username);
    } else {
      post.likes.push({ username });
    }
    await post.save();

    const updated = await Post.findById(postId).populate(
      "user",
      "username email"
    );
    io.emit("receiveLike", updated);
  });

  // NEW: Comment Event
  socket.on("addComment", async (updatedPost) => {
    io.emit("receiveComment", updatedPost); // send to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT} `));
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT} `));
