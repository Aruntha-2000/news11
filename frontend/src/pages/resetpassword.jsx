import { useState } from "react";
import {
  Link,
  useParams
} from "react-router-dom";


function ResetPassword() {

  const API_URL =
    "https://news-11-production.up.railway.app";


  const { token } =
    useParams();


  const [password, setPassword] =
    useState("");


  const [confirmPassword,
    setConfirmPassword] =
    useState("");


  const [message,
    setMessage] =
    useState("");


  const [messageType,
    setMessageType] =
    useState("");


  const [loading,
    setLoading] =
    useState(false);


  const [success,
    setSuccess] =
    useState(false);


  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (password.length < 6) {

        setMessage(
          "Password must be at least 6 characters."
        );

        setMessageType(
          "error"
        );

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        setMessage(
          "Passwords do not match."
        );

        setMessageType(
          "error"
        );

        return;
      }


      setLoading(true);

      setMessage("");


      try {

        const response =
          await fetch(

            `${API_URL}/api/auth/reset-password/${token}`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json"

              },

              body:
                JSON.stringify({

                  password

                })

            }

          );


        const data =
          await response.json();


        if (!response.ok) {

          setMessage(
            data.message ||
            "Password reset failed."
          );

          setMessageType(
            "error"
          );

          return;
        }


        setMessage(
          "Password reset successfully!"
        );

        setMessageType(
          "success"
        );

        setSuccess(true);


      } catch (error) {

        console.error(
          "Reset password error:",
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
            🔐
          </div>

          <h1>
            Create New Password
          </h1>

          <p>
            Enter your new News11 password.
          </p>

        </div>


        {!success ? (

          <form
            onSubmit={handleSubmit}
          >


            <div
              className="login-field"
            >

              <label
                htmlFor="new-password"
              >
                New Password
              </label>


              <input

                id="new-password"

                type="password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder=
                  "Enter new password"

                autoComplete=
                  "new-password"

                required

                disabled={loading}

              />

            </div>


            <div
              className="login-field"
            >

              <label
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>


              <input

                id="confirm-password"

                type="password"

                value={
                  confirmPassword
                }

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

                placeholder=
                  "Confirm new password"

                autoComplete=
                  "new-password"

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

              className=
                "login-button"

              disabled={loading}

            >

              {loading
                ? "Resetting..."
                : "🔐 Reset Password"}

            </button>


          </form>

        ) : (

          <div
            className=
              "login-message success"
          >

            <p>
              Your password has been
              changed successfully.
            </p>


            <Link to="/login">

              Go to Login

            </Link>

          </div>

        )}


      </div>

    </div>

  );

}


export default ResetPassword;