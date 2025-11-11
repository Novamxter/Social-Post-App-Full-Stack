import React, { useState, useRef } from "react";
import { createPost } from "../services/api.mjs";

function PostBox({ onPostCreated, onPostComplete, token, fetchPosts, socket }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image)
      return alert("Write something or add an image!");

    setLoading(true);
    onPostCreated();
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await createPost(formData, token);

      if (res.status === 201) {
        const newPost = res.data;

        if (socket) socket.emit("newPost", newPost);

        setContent("");
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = null;

        setTimeout(() => {
          onPostComplete(); // hide skeleton and refresh posts
        }, 400);
        setExpanded(false);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-box-wrapper">
      {!expanded ? (
        // Collapsed mini box
        <div className="post-box-collapsed" onClick={() => setExpanded(true)}>
          <p>Share what’s on your mind...</p>
        </div>
      ) : (
        // Expanded full form
        <form className="post-box" onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <div className="post-actions">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PostBox;
