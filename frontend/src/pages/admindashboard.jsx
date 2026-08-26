import { useCallback, useEffect, useState } from "react";

function AdminDashboard() {
  const API_URL =
    "https://news-11-production.up.railway.app";

  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // =====================================================
  // GET PENDING NEWS
  // =====================================================

  const getPendingPosts = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login as admin.");
      setMessageType("error");
      setLoading(false);
      setPosts([]);
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

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

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load pending news."
        );
      }

      setPosts(
        Array.isArray(data.posts)
          ? data.posts
          : []
      );

    } catch (error) {
      console.error(
        "Get pending posts error:",
        error
      );

      setMessage(
        error.message ||
          "Cannot connect to server."
      );

      setMessageType("error");

      setPosts([]);

    } finally {
      setLoading(false);
    }
  }, []);


  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    getPendingPosts();
  }, [getPendingPosts]);


  // =====================================================
  // APPROVE / REJECT NEWS
  // =====================================================

  const updatePost = async (id, action) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage(
        "Please login as admin."
      );

      setMessageType("error");

      return;
    }

    if (processingId !== null) {
      return;
    }

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return;
    }

    setProcessingId(id);

    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/posts/${id}/${action}`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
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
        throw new Error(
          data.message ||
            `Unable to ${action} news.`
        );
      }

      const successMessage =
        data.message ||
        (
          action === "approve"
            ? "News approved successfully."
            : "News rejected successfully."
        );

      setMessage(successMessage);
      setMessageType("success");

      // Remove processed post
      setPosts(
        (currentPosts) =>
          currentPosts.filter(
            (post) =>
              post.id !== id
          )
      );

    } catch (error) {
      console.error(
        "Update post error:",
        error
      );

      setMessage(
        error.message ||
          "Cannot connect to server."
      );

      setMessageType("error");

    } finally {
      setProcessingId(null);
    }
  };


  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    const cleanImage =
      String(image).trim();

    if (!cleanImage) {
      return null;
    }

    if (
      cleanImage.startsWith(
        "http://"
      ) ||
      cleanImage.startsWith(
        "https://"
      )
    ) {
      return cleanImage;
    }

    return `${API_URL}/${cleanImage.replace(
      /^\/+/,
      ""
    )}`;
  };


  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.style.display =
      "none";
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="page-background admin-background">

      <div className="admin-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-header">

          <div className="admin-title-row">

            <span className="admin-icon">
              🛡️
            </span>

            <div>

              <h1>
                Admin Dashboard
              </h1>

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


        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div
            className={`admin-message ${
              messageType
            }`}
          >
            {message}
          </div>
        )}


        {/* =================================================
            STAT
        ================================================= */}

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


        {/* =================================================
            PENDING HEADER
        ================================================= */}

        <div className="pending-header">

          <div>

            <h2>
              Pending News
            </h2>

            <p>
              Review submitted articles
              before publishing.
            </p>

          </div>

          <span className="pending-count">
            {posts.length}
          </span>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="admin-loading">

            <div className="admin-spinner"></div>

            <p>
              Loading pending news...
            </p>

          </div>
        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          posts.length === 0 && (
            <div className="empty-admin">

              <div className="empty-admin-icon">
                ✅
              </div>

              <h3>
                No Pending News
              </h3>

              <p>
                There are currently no news
                articles waiting for approval.
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


        {/* =================================================
            NEWS LIST
        ================================================= */}

        {!loading &&
          posts.length > 0 && (

            <div className="admin-news-list">

              {posts.map((post) => {

                const imageUrl =
                  getImageUrl(
                    post.image_url ||
                    post.image
                  );

                const isProcessing =
                  processingId === post.id;

                const author =
                  post.author ||
                  "Unknown Author";

                const title =
                  post.title ||
                  "Untitled News";

                const category =
                  post.category ||
                  "News";

                const status =
                  post.status ||
                  "pending";

                return (
                  <article
                    className="admin-news-card"
                    key={post.id}
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    {imageUrl && (
                      <div className="admin-news-image">

                        <img
                          src={imageUrl}
                          alt={title}
                          loading="lazy"
                          onError={
                            handleImageError
                          }
                        />

                      </div>
                    )}


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="admin-news-content">

                      {/* CATEGORY + STATUS */}

                      <div className="admin-news-top">

                        <span className="category-badge">
                          {category}
                        </span>

                        <span className="status-badge">
                          {status}
                        </span>

                      </div>


                      {/* TITLE */}

                      <h3 className="admin-news-title">
                        {title}
                      </h3>


                      {/* AUTHOR */}

                      <div className="author-info">

                        <div className="author-avatar">

                          {author
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <span>
                            Submitted by
                          </span>

                          <strong>
                            {author}
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
                          disabled={
                            isProcessing
                          }
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
                          disabled={
                            isProcessing
                          }
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

    </div>
  );
}

export default AdminDashboard;