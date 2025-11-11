import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import PostBox from "../../components/PostBox";
import PostCard from "../../components/PostCard";
import PostSkeleton from "../../components/PostSkeleton";
import { io } from "socket.io-client";
import { getAllPosts } from "../../services/api.mjs";
import { jwtDecode } from "jwt-decode";
import "../../styles/DashBoard.css";

export const allowedOrigin =
  import.meta.env.MODE === "production"
    ? "https://social-post-app-full-stack.onrender.com"
    : "http://192.168.31.17:5000";

function HomePage() {
  const socketRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [posting, setPosting] = useState(false);
  const [socket, setSocket] = useState(null);

  const username = token ? jwtDecode(token)?.username : null;

  const fetchPosts = async () => {
    try {
      const res = await getAllPosts(token);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    // ✅ Initialize socket only when component loads in browser
    socketRef.current = io(allowedOrigin, {
      transports: ["websocket"],
      path: "/socket.io",
      withCredentials: true,
    });

    const socket = socketRef.current;
    window.socket = socket;
    setSocket(socket);
    return () => {
      socket.disconnect(); // ✅ cleanup
    };
  }, []);

  useEffect(() => {
    if (token) fetchPosts();

    const socket = socketRef.current;
    if (!socket) return;

    // --- SOCKET.IO LISTENERS ---
    socket.on("receivePost", (newPost) => {
      setPosts((prev) => [newPost, ...prev]);
    });

    socket.on("receiveLike", (updatedPost) => {
      setPosts((prev) =>
        prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    });

    socket.on("receiveComment", (updatedPost) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    });

    // Cleanup 
    return () => {
      socket.off("receivePost");
      socket.off("receiveLike");
      socket.off("receiveComment");
    };
  }, [token]);

  const handleLikePost = (postId) => {
    const socket = socketRef.current;
    if (!username) return alert("Please login first.");

    setPosts((prev) =>
      prev.map((post) => {
        if (post._id !== postId) return post;

        const hasLiked = post.likes.some((l) => l.username === username);
        const updatedLikes = hasLiked
          ? post.likes.filter((u) => u.username !== username)
          : [...post.likes, username];

        socket.emit("likePost", { postId, username });

        return { ...post, likes: updatedLikes };
      })
    );
  };

  const handlePostCreated = () => {
    setPosting(true);
  };

  // Called by PostBox after fetching done
  const handlePostComplete = async () => {
    await fetchPosts();
    setPosting(false);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <PostBox
          onPostCreated={handlePostCreated}
          onPostComplete={handlePostComplete}
          token={token}
          fetchPosts={fetchPosts}
          socket={socket}
        />

        <div className="feed-grid">
          {/* Loader Skeleton */}
          {posting && <PostSkeleton />}

          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              token={token}
              onLike={handleLikePost}
              socket={socket}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
