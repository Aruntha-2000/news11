import { useCallback, useEffect, useState } from "react";

const API_URL = "https://news-11-production.up.railway.app";


function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================================================
  // GET NOTIFICATIONS
  // =========================================================

  const getNotifications = useCallback(
    async (showLoading = true) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login to view notifications.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setMessage("");
      setMessageType("");

      try {
        const response = await fetch(
          `${API_URL}/api/notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load notifications."
          );
        }

        setNotifications(
          Array.isArray(data.notifications)
            ? data.notifications
            : []
        );
      } catch (error) {
        console.error(
          "Get notifications error:",
          error
        );

        setMessage(
          error.message ||
            "Cannot connect to server."
        );

        setMessageType("error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    getNotifications(true);
  }, [getNotifications]);

  // =========================================================
  // AUTO REFRESH EVERY 30 SECONDS
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [getNotifications]);

  // =========================================================
  // MARK AS READ
  // =========================================================

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to continue.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to mark notification as read."
        );
      }

      // Update only the selected notification
      setNotifications((previous) =>
        previous.map((notification) =>
          Number(notification.id) ===
          Number(notificationId)
            ? {
                ...notification,
                is_read: 1,
              }
            : notification
        )
      );

      setMessage("");
      setMessageType("");
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      setMessage(
        error.message ||
          "Cannot connect to server."
      );

      setMessageType("error");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="page-background notifications-background">
        <div className="page-container">
          <div className="notifications-page">

            <div className="notifications-header">
              <div className="notifications-header-icon">
                🔔
              </div>

              <div>
                <h1>Notifications</h1>
                <p>
                  Stay updated with your latest activities.
                </p>
              </div>
            </div>

            <div className="notifications-loading">
              <div className="notifications-spinner"></div>
              <p>Loading notifications...</p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO LOGIN / ERROR
  // =========================================================

  if (message && notifications.length === 0) {
    return (
      <div className="page-background notifications-background">
        <div className="page-container">
          <div className="notifications-page">

            <div className="notifications-header">
              <div className="notifications-header-icon">
                🔔
              </div>

              <div>
                <h1>Notifications</h1>
                <p>
                  Stay updated with your latest activities.
                </p>
              </div>
            </div>

            <div className="notifications-error">
              <div className="notifications-error-icon">
                ⚠️
              </div>

              <h2>Something went wrong</h2>

              <p>{message}</p>

              <button
                className="notifications-retry-button"
                onClick={() => getNotifications(true)}
              >
                🔄 Try Again
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="page-background notifications-background">
      <div className="page-container">

        <div className="notifications-page">

          {/* HEADER */}

          <div className="notifications-header">

            <div className="notifications-header-icon">
              🔔
            </div>

            <div className="notifications-header-content">

              <h1>Notifications</h1>

              <p>
                Stay updated with your latest activities.
              </p>

            </div>

            <button
              className="notifications-refresh-button"
              onClick={() =>
                getNotifications(false)
              }
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "🔄 Refresh"}
            </button>

          </div>


          {/* MESSAGE */}

          {message && (
            <div
              className={`notifications-message ${messageType}`}
            >
              {message}
            </div>
          )}


          {/* SUMMARY */}

          <div className="notifications-summary">

            <span>
              🔔 {notifications.length}{" "}
              {notifications.length === 1
                ? "notification"
                : "notifications"}
            </span>

            <span>
              {notifications.filter(
                (notification) =>
                  Number(notification.is_read) !== 1
              ).length}{" "}
              unread
            </span>

          </div>


          {/* EMPTY */}

          {notifications.length === 0 ? (

            <div className="notifications-empty">

              <div className="notifications-empty-icon">
                🔔
              </div>

              <h2>No notifications</h2>

              <p>
                You don't have any notifications yet.
              </p>

            </div>

          ) : (

            <div className="notifications-list">

              {notifications.map(
                (notification) => {

                  const isRead =
                    Number(
                      notification.is_read
                    ) === 1;

                  return (
                    <div
                      key={notification.id}
                      className={`notification-card ${
                        isRead
                          ? "notification-read"
                          : "notification-unread"
                      }`}
                    >

                      {/* NOTIFICATION TOP */}

                      <div className="notification-top">

                        <span className="notification-icon">
                          {isRead ? "🔔" : "🔵"}
                        </span>

                        {!isRead && (
                          <span className="notification-new">
                            NEW
                          </span>
                        )}

                      </div>


                      {/* MESSAGE */}

                      <div className="notification-content">

                        <p className="notification-message">
                          {notification.message}
                        </p>

                        <small className="notification-date">
                          🕒{" "}
                          {notification.created_at
                            ? new Date(
                                notification.created_at
                              ).toLocaleString()
                            : "Recently"}
                        </small>

                      </div>


                      {/* ACTION */}

                      {!isRead && (
                        <button
                          className="notification-read-button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                        >
                          ✅ Mark as read
                        </button>
                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Notifications;