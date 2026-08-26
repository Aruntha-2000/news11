import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const API_URL =
    "https://news-11-production.up.railway.app";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const email = formData.email.trim();
    const password = formData.password;

    // ========================================
    // VALIDATION
    // ========================================

    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Logging in...");
    setMessageType("loading");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ========================================
      // LOGIN ERROR
      // ========================================

      if (!response.ok) {
        setMessage(
          data.message ||
            "Invalid email or password."
        );

        setMessageType("error");
        return;
      }

      // ========================================
      // CHECK TOKEN
      // ========================================

      if (!data.token) {
        setMessage(
          "Login succeeded, but no authentication token was received."
        );

        setMessageType("error");
        return;
      }

      // ========================================
      // SAVE TOKEN
      // ========================================

      localStorage.setItem(
        "token",
        data.token
      );

      // ========================================
      // SAVE USER
      // ========================================

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } else {
        localStorage.removeItem("user");
      }

      // ========================================
      // SUCCESS
      // ========================================

      setMessage(
        `Welcome ${
          data.user?.name || "User"
        }!`
      );

      setMessageType("success");

      // ========================================
      // REDIRECT
      // ========================================

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setMessage(
        "Cannot connect to the server. Please try again."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page-background login-background">

      <div className="login-page">

        <div className="login-card">

          {/* HEADER */}

          <div className="login-header">

            <div className="login-icon">
              🔐
            </div>

            <h1>
              Welcome Back
            </h1>

            <p>
              Login to your News11 account
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="login-email">
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
              />

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />

            </div>


            {/* FORGOT PASSWORD */}

            <div className="forgot-password">

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={`login-message ${messageType}`}
              >

                {messageType === "loading" && (
                  <span className="message-spinner">
                  </span>
                )}

                {messageType === "success" && (
                  <span>✓</span>
                )}

                {messageType === "error" && (
                  <span>⚠</span>
                )}

                <span>
                  {message}
                </span>

              </div>
            )}


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner">
                  </span>

                  Logging in...
                </>
              ) : (
                <>
                  🔐 Login
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;