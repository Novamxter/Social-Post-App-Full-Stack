import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfilePic } from "../../services/api.mjs";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { accessToken, handleLogout, user, setUser } = useAuth();
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle profile pic upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const updatedUser = await updateProfilePic(formData, accessToken);
      setUser(updatedUser);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false);
    }
  };
  // data:image/jpeg;base64,
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Profile</h2>
        {user ? (
          <div className="profile-info">
            <div className="profile-page-pic-container">
              <img
                src={preview || user.profilePic}
                alt="Profile"
                className="profile-page-pic"
              />
              <label className="upload-label">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
              {loading && <p className="uploading-text">Uploading...</p>}
            </div>

            <div className="profile-field">
              <label>Username:</label>
              <span>{user.username}</span>
            </div>

            <div className="profile-field">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>

            <div className="profile-field">
              <label>Member Since:</label>
              <span>
                {new Date(user.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <button className="pro-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
