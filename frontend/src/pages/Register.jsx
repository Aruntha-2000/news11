import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://news-11-production.up.railway.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Registration failed."
        );
        return;
      }

      setMessage(
        "Registration successful! You can now login."
      );

      setFormData({
        name: "",
        email: "",
        password: ""
      });

    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Cannot connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-background register-background">

      <div className="register-page">

        <div className="register-card">

          {/* HEADER */}

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


          {/* FORM */}

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
                required
                minLength={6}
                disabled={loading}
              />

              <small>
                Password must be at least 6 characters.
              </small>

            </div>


            {/* MESSAGE */}

            {message && (
              <div
                className={`register-message ${
                  message.includes("successful")
                    ? "success"
                    : "error"
                }`}
              >
                {message.includes("successful")
                  ? "✓"
                  : "⚠"}

                <span>
                  {message}
                </span>
              </div>
            )}


            {/* BUTTON */}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "📝 Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already have an account?
            </span>

            <a href="/login">
              Login
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;