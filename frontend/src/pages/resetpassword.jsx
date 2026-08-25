import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "https://news-11-production.up.railway.app";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    // Check reset token
    if (!token) {
      setMessage("Invalid or missing password reset link.");
      setMessageType("error");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password/${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
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
          data.message || "Password reset failed. The link may be expired."
        );

        setMessageType("error");
        return;
      }

      setMessage("Password reset successfully!");
      setMessageType("success");
      setSuccess(true);

      // Clear password fields
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Reset password error:", error);

      setMessage(
        "Cannot connect to the server. Please try again later."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">

          <div className="login-icon">
            🔐
          </div>

          <h1>Create New Password</h1>

          <p>
            Enter your new News11 password.
          </p>

        </div>

        {/* SUCCESS */}
        {success ? (
          <div className="login-success-box">

            <div className="success-icon">
              ✅
            </div>

            <h2>Password Changed</h2>

            <p>
              Your password has been changed
              successfully.
            </p>

            <Link
              to="/login"
              className="login-button"
            >
              Go to Login
            </Link>

          </div>
        ) : (

          /* FORM */
          <form onSubmit={handleSubmit}>

            {/* NEW PASSWORD */}
            <div className="login-field">

              <label htmlFor="new-password">
                New Password
              </label>

              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading}
              />

            </div>


            {/* CONFIRM PASSWORD */}
            <div className="login-field">

              <label htmlFor="confirm-password">
                Confirm New Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading}
              />

            </div>


            {/* MESSAGE */}
            {message && (
              <div
                className={`login-message ${messageType}`}
                role="alert"
              >
                {message}
              </div>
            )}


            {/* SUBMIT */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "🔐 Reset Password"}
            </button>


            {/* BACK TO LOGIN */}
            <div className="login-register">

              <Link to="/login">
                ← Back to Login
              </Link>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default ResetPassword;