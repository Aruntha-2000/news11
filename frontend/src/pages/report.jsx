import { useEffect, useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // GET REPORTS
  // =========================

  const getReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://news-11-production.up.railway.app/api/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load reports."
        );
        return;
      }

      setReports(data.reports || []);

    } catch (error) {
      console.error("Get reports error:", error);
      setError("Cannot connect to server.");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getReports();
  }, []);


  // =========================
  // UPDATE REPORT STATUS
  // =========================

  const updateStatus = async (reportId, status) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login.");
      return;
    }

    setUpdatingId(reportId);

    try {
      const response = await fetch(
        `https://news-11-production.up.railway.app/api/reports/${reportId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Unable to update report."
        );
        return;
      }

      setReports((previous) =>
        previous.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status
              }
            : report
        )
      );

    } catch (error) {
      console.error(
        "Update report error:",
        error
      );

      alert("Cannot connect to server.");

    } finally {
      setUpdatingId(null);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div>
        <h1>🚩 Reports</h1>
        <p>Loading reports...</p>
      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div>
        <h1>🚩 Reports</h1>

        <p>{error}</p>

        <button onClick={getReports}>
          🔄 Try Again
        </button>
      </div>
    );
  }


  // =========================
  // PAGE
  // =========================

  return (
    <div>

      <h1>🚩 Reported News</h1>

      <button onClick={getReports}>
        🔄 Refresh
      </button>

      <br />
      <br />

      {reports.length === 0 ? (

        <p>No reports found.</p>

      ) : (

        reports.map((report) => (

          <div
            key={report.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px"
            }}
          >

            <h3>
              📰 {report.post_title}
            </h3>


            <p>
              <strong>Reported by:</strong>{" "}
              {report.user_name}
            </p>


            <p>
              <strong>Reason:</strong>
            </p>

            <p>
              {report.reason}
            </p>


            <p>
              <strong>Status:</strong>{" "}

              {report.status === "pending" && (
                <span>🟡 Pending</span>
              )}

              {report.status === "reviewed" && (
                <span>🟢 Reviewed</span>
              )}

              {report.status === "dismissed" && (
                <span>⚪ Dismissed</span>
              )}
            </p>


            <small>
              {new Date(
                report.created_at
              ).toLocaleString()}
            </small>


            <br />
            <br />


            {report.status === "pending" && (

              <div>

                <button
                  onClick={() =>
                    updateStatus(
                      report.id,
                      "reviewed"
                    )
                  }
                  disabled={
                    updatingId === report.id
                  }
                >
                  {updatingId === report.id
                    ? "Updating..."
                    : "✅ Mark Reviewed"}
                </button>

                {" "}

                <button
                  onClick={() =>
                    updateStatus(
                      report.id,
                      "dismissed"
                    )
                  }
                  disabled={
                    updatingId === report.id
                  }
                >
                  {updatingId === report.id
                    ? "Updating..."
                    : "❌ Dismiss"}
                </button>

              </div>

            )}

          </div>

        ))

      )}

    </div>
  );
}

export default Reports;