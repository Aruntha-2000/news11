import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "https://news-11-production.up.railway.app";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const url =
          `${API_URL}/api/auth/verify-email/${token}`;

        console.log("Verification API URL:", url);

        const response = await fetch(url);

        const contentType =
          response.headers.get("content-type") || "";

        console.log(
          "Verification response:",
          response.status,
          contentType
        );

        // Make sure the server returned JSON
        if (!contentType.includes("application/json")) {
          const text = await response.text();

          console.error(
            "Expected JSON but received:",
            text.substring(0, 500)
          );

          setStatus("error");
          setMessage(
            "The verification server returned an invalid response."
          );

          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data.message || "Verification failed"
          );

          return;
        }

        setStatus("success");
        setMessage(
          data.message ||
            "Email verified successfully. You can now log in."
        );

      } catch (error) {
        console.error(
          "Email verification error:",
          error
        );

        setStatus("error");
        setMessage(
          "Unable to verify your email. Please try again."
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div className="verify-email-page">

      <div className="verify-email-card">

        {status === "verifying" && (
          <>
            <div className="verify-icon">
              ⏳
            </div>

            <h1>
              Verifying Email
            </h1>

            <p>
              Please wait while we verify your
              email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="verify-icon success">
              ✅
            </div>

            <h1>
              Email Verified!
            </h1>

            <p>
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="verify-button"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="verify-icon error">
              ❌
            </div>

            <h1>
              Verification Failed
            </h1>

            <p>
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="verify-button"
            >
              Back to Register
            </button>
          </>
        )}

      </div>

    </div>
  );
};

export default VerifyEmail;

