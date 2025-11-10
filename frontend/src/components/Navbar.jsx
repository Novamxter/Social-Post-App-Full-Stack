import React from "react";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo">TaskPlanet Social</div>
      <div className="nav-links">
        <a href="/home">Home</a>
        <a href="/profile">Profile</a>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
