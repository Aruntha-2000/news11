import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const API_URL = "https://news-11-production.up.railway.app";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // ==============================
    // VALIDATE EMAIL
    // ==============================

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (loading) {
      return;
    }

    // ==============================
    // START REQUEST
    // ==============================

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      // ==============================
      // SERVER ERROR
      // ==============================

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to process your request. Please try again."
        );

        setMessageType("error");
        return;
      }

      // ==============================
      // SUCCESS
      // ==============================

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setMessageType("success");

      // Clear email after successful request
      setEmail("");

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setMessage(
        "Cannot connect to the server. Please try again later."
      );

      setMessageType("error");

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HANDLE EMAIL CHANGE
  // ==============================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // Clear previous message when user starts typing
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  return (
    <div className="page-background forgot-password-background">

      {/* PAGE CONTAINER */}

      <div className="login-page">

        {/* LOGIN CARD */}

        <div className="login-card">

          {/* HEADER */}

          <div className="login-header">

            <div className="login-icon">
              🔑
            </div>

            <h1>
              Forgot Password?
            </h1>

            <p>
              Enter your email address to
              receive a password reset link.
            </p>

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="forgot-email">
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={`login-message ${messageType}`}
              >

                {messageType === "success" && (
                  <span>✓</span>
                )}

                {messageType === "error" && (
                  <span>⚠</span>
                )}

                {messageType === "loading" && (
                  <span className="message-spinner"></span>
                )}

                <span>
                  {message}
                </span>

              </div>
            )}


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading || !email.trim()}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  📧 Send Reset Link
                </>
              )}

            </button>

          </form>


          {/* BACK TO LOGIN */}

          <div className="login-register">

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