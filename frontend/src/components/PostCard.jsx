import React, { useState, useEffect } from "react";
import { Heart, MessageCircle } from "lucide-react"; // lucide-react icons
import { likePost, commentPost } from "../services/api.mjs";
import { jwtDecode } from "jwt-decode";

function PostCard({ post, token, onLike, socket }) {
  const decoded = token ? jwtDecode(token) : null;
  const currentUser = decoded ? { username: decoded.username } : null;

  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [liked, setLiked] = useState(false);

  // Check if this post is liked by current user
  useEffect(() => {
    if (post.likes?.some((l) => l.username === currentUser.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [post.likes, currentUser.username]);

  const dateObj = new Date(post.createdAt);
  const datePart = dateObj.toDateString();
  const timePart = dateObj.toLocaleTimeString("en-US", { hour12: true });

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like posts");
      return;
    }
    try {
      await likePost(
        { postId: post._id, username: currentUser.username },
        token
      );

      if (onLike) onLike(post._id); 
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await commentPost(
        { postId: post._id, text: newComment },
        token
      );
      setComments(res.data.comments);
      socket.emit("addComment", res.data);
      setNewComment("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  const handleFocus = () => setShowButtons(true);
  const handleCancel = () => {
    setNewComment("");
    setShowButtons(false);
  };

  useEffect(() => {
    setComments(post.comments || []);
  }, [post.comments]);

  return (
    <div className="post-card">
      <div className="post-info">
        <div className="profile-pic">
          <img src={post.user?.profilePic || "/Images/profile.png"} alt={post.user?.username} />
        </div>
        <div className="post-details">
          <div className="username">{post.user?.username || "Anonymous"}</div>
          <div className="timestamp">
            {datePart} &#8226; {timePart}
          </div>
        </div>
      </div>

      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt="Post" />
        </div>
      )}
      {post.text && <p>{post.text}</p>}

      {/* Action Row */}
      <div className="post-actions-row">
        <div className="like" onClick={handleLike}>
          <Heart
            size={20}
            color={liked ? "red" : "gray"}
            fill={liked ? "red" : "none"}
          />
          <span className="count">{post.likes.length}</span>
        </div>

        <div
          className="comment-toggle"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} />
          <span className="count">{comments.length}</span>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="comment-section">
          <form className="comment-form" onSubmit={handleComment}>
            <div className="comment-input-wrapper">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onFocus={handleFocus}
              />

              {showButtons && (
                <div className="comment-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Comment
                  </button>
                </div>
              )}
            </div>
          </form>

          <div className="comments">
            {[...comments].reverse().map((c, idx) => (
              <div className="comment-item" key={idx}>
                <div className="comment-profile-pic">
                  <img
                    src={c.profilePic || "/Images/profile.png"}
                    alt={c.username}
                  />
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-username">{c.username}</span>
                    {/* <span className="comment-time">{c.timeAgo}</span> */}
                  </div>
                  <div className="comment-text">{c.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
