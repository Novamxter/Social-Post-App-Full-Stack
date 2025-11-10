import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api.mjs";
// import "./LoginPage.css";
import "../../styles/Form.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({ email: "", password: "" });
  const { saveToken, setIsLogout } = useAuth();

  const handleData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      saveToken(res.data.accessToken);
      setIsLogout(false);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.error);
        if (err.response.data.errorIn === "username") {
          setUser((prev) => ({ ...prev, username: "" }));
        } else if (err.response.data.errorIn === "password") {
          setUser((prev) => ({ ...prev, password: "" }));
        }
      } else {
        console.error("Error in Login:", err);
      }
    }
  };

  return (
    <div className="auth-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={20} />
      </button>

      <h2>Login</h2>
      <p>Welcome back! Login to share your latest post.</p>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          onChange={handleData}
          required
        />

        <div className="password-field">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={user.password}
            onChange={handleData}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="or">Or</p>

      <button className="google-btn">
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
        />
        Sign in with Google
      </button>

      <p className="auth-text">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
}
