import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import WelcomePage from "./pages/Welcome/WelcomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import Home from "./pages/Home/Home";
import ProfilePage from "./pages/Profile/ProfilePage";
import Navbar from "./components/Navbar";
// import SocialPage from "./pages/Social/Social";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
