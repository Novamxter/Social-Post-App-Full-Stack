import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // SPA navigation instead of full page reload
  };

  return (
    <nav className="navbar">
      <div className="logo">TaskPlanet Social</div>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
