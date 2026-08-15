import { useCallback, useEffect, useState } from "react";

const API_URL = "http://10.126.15.27:5000/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const getNotifications = useCallback(
    async (showLoading = true) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login to view notifications.");
        setLoading(false);
        return;
      }

      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setMessage("");

      try {
        const response = await fetch(
          `${API_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Unable to load notifications."
          );
          return;
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
          "Cannot connect to server."
        );

      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // Initial loading
  useEffect(() => {
    getNotifications(true);
  }, [getNotifications]);


  // Automatically check for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [getNotifications]);


  // Mark notification as read
  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login to continue."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to mark notification as read."
        );
        return;
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          Number(notification.id) ===
          Number(notificationId)
            ? {
                ...notification,
                is_read: 1
              }
            : notification
        )
      );

    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );

      setMessage(
        "Cannot connect to server."
      );
    }
  };


  // Loading
  if (loading) {
    return (
      <div className="notifications-page">

        <h1>🔔 Notifications</h1>

        <p>
          Loading notifications...
        </p>

      </div>
    );
  }


  // Login / error message
  if (message && notifications.length === 0) {
    return (
      <div className="notifications-page">

        <h1>🔔 Notifications</h1>

        <p>{message}</p>

        <button
          onClick={() =>
            getNotifications(true)
          }
        >
          🔄 Try Again
        </button>

      </div>
    );
  }


  return (
    <div className="notifications-page">

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >

        <h1>
          🔔 Notifications
        </h1>

        <button
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


      {message && (
        <p>
          {message}
        </p>
      )}


      {notifications.length === 0 ? (

        <div>
          <h2>
            No notifications
          </h2>

          <p>
            You don't have any notifications yet.
          </p>
        </div>

      ) : (

        notifications.map(
          (notification) => {

            const isRead =
              Number(
                notification.is_read
              ) === 1;

            return (
              <div
                key={notification.id}
                style={{
                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  padding:
                    "15px",

                  marginBottom:
                    "12px",

                  backgroundColor:
                    isRead
                      ? "#ffffff"
                      : "#eef6ff",

                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >

                <p>
                  <strong>
                    {notification.message}
                  </strong>
                </p>


                <small>
                  {notification.created_at
                    ? new Date(
                        notification.created_at
                      ).toLocaleString()
                    : ""}
                </small>


                {!isRead && (
                  <div
                    style={{
                      marginTop:
                        "10px"
                    }}
                  >

                    <button
                      onClick={() =>
                        markAsRead(
                          notification.id
                        )
                      }
                    >
                      ✅ Mark as read
                    </button>

                  </div>
                )}

              </div>
            );
          }
        )

      )}

    </div>
  );
}

export default Notifications;