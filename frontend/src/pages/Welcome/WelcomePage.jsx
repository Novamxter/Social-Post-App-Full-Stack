import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
          alt="social"
          className="hero-img"
        />
        <h2>Connect with Friends</h2>
        <p>
          Welcome to <strong>SocialPost</strong> — a place to share your stories,
          photos, and moments that matter most.
        </p>
      </div>

      <div className="welcome-login-section">
        <h3>Login with SocialPost</h3>
        <button className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Continue with Google
        </button>

        <p className="other-method">Other Login Method</p>
        <button className="email-btn" onClick={() => navigate("/login")}>
          Login with Email
        </button>

        <p className="footer-note">
          Stay connected with your friends and community — anytime, anywhere.
        </p>
      </div>
    </div>
  );
}
