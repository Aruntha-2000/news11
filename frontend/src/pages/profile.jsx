import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  // =====================================================
  // GET PROFILE
  // =====================================================

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      try {
        const response = await fetch(
          "https://news-11-production.up.railway.app/api/users/profile",
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
              "Unable to load profile."
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
          "Cannot connect to server."
        );
      }
    };

    getProfile();
  }, []);

  // =====================================================
  // GET FOLLOW COUNTS
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const getFollowCounts = async () => {
      try {
        const response = await fetch(
          `https://news-11-production.up.railway.app/api/follows/${user.id}/counts`
        );

        const data = await response.json();

        if (response.ok) {
          setFollowers(
            data.followers || 0
          );

          setFollowing(
            data.following || 0
          );
        }

      } catch (error) {
        console.error(
          "Follow count error:",
          error
        );
      }
    };

    getFollowCounts();

  }, [user]);

  // =====================================================
  // LOGIN ERROR
  // =====================================================

  if (message) {
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

            <div className="profile-message error">
              ⚠️ {message}
            </div>

            <Link
              to="/login"
              className="profile-button"
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

  if (!user) {
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

            <div className="profile-loading">

              <span className="profile-spinner"></span>

              Loading profile...

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // PROFILE
  // =====================================================

  return (
    <div className="page-background profile-background">

      <div className="profile-page">

        <div className="profile-card">

          {/* PROFILE HEADER */}

          <div className="profile-header">

            <div className="profile-avatar">

              {user.name
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


          {/* USER INFORMATION */}

          <div className="profile-information">

            <div className="profile-info-item">

              <span className="profile-info-icon">
                👤
              </span>

              <div>
                <small>
                  Name
                </small>

                <strong>
                  {user.name}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <span className="profile-info-icon">
                📧
              </span>

              <div>
                <small>
                  Email
                </small>

                <strong>
                  {user.email}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <span className="profile-info-icon">
                🛡️
              </span>

              <div>
                <small>
                  Account Role
                </small>

                <strong className="role-badge">
                  {user.role}
                </strong>
              </div>

            </div>

          </div>


          {/* SOCIAL INFORMATION */}

          <div className="social-section">

            <h2>
              Social Information
            </h2>

            <div className="social-stats">

              <div className="social-stat">

                <strong>
                  {followers}
                </strong>

                <span>
                  Followers
                </span>

              </div>


              <div className="social-divider"></div>


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


          {/* BACK TO NEWS */}

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