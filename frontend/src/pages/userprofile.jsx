import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
//import "./userprofile.css";

function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [isFollowing, setIsFollowing] = useState(false);

  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  // =========================
  // GET CURRENT USER
  // =========================

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(
          "http://10.126.15.27:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error("Current user error:", error);
      }
    };

    getCurrentUser();
  }, []);

  // =========================
  // GET USER
  // =========================

  useEffect(() => {
    const getUser = async () => {
      setMessage("Loading...");

      try {
        const response = await fetch(
          `http://10.126.15.27:5000/api/users/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "User not found."
          );
          return;
        }

        setUser(data.user);
        setMessage("");

      } catch (error) {
        console.error(error);
        setMessage("Cannot connect to server.");
      }
    };

    getUser();
  }, [id]);

  // =========================
  // GET FOLLOW INFORMATION
  // =========================

  useEffect(() => {
    if (!user) return;

    const getFollowInfo = async () => {
      try {
        // FOLLOW COUNTS

        const countResponse = await fetch(
          `http://10.126.15.27:5000/api/follows/${id}/counts`
        );

        const countData = await countResponse.json();

        if (countResponse.ok) {
          setFollowers(countData.followers || 0);
          setFollowing(countData.following || 0);
        }

        // FOLLOW STATUS

        const token = localStorage.getItem("token");

        if (token) {
          const statusResponse = await fetch(
            `http://10.126.15.27:5000/api/follows/status/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const statusData =
            await statusResponse.json();

          if (statusResponse.ok) {
            setIsFollowing(
              Boolean(statusData.following)
            );
          }
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

  // =========================
  // FOLLOW / UNFOLLOW
  // =========================

  const handleFollow = async () => {
    const token = localStorage.getItem("token");

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

    setLoading(true);

    try {
      const response = await fetch(
        `http://10.126.15.27:5000/api/follows/${id}`,
        {
          method: isFollowing
            ? "DELETE"
            : "POST",

          headers: {
            Authorization: `Bearer ${token}`
          }
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

      setIsFollowing(!isFollowing);

      setFollowers((previous) =>
        isFollowing
          ? Math.max(0, previous - 1)
          : previous + 1
      );

    } catch (error) {
      console.error(error);
      alert("Cannot connect to server.");

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING / ERROR
  // =========================

  if (message) {
    return (
      <div className="user-profile-page">

        <div className="profile-message-card">

          <div className="profile-message-icon">
            👤
          </div>

          <h2>
            {message === "Loading..."
              ? "Loading Profile"
              : "Unable to Load Profile"}
          </h2>

          <p>{message}</p>

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

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="profile-message-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const isOwnProfile =
    currentUser &&
    Number(currentUser.id) === Number(user.id);

  return (
    <div className="user-profile-page">

      {/* PROFILE HEADER */}

      <div className="profile-card">

        <div className="profile-cover"></div>

        <div className="profile-main">

          <div className="profile-avatar">
            {initial}
          </div>

          <div className="profile-information">

            <h1>
              {user.name}
            </h1>

            <span className="profile-role">
              {user.role || "User"}
            </span>

          </div>

          {/* FOLLOW BUTTON */}

          {!isOwnProfile && (
            <button
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


        {/* PROFILE DETAILS */}

        <div className="profile-details">

          <div className="profile-detail-item">

            <span className="detail-icon">
              👤
            </span>

            <div>
              <small>Username</small>

              <strong>
                {user.name}
              </strong>
            </div>

          </div>


          <div className="profile-detail-item">

            <span className="detail-icon">
              🏷️
            </span>

            <div>
              <small>Role</small>

              <strong>
                {user.role || "User"}
              </strong>
            </div>

          </div>

        </div>


        {/* FOLLOW STATS */}

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


      {/* INFORMATION */}

      <div className="profile-info-card">

        <div className="profile-info-header">

          <span>ℹ️</span>

          <h2>
            About this user
          </h2>

        </div>

        <p>
          This is the public profile of{" "}
          <strong>{user.name}</strong>.
        </p>

        <p className="profile-note">
          Follow this user to stay connected
          with their activity on the news platform.
        </p>

      </div>


      {/* BACK */}

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