import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const API_URL =
    "https://news-11-production.up.railway.app";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setEmail(e.target.value);

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setMessage(
        "Please enter your email address."
      );

      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Checking your request...");
    setMessageType("loading");

    try {
      /*
       * IMPORTANT:
       *
       * This endpoint must exist in your backend:
       *
       * POST /api/auth/forgot-password
       *
       * If your backend uses a different endpoint,
       * we need to change this URL.
       */

      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to process your request."
        );

        setMessageType("error");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists with this email, password reset instructions have been sent."
      );

      setMessageType("success");

      setEmail("");

    } catch (error) {
      console.error(
        "Forgot password error:",
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
    <div className="page-background forgot-password-background">

      <div className="forgot-password-page">

        <div className="forgot-password-card">

          {/* HEADER */}

          <div className="forgot-password-header">

            <div className="forgot-password-icon">
              🔑
            </div>

            <h1>
              Forgot Password?
            </h1>

            <p>
              Enter your email address and
              we'll help you reset your password.
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="forgot-password-field">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
              />

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={`forgot-password-message ${messageType}`}
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


            {/* SUBMIT */}

            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner">
                  </span>

                  Please wait...
                </>
              ) : (
                <>
                  📧 Send Reset Instructions
                </>
              )}

            </button>

          </form>


          {/* BACK TO LOGIN */}

          <div className="forgot-password-login">

            <Link to="/login">
              ← Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;