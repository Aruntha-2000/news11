import { useEffect, useState } from "react";

function FeedbackAdmin() {
  const API_URL = "https://news-11-production.up.railway.app";

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ==========================================
  // GET FEEDBACK
  // ==========================================

  const getFeedback = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as admin.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${API_URL}/api/feedbacks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to load feedback."
        );
        setMessageType("error");
        setFeedback([]);
        return;
      }

      setFeedback(data.feedback || []);
    } catch (error) {
      console.error(
        "Get feedback error:",
        error
      );

      setMessage(
        "Cannot connect to server."
      );
      setMessageType("error");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD FEEDBACK
  // ==========================================

  useEffect(() => {
    getFeedback();
  }, []);

  // ==========================================
  // UPDATE FEEDBACK STATUS
  // ==========================================

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as admin.");
      setMessageType("error");
      return;
    }

    if (processingId !== null) {
      return;
    }

    setProcessingId(id);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${API_URL}/api/feedback/${id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to update feedback."
        );
        setMessageType("error");
        return;
      }

      // Update only the changed feedback
      setFeedback((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                status:
                  data.status || status,
              }
            : item
        )
      );

      setMessage(
        data.message ||
          "Feedback status updated successfully."
      );

      setMessageType("success");
    } catch (error) {
      console.error(
        "Update feedback error:",
        error
      );

      setMessage(
        "Cannot connect to server."
      );
      setMessageType("error");
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "reviewed":
        return "feedback-status-reviewed";

      case "pending":
        return "feedback-status-pending";

      case "resolved":
        return "feedback-status-resolved";

      default:
        return "feedback-status-default";
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="feedback-admin-page">

        <div className="feedback-admin-header">

          <div>
            <h1>
              💬 Feedback Management
            </h1>

            <p>
              Review feedback submitted by News11 users.
            </p>
          </div>

        </div>

        <div className="feedback-admin-loading">

          <div className="feedback-admin-spinner"></div>

          <p>
            Loading feedback...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="feedback-admin-page">

      {/* HEADER */}

      <div className="feedback-admin-header">

        <div>

          <div className="feedback-admin-title-row">

            <span className="feedback-admin-icon">
              💬
            </span>

            <div>

              <h1>
                Feedback Management
              </h1>

              <p>
                Review feedback submitted by News11 users.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          className="feedback-admin-refresh"
          onClick={getFeedback}
          disabled={processingId !== null}
        >
          🔄 Refresh
        </button>

      </div>


      {/* MESSAGE */}

      {message && (
        <div
          className={`feedback-admin-message ${messageType}`}
        >

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


      {/* STATISTICS */}

      <div className="feedback-admin-stats">

        <div className="feedback-stat-card">

          <div className="feedback-stat-icon">
            💬
          </div>

          <div>

            <span>
              Total Feedback
            </span>

            <strong>
              {feedback.length}
            </strong>

          </div>

        </div>


        <div className="feedback-stat-card">

          <div className="feedback-stat-icon">
            ⏳
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {
                feedback.filter(
                  (item) =>
                    String(
                      item.status || ""
                    ).toLowerCase() ===
                    "pending"
                ).length
              }
            </strong>

          </div>

        </div>


        <div className="feedback-stat-card">

          <div className="feedback-stat-icon">
            ✅
          </div>

          <div>

            <span>
              Reviewed
            </span>

            <strong>
              {
                feedback.filter(
                  (item) =>
                    String(
                      item.status || ""
                    ).toLowerCase() ===
                    "reviewed"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* FEEDBACK LIST */}

      <div className="feedback-admin-section">

        <div className="feedback-admin-section-header">

          <div>

            <h2>
              User Feedback
            </h2>

            <p>
              Read and manage feedback from users.
            </p>

          </div>

          <span className="feedback-count">
            {feedback.length}
          </span>

        </div>


        {/* EMPTY */}

        {feedback.length === 0 ? (
          <div className="feedback-admin-empty">

            <div className="feedback-empty-icon">
              💬
            </div>

            <h3>
              No Feedback Found
            </h3>

            <p>
              There is currently no feedback
              submitted by users.
            </p>

            <button
              type="button"
              onClick={getFeedback}
            >
              🔄 Refresh
            </button>

          </div>
        ) : (

          <div className="feedback-admin-list">

            {feedback.map((item) => {

              const isProcessing =
                processingId === item.id;

              return (
                <article
                  className="feedback-admin-card"
                  key={item.id}
                >

                  {/* USER */}

                  <div className="feedback-user">

                    <div className="feedback-user-avatar">
                      {(item.user_name ||
                        "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {item.user_name ||
                          "Unknown User"}
                      </h3>

                      <p>
                        {item.email ||
                          "No email available"}
                      </p>

                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="feedback-card-top">

                    <span
                      className={`feedback-status-badge ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status ||
                        "pending"}
                    </span>

                  </div>


                  {/* MESSAGE */}

                  <div className="feedback-content">

                    <span className="feedback-label">
                      Feedback
                    </span>

                    <p>
                      {item.message ||
                        "No message available."}
                    </p>

                  </div>


                  {/* DATE */}

                  <div className="feedback-date">

                    🕒{" "}
                    {formatDate(
                      item.created_at
                    )}

                  </div>


                  {/* ACTION */}

                  {String(
                    item.status || ""
                  ).toLowerCase() ===
                    "pending" && (

                    <div className="feedback-actions">

                      <button
                        type="button"
                        className="feedback-review-button"
                        disabled={isProcessing}
                        onClick={() =>
                          updateStatus(
                            item.id,
                            "reviewed"
                          )
                        }
                      >
                        {isProcessing ? (
                          <>
                            <span className="button-spinner"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            ✓ Mark Reviewed
                          </>
                        )}
                      </button>

                    </div>

                  )}

                </article>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default FeedbackAdmin;