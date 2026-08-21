import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const API_URL = "https://news-11-production.up.railway.app";

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

    // Clear old message when typing
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

    // Validate email
    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    // Validate password
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Invalid email or password."
        );

        setMessageType("error");
        return;
      }

      // ========================================
      // SAVE LOGIN INFORMATION
      // ========================================

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage(
        `Welcome ${
          data.user?.name || "User"
        }!`
      );

      setMessageType("success");

      // ========================================
      // REDIRECT AFTER LOGIN
      // ========================================

      // Small delay so user can see success message
      setTimeout(() => {
        window.location.href = "/";
      }, 700);

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setMessage(
        "Cannot connect to the server."
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
      </div>
      
      <div className="login-card">

        {/* HEADER */}

        <div className="login-header">

          <div className="login-icon">
            
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
                <span className="message-spinner"></span>
              )}

              {messageType === "success" && (
                <span>
                  ✓
                </span>
              )}

              {messageType === "error" && (
                <span>
                  ⚠
                </span>
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
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                 Login
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
  );
}

export default Login;