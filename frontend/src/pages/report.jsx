import { useEffect, useState } from "react";

const API_URL = "https://news-11-production.up.railway.app";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // =========================
  // GET REPORTS
  // =========================

  const getReports = async (showLoading = true) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login.");
      setLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/api/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load reports."
        );
      }

      setReports(
        Array.isArray(data.reports)
          ? data.reports
          : []
      );

    } catch (error) {
      console.error("Get reports error:", error);

      setError(
        error.message ||
          "Cannot connect to server."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    getReports(true);
  }, []);


  // =========================
  // UPDATE REPORT STATUS
  // =========================

  const updateStatus = async (
    reportId,
    status
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login.");
      return;
    }

    setUpdatingId(reportId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${reportId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update report."
        );
      }

      setReports((previous) =>
        previous.map((report) =>
          Number(report.id) ===
          Number(reportId)
            ? {
                ...report,
                status,
              }
            : report
        )
      );

    } catch (error) {
      console.error(
        "Update report error:",
        error
      );

      setError(
        error.message ||
          "Cannot connect to server."
      );

    } finally {
      setUpdatingId(null);
    }
  };


  // =========================
  // STATUS
  // =========================

  const getStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="report-status pending">
            🟡 Pending
          </span>
        );

      case "reviewed":
        return (
          <span className="report-status reviewed">
            🟢 Reviewed
          </span>
        );

      case "dismissed":
        return (
          <span className="report-status dismissed">
            ⚪ Dismissed
          </span>
        );

      default:
        return (
          <span className="report-status">
            {status || "Unknown"}
          </span>
        );
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="reports-page">

        <div className="reports-header">

          <div className="reports-header-icon">
            🚩
          </div>

          <div>
            <h1>Reported News</h1>

            <p>
              Review and manage reported
              news articles.
            </p>
          </div>

        </div>


        <div className="reports-loading">

          <div className="reports-spinner"></div>

          <p>
            Loading reports...
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error && reports.length === 0) {
    return (
      <div className="reports-page">

        <div className="reports-header">

          <div className="reports-header-icon">
            🚩
          </div>

          <div>
            <h1>Reported News</h1>

            <p>
              Review and manage reported
              news articles.
            </p>
          </div>

        </div>


        <div className="reports-error">

          <div className="reports-error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button
            className="reports-retry"
            onClick={() =>
              getReports(true)
            }
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }


  // =========================
  // PAGE
  // =========================

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div className="reports-header-icon">
          🚩
        </div>

        <div className="reports-header-content">

          <h1>
            Reported News
          </h1>

          <p>
            Review and manage reported
            news articles.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="reports-summary">

        <span>
          🚩 {reports.length}{" "}
          {reports.length === 1
            ? "report"
            : "reports"}
        </span>

        <button
          className="reports-refresh"
          onClick={() =>
            getReports(false)
          }
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "🔄 Refresh"}
        </button>

      </div>


      {/* ERROR WHILE REFRESHING */}

      {error && reports.length > 0 && (
        <div className="reports-inline-error">
          ⚠️ {error}
        </div>
      )}


      {/* EMPTY */}

      {reports.length === 0 ? (

        <div className="reports-empty">

          <div className="reports-empty-icon">
            📭
          </div>

          <h2>
            No reports found
          </h2>

          <p>
            There are no reported news
            articles at the moment.
          </p>

          <button
            className="reports-retry"
            onClick={() =>
              getReports(false)
            }
          >
            🔄 Check Again
          </button>

        </div>

      ) : (

        <div className="reports-list">

          {reports.map((report) => {

            const isUpdating =
              Number(updatingId) ===
              Number(report.id);

            return (
              <article
                className="report-card"
                key={report.id}
              >

                {/* CARD HEADER */}

                <div className="report-card-header">

                  <span className="report-number">
                    Report #{report.id}
                  </span>

                  {getStatus(
                    report.status
                  )}

                </div>


                {/* NEWS TITLE */}

                <h2 className="report-title">
                  📰{" "}
                  {report.post_title ||
                    "Untitled News"}
                </h2>


                {/* REPORT DETAILS */}

                <div className="report-details">

                  <div className="report-detail">

                    <span className="detail-label">
                      Reported by
                    </span>

                    <strong>
                      {report.user_name ||
                        "Unknown user"}
                    </strong>

                  </div>


                  <div className="report-detail">

                    <span className="detail-label">
                      Date
                    </span>

                    <strong>
                      {report.created_at
                        ? new Date(
                            report.created_at
                          ).toLocaleString()
                        : "Unknown"}
                    </strong>

                  </div>

                </div>


                {/* REASON */}

                <div className="report-reason">

                  <span className="detail-label">
                    Reason
                  </span>

                  <p>
                    {report.reason ||
                      "No reason provided."}
                  </p>

                </div>


                {/* ACTIONS */}

                {report.status ===
                  "pending" && (

                  <div className="report-actions">

                    <button
                      className="report-action reviewed-button"
                      onClick={() =>
                        updateStatus(
                          report.id,
                          "reviewed"
                        )
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating
                        ? "Updating..."
                        : "✅ Mark Reviewed"}
                    </button>


                    <button
                      className="report-action dismissed-button"
                      onClick={() =>
                        updateStatus(
                          report.id,
                          "dismissed"
                        )
                      }
                      disabled={isUpdating}
                    >
                      {isUpdating
                        ? "Updating..."
                        : "❌ Dismiss"}
                    </button>

                  </div>

                )}

              </article>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default Reports;