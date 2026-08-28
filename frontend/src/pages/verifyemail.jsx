import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.message || "Verification failed");
          return;
        }

        setStatus("success");
        setMessage(data.message);
      } catch (error) {
        console.error("Email verification error:", error);

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

            <h1>Verifying Email</h1>

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

            <h1>Email Verified!</h1>

            <p>
              {message}
            </p>

            <button
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

            <h1>Verification Failed</h1>

            <p>
              {message}
            </p>

            <button
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