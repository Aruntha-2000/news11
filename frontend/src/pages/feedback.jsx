import { useState } from "react";

function Feedback() {
  const API_URL = "https://news-11-production.up.railway.app";

  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const MAX_LENGTH = 1000;

  // ==========================================
  // HANDLE FEEDBACK SUBMISSION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setStatusMessage("Please login to submit feedback.");
      setStatusType("error");
      return;
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setStatusMessage("Feedback cannot be empty.");
      setStatusType("error");
      return;
    }

    if (trimmedMessage.length < 3) {
      setStatusMessage("Please enter at least 3 characters.");
      setStatusType("error");
      return;
    }

    if (trimmedMessage.length > MAX_LENGTH) {
      setStatusMessage(
        `Feedback cannot exceed ${MAX_LENGTH} characters.`
      );
      setStatusType("error");
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setStatusMessage("Submitting feedback...");
    setStatusType("loading");

    try {
      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(
          data.message || "Unable to submit feedback."
        );
        setStatusType("error");
        return;
      }

      setStatusMessage(
        data.message || "Feedback submitted successfully."
      );

      setStatusType("success");
      setMessage("");
    } catch (error) {
      console.error("Feedback error:", error);

      setStatusMessage("Cannot connect to server.");
      setStatusType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // HANDLE TEXT CHANGE
  // ==========================================

  const handleMessageChange = (e) => {
    const value = e.target.value;

    if (value.length <= MAX_LENGTH) {
      setMessage(value);
    }

    if (statusMessage && statusType !== "loading") {
      setStatusMessage("");
      setStatusType("");
    }
  };

  const characterCount = message.length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page-background feedback-background">

      {/* PAGE HEADER */}

      <div className="feedback-header">

        <div className="feedback-icon">
          💬
        </div>

        <div>
          <h1>Feedback</h1>

          <p>
            We would love to hear your feedback.
          </p>
        </div>

      </div>


      {/* FEEDBACK CARD */}

      <div className="feedback-card">

        <div className="feedback-card-header">

          <h2>
            Share Your Thoughts
          </h2>

          <p>
            Your feedback helps us improve News11
            and provide a better experience.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

          {/* TEXTAREA */}

          <div className="feedback-field">

            <label htmlFor="feedback-message">
              Your Feedback
            </label>

            <textarea
              id="feedback-message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Write your feedback here..."
              rows={7}
              maxLength={MAX_LENGTH}
              disabled={submitting}
              required
            />

            <div className="feedback-counter">

              <span>
                Please don't include passwords or
                other private information.
              </span>

              <span>
                {characterCount}/{MAX_LENGTH}
              </span>

            </div>

          </div>


          {/* STATUS MESSAGE */}

          {statusMessage && (

            <div
              className={`feedback-status ${statusType}`}
            >

              {statusType === "loading" && (
                <span className="feedback-spinner"></span>
              )}

              {statusType === "success" && (
                <span className="feedback-status-icon">
                  ✓
                </span>
              )}

              {statusType === "error" && (
                <span className="feedback-status-icon">
                  ⚠
                </span>
              )}

              <span>
                {statusMessage}
              </span>

            </div>

          )}


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="feedback-submit-button"
            disabled={
              submitting ||
              !message.trim()
            }
          >

            {submitting ? (
              <>
                <span className="button-spinner"></span>
                Submitting...
              </>
            ) : (
              <>
                💬 Submit Feedback
              </>
            )}

          </button>

        </form>

      </div>


      {/* INFORMATION */}

      <div className="feedback-info">

        <div className="feedback-info-icon">
          ℹ️
        </div>

        <div>

          <h3>
            Thank you for helping us improve
          </h3>

          <p>
            We review feedback from our users and
            use it to improve the News11 experience.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Feedback;