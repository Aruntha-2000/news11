import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {

  const API_URL =
    "https://news-11-production.up.railway.app";

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!email.trim()) {

      setMessage(
        "Please enter your email address."
      );

      setMessageType("error");

      return;
    }


    setLoading(true);

    setMessage("");


    try {

      const response = await fetch(

        `${API_URL}/api/auth/forgot-password`,

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            email:
              email.trim()
          })
        }

      );


      const data =
        await response.json();


      setMessage(
        data.message
      );


      setMessageType(
        response.ok
          ? "success"
          : "error"
      );


    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );

      setMessage(
        "Cannot connect to the server."
      );

      setMessageType(
        "error"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">

      <div className="login-card">


        <div className="login-header">

          <div className="login-icon">
            🔑
          </div>

          <h1>
            Forgot Password?
          </h1>

          <p>
            Enter your email to receive
            a password reset link.
          </p>

        </div>


        <form
          onSubmit={handleSubmit}
        >

          <div className="login-field">

            <label
              htmlFor="forgot-email"
            >
              Email Address
            </label>


            <input

              id="forgot-email"

              type="email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              placeholder=
                "Enter your email"

              autoComplete="email"

              required

              disabled={loading}

            />

          </div>


          {message && (

            <div
              className=
                {`login-message ${messageType}`}
            >
              {message}
            </div>

          )}


          <button

            type="submit"

            className="login-button"

            disabled={loading}

          >

            {loading
              ? "Sending..."
              : "📧 Send Reset Link"}

          </button>

        </form>


        <div
          className="login-register"
        >

          <Link to="/login">

            ← Back to Login

          </Link>

        </div>


      </div>

    </div>

  );

}


export default ForgotPassword;