import { useEffect, useState } from "react";

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const API_URL = "https://news-11-production.up.railway.app";

  // ==========================================
  // GET PENDING NEWS
  // ==========================================

  const getPendingPosts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as admin.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/pending-posts`,
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
          data.message || "Unable to load pending news."
        );
        setPosts([]);
        return;
      }

      setPosts(data.posts || []);
    } catch (error) {
      console.error("Get pending posts error:", error);
      setMessage("Cannot connect to server.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PENDING NEWS
  // ==========================================

  useEffect(() => {
    getPendingPosts();
  }, []);

  // ==========================================
  // APPROVE / REJECT NEWS
  // ==========================================

  const updatePost = async (id, action) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as admin.");
      return;
    }

    if (processingId !== null) {
      return;
    }

    setProcessingId(id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/posts/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to update news."
        );
        return;
      }

      setMessage(
        data.message ||
          `News ${action}d successfully.`
      );

      // Remove processed news from the list
      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== id
        )
      );
    } catch (error) {
      console.error("Update post error:", error);
      setMessage("Cannot connect to server.");
    } finally {
      setProcessingId(null);
    }
  };

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_URL}/${image.replace(/^\/+/, "")}`;
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div className="admin-title-row">

          <span className="admin-icon">
            🛡️
          </span>

          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Review and manage submitted news
            </p>
          </div>

        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={getPendingPosts}
          disabled={loading}
        >
          🔄 <span>Refresh</span>
        </button>

      </div>


      {/* MESSAGE */}

      {message && (
        <div
          className={`admin-message ${
            message.toLowerCase().includes("cannot") ||
            message.toLowerCase().includes("error") ||
            message.toLowerCase().includes("please") ||
            message.toLowerCase().includes("unable")
              ? "error"
              : "success"
          }`}
        >
          {message}
        </div>
      )}


      {/* STAT */}

      <div className="admin-stats">

        <div className="stat-card">

          <div className="stat-icon">
            📰
          </div>

          <div>

            <span className="stat-label">
              Pending News
            </span>

            <strong className="stat-number">
              {posts.length}
            </strong>

          </div>

        </div>

      </div>


      {/* PENDING HEADER */}

      <div className="pending-header">

        <div>

          <h2>
            Pending News
          </h2>

          <p>
            Review submitted articles before publishing.
          </p>

        </div>

        <span className="pending-count">
          {posts.length}
        </span>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="admin-loading">

          <div className="admin-spinner"></div>

          <p>
            Loading pending news...
          </p>

        </div>
      )}


      {/* EMPTY */}

      {!loading && posts.length === 0 && (
        <div className="empty-admin">

          <div className="empty-admin-icon">
            ✅
          </div>

          <h3>
            No Pending News
          </h3>

          <p>
            There are currently no news articles
            waiting for approval.
          </p>

          <button
            type="button"
            className="empty-refresh-button"
            onClick={getPendingPosts}
          >
            🔄 Refresh
          </button>

        </div>
      )}


      {/* NEWS LIST */}

      {!loading && posts.length > 0 && (

        <div className="admin-news-list">

          {posts.map((post) => {

            const imageUrl = getImageUrl(
              post.image
            );

            const isProcessing =
              processingId === post.id;

            return (
              <article
                className="admin-news-card"
                key={post.id}
              >

                {/* IMAGE */}

                {imageUrl && (
                  <div className="admin-news-image">

                    <img
                      src={imageUrl}
                      alt={
                        post.title ||
                        "News image"
                      }
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>
                )}


                {/* CONTENT */}

                <div className="admin-news-content">

                  {/* CATEGORY + STATUS */}

                  <div className="admin-news-top">

                    <span className="category-badge">
                      {post.category || "News"}
                    </span>

                    <span className="status-badge">
                      {post.status || "pending"}
                    </span>

                  </div>


                  {/* TITLE */}

                  <h3 className="admin-news-title">
                    {post.title ||
                      "Untitled News"}
                  </h3>


                  {/* AUTHOR */}

                  <div className="author-info">

                    <div className="author-avatar">
                      {(post.author || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <span>
                        Submitted by
                      </span>

                      <strong>
                        {post.author ||
                          "Unknown Author"}
                      </strong>

                    </div>

                  </div>


                  {/* CONTENT */}

                  <div className="admin-news-description">
                    {post.content ||
                      "No content available."}
                  </div>


                  {/* ACTIONS */}

                  <div className="admin-actions">

                    <button
                      type="button"
                      className="approve-button"
                      disabled={isProcessing}
                      onClick={() =>
                        updatePost(
                          post.id,
                          "approve"
                        )
                      }
                    >
                      {isProcessing
                        ? "Processing..."
                        : "✓ Approve"}
                    </button>


                    <button
                      type="button"
                      className="reject-button"
                      disabled={isProcessing}
                      onClick={() =>
                        updatePost(
                          post.id,
                          "reject"
                        )
                      }
                    >
                      {isProcessing
                        ? "Processing..."
                        : "✕ Reject"}
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;