import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  "https://news-11-production.up.railway.app";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =====================================================
  // GET PROFILE
  // =====================================================

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          // Token may have expired
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setMessage(
              "Your login session has expired. Please login again."
            );

            return;
          }

          setMessage(
            data.message ||
              "Unable to load your profile."
          );

          return;
        }

        if (!data.user) {
          setMessage(
            "Profile information was not found."
          );

          return;
        }

        setUser(data.user);
        setMessage("");

      } catch (error) {
        console.error(
          "Profile error:",
          error
        );

        setMessage(
          "Cannot connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  // =====================================================
  // GET FOLLOW COUNTS
  // =====================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const getFollowCounts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/follows/${user.id}/counts`,
          {
            method: "GET",
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          console.error(
            "Follow counts request failed:",
            data.message
          );

          return;
        }

        setFollowers(
          Number(data.followers) || 0
        );

        setFollowing(
          Number(data.following) || 0
        );

      } catch (error) {
        console.error(
          "Follow count error:",
          error
        );

        // Keep default values if request fails
        setFollowers(0);
        setFollowing(0);
      }
    };

    getFollowCounts();
  }, [user]);

  // =====================================================
  // LOGIN / ERROR PAGE
  // =====================================================

  if (!loading && message) {
    const sessionExpired =
      message.toLowerCase().includes("session");

    return (
      <div className="page-background profile-background">

        <div className="profile-page">

          <div className="profile-card profile-error-card">

            <div className="profile-icon">
              👤
            </div>

            <h1>
              My Profile
            </h1>

            <div
              className="profile-message error"
              role="alert"
            >
              ⚠️
              <span>{message}</span>
            </div>

            <Link
              to="/login"
              className="profile-button"
              onClick={() => {
                if (sessionExpired) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                }
              }}
            >
              🔐 Login
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="page-background profile-background">

        <div className="profile-page">

          <div className="profile-card">

            <div className="profile-icon">
              👤
            </div>

            <h1>
              My Profile
            </h1>

            <p>
              Welcome to News11
            </p>

            <div className="profile-loading">

              <span className="profile-spinner"></span>

              <span>
                Loading profile...
              </span>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // PROFILE PAGE
  // =====================================================

  return (
    <div className="page-background profile-background">

      <div className="profile-page">

        <div className="profile-card">

          {/* ============================================
              PROFILE HEADER
          ============================================ */}

          <div className="profile-header">

            <div
              className="profile-avatar"
              aria-label={`Profile avatar for ${
                user?.name || "User"
              }`}
            >
              {user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <h1>
              My Profile
            </h1>

            <p>
              Welcome back to News11
            </p>

          </div>


          {/* ============================================
              USER INFORMATION
          ============================================ */}

          <div className="profile-information">

            {/* NAME */}

            <div className="profile-info-item">

              <span
                className="profile-info-icon"
                aria-hidden="true"
              >
                👤
              </span>

              <div>

                <small>
                  Name
                </small>

                <strong>
                  {user?.name || "Not available"}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-info-item">

              <span
                className="profile-info-icon"
                aria-hidden="true"
              >
                📧
              </span>

              <div>

                <small>
                  Email
                </small>

                <strong>
                  {user?.email || "Not available"}
                </strong>

              </div>

            </div>


            {/* ROLE */}

            <div className="profile-info-item">

              <span
                className="profile-info-icon"
                aria-hidden="true"
              >
                🛡️
              </span>

              <div>

                <small>
                  Account Role
                </small>

                <strong className="role-badge">
                  {user?.role || "reader"}
                </strong>

              </div>

            </div>

          </div>


          {/* ============================================
              SOCIAL INFORMATION
          ============================================ */}

          <div className="social-section">

            <h2>
              Social Information
            </h2>

            <div className="social-stats">

              {/* FOLLOWERS */}

              <div className="social-stat">

                <strong>
                  {followers}
                </strong>

                <span>
                  Followers
                </span>

              </div>


              <div
                className="social-divider"
                aria-hidden="true"
              ></div>


              {/* FOLLOWING */}

              <div className="social-stat">

                <strong>
                  {following}
                </strong>

                <span>
                  Following
                </span>

              </div>

            </div>

          </div>


          {/* ============================================
              ACTIONS
          ============================================ */}

          <div className="profile-footer">

            <Link
              to="/news"
              className="profile-news-button"
            >
              ← Back to News Feed
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;