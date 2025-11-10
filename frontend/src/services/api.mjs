// src/services/api.mjs
import axios from "axios";


export const BASE_URL = import.meta.env.MODE === "production" 
  ? "https://social-post-app-backend.onrender.com/api"
  : "http://192.168.31.17:5000/api";

const API = axios.create({
  baseURL: "https://social-post-app-backend.onrender.com/api" , // backend base url
  withCredentials: true,
});

// ---------- USER AUTH ----------
export const registerUser = (data) => API.post("/users/register", data);
export const loginUser = (data) => API.post("/users/login", data);

// ------------GET CURRENT USER-------------
export const getCurrentUser = async (token) => {
  const res = await API.get("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

//---------------UPDATE PROFILE PIC----------------
export const updateProfilePic = async (formData, token) => {
  const res = await API.put("/users/update-profile-pic", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.user;
};


// ---------- POSTS ----------
export const createPost = async (data, token) => {
  try {
    // console.log(token);
    return await API.post("/posts/create", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log("Error api.mjs : ", err);
  }
};
export const getAllPosts = async (token) => {
  try {
    // console.log(token);
    return await API.get("/posts/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.log("Error api.mjs : ", err);
  }
};

export const likePost = (data, token) =>
  API.post("/posts/like", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const commentPost = (data, token) =>
  API.post("/posts/comment", data, {
    headers: { Authorization: `Bearer ${token}` },
  });


