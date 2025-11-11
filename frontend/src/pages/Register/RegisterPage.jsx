import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/api.mjs";
// import "./RegisterPage.css";
import "../../styles/Form.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const { saveToken, setIsLogout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      saveToken(res.data.accessToken);
      setIsLogout(false);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.error);
        if (err.response.data.errorIn === "username") {
          setUser((prev) => ({ ...prev, username: "" }));
        } else if (err.response.data.errorIn === "email") {
          setUser((prev) => ({ ...prev, email: "" }));
        }
      } else {
        console.error("Error in Registration:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={20} />
      </button>

      <h2>Create Account</h2>
      <p>Join the SocialPost community and start sharing!</p>

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={user.username}
          onChange={handleData}
          required
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={user.email}
          onChange={handleData}
          required
        />

        <div className="password-field">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={user.password}
            onChange={handleData}
            required
          />
          <span className="eye-icon" onClick={togglePassword}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Register"}
        </button>
      </form>

      <p className="or">Or</p>

      <button className="google-btn">
        <img
          src="/Images/google.png"
          alt="Google"
        />
        Continue with Google
      </button>

      <p className="auth-text">
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login</span>
      </p>
    </div>
  );
}
