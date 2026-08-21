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

      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        {/* NAME */}

        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <br />

        {/* EMAIL */}

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <br />

        {/* PASSWORD */}

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            minLength="6"
          />
        </div>

        <br />

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating account..."
            : "Register"}
        </button>

      </form>

      {/* MESSAGE */}

      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default Register;