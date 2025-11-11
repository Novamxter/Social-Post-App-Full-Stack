import Post from "../models/PostSchema.js";
import User from "../models/UserSchema.js";

// ------------------------ CREATE POST ------------------------
export const createPost = async (req, res) => {
  try {
    const text = req.body.text || req.body.content;
    const image = req.file ? `/uploads/posts/${req.file.filename}` : null;

    if (!req.user) {
      console.log(
        "⚠️ No user found in req.user — middleware might have failed"
      );
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user._id;

    // Validate request content
    if (!text && !image) {
      console.log("❌ Missing both text and image fields");
      return res
        .status(400)
        .json({ error: "Either text or image is required" });
    }

    // Fetch user from DB (extra check)
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found in DB for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Create new post
    const newPost = new Post({
      user: user._id,
      text,
      image,
    });

    await newPost.save();

    const populated = await Post.findById(newPost._id).populate(
      "user",
      "username email profilePic"
    );

    res.status(201).json(populated);
  } catch (err) {
    console.error("🔥 Error in createPost:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------ GET ALL POSTS ------------------------
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------------ LIKE POST ------------------------
export const likePost = async (req, res) => {
  try {
    const { postId, username } = req.body;

    if (!postId || !username) {
      return res.status(400).json({ message: "Post ID or username missing" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Check if user already liked
    const alreadyLiked = post.likes.some((like) => like.username === username);

    if (alreadyLiked) {
      post.likes = post.likes.filter((like) => like.username !== username);
    } else {
      post.likes.push({ username });
    }

    const updatedPost = await post.save();

    await updatedPost.populate("user", "username email");
    // ✅ Emit through socket.io to everyone except sender
    req.io.emit("receiveLike", updatedPost);
    // res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error in likePost:", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------ COMMENT ON POST ------------------------
export const commentPost = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const user = req.user;

    if (!text?.trim()) {
      console.log("❌ Empty comment");
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.log("❌ Post not found:", postId);
      return res.status(404).json({ error: "Post not found" });
    }

    // 💾 Add comment to post
    const newComment = {
      username: user.username,
      comment: text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Return updated post
    const updatedPost = await Post.findById(postId).populate(
      "user",
      "username email"
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Error in commentPost:", err);
    res.status(500).json({ message: err.message });
  }
};
