import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/api.mjs";
import "../../styles/Form.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({ email: "", password: "" });
  const { saveToken, setIsLogout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const demoCredentials = {
        email: "demo@gmail.com",
        password: "123456",
      };

      const res = await loginUser(demoCredentials);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      saveToken(res.data.accessToken);
      setIsLogout(false);
      navigate("/home");

      console.log("Guest login successful:", res.data);

      // Whatever you normally do after login
      // e.g. save token and navigate
      // localStorage.setItem("token", res.data.token);
      // navigate("/home");
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      setGuestLoading(false);
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

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Login"}
        </button>
      </form>

      <p className="or">Or</p>

      <button className="guest-btn" onClick={handleGuestLogin} disabled={loading}>
        {guestLoading ? <div className="spinner"></div> : "Login as Guest"}
      </button>

      <button className="google-btn">
        <img src="/Images/google.png" alt="Google" />
        Sign in with Google
      </button>

      <p className="auth-text">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
}
