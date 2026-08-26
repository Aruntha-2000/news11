import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  "https://news-11-production.up.railway.app";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // ========================================
    // VALIDATION
    // ========================================

    if (!name) {
      setMessage("Please enter your name.");
      setMessageType("error");
      return;
    }

    if (!email) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      return;
    }

    if (!password) {
      setMessage("Please enter a password.");
      setMessageType("error");
      return;
    }

    if (password.length < 6) {
      setMessage(
        "Password must be at least 6 characters."
      );
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Creating your account...");
    setMessageType("loading");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
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
      // ERROR
      // ========================================

      if (!response.ok) {
        setMessage(
          data.message ||
            "Registration failed. Please try again."
        );

        setMessageType("error");
        return;
      }

      // ========================================
      // SUCCESS
      // ========================================

      setMessage(
        data.message ||
          "Registration successful! You can now login."
      );

      setMessageType("success");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(
        "Registration error:",
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
    <div className="page-background register-background">

      <div className="register-page">

        <div className="register-card">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="register-header">

            <div className="register-icon">
              📝
            </div>

            <h1>
              Create Account
            </h1>

            <p>
              Join the News11 community
            </p>

          </div>


          {/* ==================================
              FORM
          ================================== */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="register-field">

              <label htmlFor="register-name">
                Name
              </label>

              <input
                id="register-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                maxLength={100}
                required
                disabled={loading}
              />

            </div>


            {/* EMAIL */}

            <div className="register-field">

              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
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

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>

              <input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
                disabled={loading}
              />

              <span className="field-hint">
                Password must be at least 6 characters.
              </span>

            </div>


            {/* ==================================
                MESSAGE
            ================================== */}

            {message && (
              <div
                className={`register-message ${messageType}`}
                role="alert"
              >

                {messageType === "loading" && (
                  <span className="message-spinner"></span>
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


            {/* ==================================
                REGISTER BUTTON
            ================================== */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  📝 Create Account
                </>
              )}

            </button>

          </form>


          {/* ==================================
              LOGIN
          ================================== */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;