import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./newsfeed.css";

const API_URL =
  "https://news-11-production.up.railway.app";

function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD NEWS
  // ==========================================

  const loadNews = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/news`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load news."
        );
      }

      setPosts(
        Array.isArray(data.posts)
          ? data.posts
          : []
      );

    } catch (error) {
      console.error(
        "Load news error:",
        error
      );

      setError(
        "Cannot load news. Please check your internet connection or server."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadNews(true);
  }, [loadNews]);

  // ==========================================
  // AUTOMATIC REFRESH
  // ==========================================

  useEffect(() => {
    const interval = setInterval(() => {
      loadNews(false);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [loadNews]);

  // ==========================================
  // PAGE HEADER
  // ==========================================

  const renderHeader = () => (
    <div className="news-header">

      <div className="news-header-icon">
        📰
      </div>

      <div>
        <h1>
          Latest News
        </h1>

        <p>
          Discover the latest stories and updates.
        </p>
      </div>

    </div>
  );

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-background news-background">

        {renderHeader()}

        <div className="loading-card">

          <div className="loading-spinner"></div>

          <p>
            Loading news...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR WITH NO POSTS
  // ==========================================

  if (error && posts.length === 0) {
    return (
      <div className="page-background news-background">

        {renderHeader()}

        <div className="error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() => loadNews(true)}
          >
            🔄 Try Again
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="page-background news-background">

      {/* HEADER */}

      {renderHeader()}


      {/* SUMMARY */}

      <div className="news-summary">

        <span>
          🗞️ {posts.length}{" "}
          {posts.length === 1
            ? "story"
            : "stories"}
        </span>

        <span>
          {refreshing
            ? "🔄 Checking for updates..."
            : "✨ Fresh updates"}
        </span>

      </div>


      {/* REFRESH ERROR */}

      {error && posts.length > 0 && (
        <div className="error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to refresh news
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() => loadNews(false)}
            disabled={refreshing}
          >
            {refreshing
              ? "🔄 Refreshing..."
              : "🔄 Refresh"}
          </button>

        </div>
      )}


      {/* EMPTY NEWS */}

      {posts.length === 0 ? (

        <div className="empty-news">

          <div className="empty-icon">
            📰
          </div>

          <h2>
            No news available
          </h2>

          <p>
            There are no approved news articles yet.
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() => loadNews(false)}
            disabled={refreshing}
          >
            {refreshing
              ? "🔄 Checking..."
              : "🔄 Check Again"}
          </button>

        </div>

      ) : (

        /* ======================================
           NEWS GRID
        ====================================== */

        <div className="news-grid">

          {posts.map((post) => {

            const title =
              post.title ||
              "Untitled News";

            const content =
              post.content ||
              "No content available.";

            const author =
              post.author ||
              "Unknown";

            const category =
              post.category ||
              "General";

            const authorInitial =
              author
                .charAt(0)
                .toUpperCase() || "U";

            return (
              <article
                className="news-card"
                key={post.id}
              >

                {/* NEWS IMAGE */}

                <div className="news-image-wrapper">

                  <img
                    className="news-image"
                    src={
                      post.image_url ||
                      post.image ||
                      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={title}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />

                </div>


                {/* CARD TOP */}

                <div className="news-card-top">

                  <span className="category-badge">
                    {category}
                  </span>

                  <span className="news-status">
                    ✓ Approved
                  </span>

                </div>

                {/* TITLE */}

                <h2 className="news-title">
                  <Link to={`/news/${post.id}`}>
                    {title}
                  </Link>
                </h2>

                {/* CONTENT */}

                <p className="news-content">

                  {content.length > 180
                    ? `${content.substring(
                        0,
                        180
                      )}...`
                    : content}

                </p>


                {/* AUTHOR */}

                <div className="news-author">

                  <div className="author-avatar">
                    {authorInitial}
                  </div>

                  <div className="author-info">

                    <span className="author-label">
                      Published by
                    </span>

                    <strong>

                      {post.user_id ? (
                        <Link
                          to={`/user/${post.user_id}`}
                        >
                          {author}
                        </Link>
                      ) : (
                        author
                      )}

                    </strong>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="news-card-footer">

                  <span className="news-date">

                    🕒{" "}

                    {post.created_at
                      ? new Date(
                          post.created_at
                        ).toLocaleString()
                      : "Latest update"}

                  </span>


                  <Link
                    to={`/news/${post.id}`}
                    className="read-more"
                  >
                    Read More →
                  </Link>

                </div>

              </article>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default NewsFeed;