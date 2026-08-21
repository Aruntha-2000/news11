import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./newsfeed.css";

const API_URL ="https://news-11-production.up.railway.app";

function NewsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadNews = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/api/news`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load news");
      }

      setPosts(data.posts || []);
    } catch (error) {
      console.error("Load news error:", error);

      setError(
        "Cannot load news. Please check your internet connection or server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial news loading
  useEffect(() => {
    loadNews(true);
  }, [loadNews]);

  // Automatically check for newly approved news
  useEffect(() => {
    const interval = setInterval(() => {
      loadNews(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNews]);

  // Loading screen
  if (loading) {
    return (
      <div className="news-page">
        <div className="news-header">
          <div className="news-header-icon">📰</div>

          <div>
            <h1>Latest News</h1>
            <p>Discover the latest stories and updates.</p>
          </div>
        </div>

        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error && posts.length === 0) {
    return (
      <div className="news-page">
        <div className="news-header">
          <div className="news-header-icon">📰</div>

          <div>
            <h1>Latest News</h1>
            <p>Discover the latest stories and updates.</p>
          </div>
        </div>

        <div className="error-card">
          <div className="error-icon">⚠️</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => loadNews(true)}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background news-background">

      {/* HEADER */}

      <div className="news-header">

        <div className="news-header-icon">
          📰
        </div>

        <div>
          <h1>Latest News</h1>

          <p>
            Discover the latest stories and updates.
          </p>
        </div>

      </div>


      {/* SUMMARY */}

      <div className="news-summary">

        <span>
          🗞️ {posts.length}{" "}
          {posts.length === 1 ? "story" : "stories"}
        </span>

        <span>
          {refreshing
            ? "🔄 Checking for updates..."
            : "✨ Fresh updates"}
        </span>

      </div>


      {/* ERROR WHILE REFRESHING */}

      {error && posts.length > 0 && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>

          <h2>Unable to refresh news</h2>

          <p>{error}</p>

          <button
            className="retry-button"
            onClick={() => loadNews(false)}
          >
            🔄 Refresh
          </button>
        </div>
      )}


      {/* EMPTY */}

      {posts.length === 0 ? (

        <div className="empty-news">

          <div className="empty-icon">
            📰
          </div>

          <h2>No news available</h2>

          <p>
            There are no approved news articles yet.
          </p>

          <button
            className="retry-button"
            onClick={() => loadNews(false)}
          >
            🔄 Check Again
          </button>

        </div>

      ) : (

        <div className="news-grid">

          {posts.map((post) => (

            <article
              className="news-card"
              key={post.id}
            >

              {/* CARD TOP */}

              <div className="news-card-top">

                <span className="category-badge">
                  {post.category || "General"}
                </span>

                <span className="news-status">
                  ✓ Approved
                </span>

              </div>


              {/* TITLE */}

              <h2 className="news-title">

                <Link to={`/news/${post.id}`}>
                  {post.title}
                </Link>

              </h2>


              {/* CONTENT */}

              <p className="news-content">

                {post.content?.length > 180
                  ? `${post.content.substring(0, 180)}...`
                  : post.content}

              </p>


              {/* AUTHOR */}

              <div className="news-author">

                <div className="author-avatar">

                  {post.author
                    ? post.author
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

                <div className="author-info">

                  <span className="author-label">
                    Published by
                  </span>

                  <strong>
                    <Link to={`/user/${post.user_id}`}>
                      {post.author || "Unknown"}
                    </Link>
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

          ))}

        </div>

      )}

    </div>
  );
}

export default NewsFeed;
