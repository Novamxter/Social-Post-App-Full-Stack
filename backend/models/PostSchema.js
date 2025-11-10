import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Relation to user
    required: true,
  },
  text: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // URL or filename
  },
  likes: [
    {
      username: String, // who liked
    }
  ],
  comments: [
    {
      username: String,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
