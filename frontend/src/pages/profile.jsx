import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

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
            data.message || "Unable to load profile."
          );
          return;
        }

        setUser(data.user);
        setMessage("");

      } catch (error) {
        console.error("Profile error:", error);
        setMessage("Cannot connect to server.");
      }
    };

    getProfile();
  }, []);


  // GET FOLLOW COUNTS
  useEffect(() => {
    if (!user) return;

    const getFollowCounts = async () => {
      try {
        const response = await fetch(
          `https://news-11-production.up.railway.app/api/follows/${user.id}/counts`
        );

        const data = await response.json();

        if (response.ok) {
          setFollowers(data.followers || 0);
          setFollowing(data.following || 0);
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


  // LOGIN ERROR
  if (message) {
    return (
      <div>
        <h1>My Profile</h1>

        <p>{message}</p>

        <Link to="/login">
          Login
        </Link>
      </div>
    );
  }


  // LOADING
  if (!user) {
    return (
      <div>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }


  return (
    <div>

      <h1>My Profile</h1>

      <hr />

      {/* USER INFORMATION */}

      <h2>
        👤 {user.name}
      </h2>

      <p>
        <strong>Email:</strong>{" "}
        {user.email}
      </p>

      <p>
        <strong>Role:</strong>{" "}
        {user.role}
      </p>

      <hr />

      {/* FOLLOW INFORMATION */}

      <h3>Social Information</h3>

      <div>

        <strong>
          {followers}
        </strong>{" "}
        Followers

        {" | "}

        <strong>
          {following}
        </strong>{" "}
        Following

      </div>

      <br />

      <hr />

      <p>
        <Link to="/news">
          ← Back to News Feed
        </Link>
      </p>

    </div>
  );
}

export default Profile;