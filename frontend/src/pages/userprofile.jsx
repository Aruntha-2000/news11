import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = "https://news-11-production.up.railway.app";

function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [isFollowing, setIsFollowing] = useState(false);

  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.user) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Current user error:", error);
      }
    };

    getCurrentUser();
  }, []);

  // =========================================================
  // GET USER PROFILE
  // =========================================================

  useEffect(() => {
    const getUser = async () => {
      if (!id) {
        setMessage("Invalid user profile.");
        return;
      }

      setMessage("Loading...");
      setUser(null);

      try {
        const response = await fetch(
          `${API_URL}/api/users/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "User not found."
          );
          return;
        }

        if (!data.user) {
          setMessage("User not found.");
          return;
        }

        setUser(data.user);
        setMessage("");
      } catch (error) {
        console.error("Get user error:", error);

        setMessage(
          "Cannot connect to server."
        );
      }
    };

    getUser();
  }, [id]);

  // =========================================================
  // GET FOLLOW INFORMATION
  // =========================================================

  useEffect(() => {
    if (!user || !id) {
      return;
    }

    const getFollowInfo = async () => {
      try {
        // -------------------------
        // FOLLOW COUNTS
        // -------------------------

        const countResponse = await fetch(
          `${API_URL}/api/follows/${id}/counts`
        );

        const countData =
          await countResponse.json();

        if (countResponse.ok) {
          setFollowers(
            Number(countData.followers) || 0
          );

          setFollowing(
            Number(countData.following) || 0
          );
        }

        // -------------------------
        // FOLLOW STATUS
        // -------------------------

        const token =
          localStorage.getItem("token");

        if (!token) {
          setIsFollowing(false);
          return;
        }

        const statusResponse = await fetch(
          `${API_URL}/api/follows/status/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statusData =
          await statusResponse.json();

        if (statusResponse.ok) {
          setIsFollowing(
            Boolean(statusData.following)
          );
        }
      } catch (error) {
        console.error(
          "Follow information error:",
          error
        );
      }
    };

    getFollowInfo();
  }, [id, user]);

  // =========================================================
  // FOLLOW / UNFOLLOW
  // =========================================================

  const handleFollow = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (
      currentUser &&
      Number(currentUser.id) === Number(id)
    ) {
      alert("You cannot follow yourself.");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    const wasFollowing = isFollowing;

    try {
      const response = await fetch(
        `${API_URL}/api/follows/${id}`,
        {
          method: wasFollowing
            ? "DELETE"
            : "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update follow."
        );
        return;
      }

      // Update button
      setIsFollowing(!wasFollowing);

      // Update follower count
      setFollowers((previous) =>
        wasFollowing
          ? Math.max(0, previous - 1)
          : previous + 1
      );
    } catch (error) {
      console.error(
        "Follow error:",
        error
      );

      alert(
        "Cannot connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  if (message) {
    return (
      <div className="user-profile-page">
        <div className="profile-message-card">

          <div className="profile-message-icon">
            {message === "Loading..."
              ? "⏳"
              : "👤"}
          </div>

          <h2>
            {message === "Loading..."
              ? "Loading Profile"
              : "Unable to Load Profile"}
          </h2>

          <p>{message}</p>

          {message !== "Loading..." && (
            <Link
              to="/news"
              className="profile-back-button"
            >
              ← Back to News
            </Link>
          )}

        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="profile-message-card">
          <div className="profile-message-icon">
            👤
          </div>

          <h2>
            Profile Not Found
          </h2>

          <p>
            This user profile could not be found.
          </p>

          <Link
            to="/news"
            className="profile-back-button"
          >
            ← Back to News
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // PROFILE DATA
  // =========================================================

  const displayName =
    user.name || "Unknown User";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase() || "U";

  const isOwnProfile =
    currentUser &&
    Number(currentUser.id) ===
      Number(user.id);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="user-profile-page">

      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <div className="profile-card">

        {/* COVER */}
        <div className="profile-cover"></div>

        {/* MAIN PROFILE */}
        <div className="profile-main">

          <div className="profile-avatar">
            {initial}
          </div>

          <div className="profile-information">

            <h1>
              {displayName}
            </h1>

            <span className="profile-role">
              {user.role || "User"}
            </span>

          </div>

          {/* FOLLOW BUTTON */}

          {!isOwnProfile && (
            <button
              type="button"
              className={
                isFollowing
                  ? "profile-follow-button following"
                  : "profile-follow-button"
              }
              onClick={handleFollow}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isFollowing
                ? "✓ Following"
                : "+ Follow"}
            </button>
          )}

        </div>

        {/* =================================================
            PROFILE DETAILS
        ================================================= */}

        <div className="profile-details">

          <div className="profile-detail-item">

            <span className="detail-icon">
              👤
            </span>

            <div>
              <small>
                Username
              </small>

              <strong>
                {displayName}
              </strong>
            </div>

          </div>

          <div className="profile-detail-item">

            <span className="detail-icon">
              🏷️
            </span>

            <div>
              <small>
                Role
              </small>

              <strong>
                {user.role || "User"}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            FOLLOW STATS
        ================================================= */}

        <div className="profile-stats">

          <div className="profile-stat">

            <strong>
              {followers}
            </strong>

            <span>
              Followers
            </span>

          </div>

          <div className="profile-stat-divider"></div>

          <div className="profile-stat">

            <strong>
              {following}
            </strong>

            <span>
              Following
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          ABOUT USER
      ===================================================== */}

      <div className="profile-info-card">

        <div className="profile-info-header">

          <span>ℹ️</span>

          <h2>
            About this user
          </h2>

        </div>

        <p>
          This is the public profile of{" "}
          <strong>
            {displayName}
          </strong>.
        </p>

        <p className="profile-note">
          Follow this user to stay connected
          with their activity on the news
          platform.
        </p>

      </div>

      {/* =====================================================
          BACK TO NEWS
      ===================================================== */}

      <Link
        to="/news"
        className="profile-back-link"
      >
        ← Back to News Feed
      </Link>

    </div>
  );
}

export default UserProfile;