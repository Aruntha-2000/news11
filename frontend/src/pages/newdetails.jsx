import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./newdetails.css";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  "https://news-11-production.up.railway.app";

// =====================================================
// ROTATING NEWS IMAGES
// =====================================================

const newsImages = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",

  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"
];

function NewsDetails() {
  const { id } = useParams();

  // =====================================================
  // NEWS
  // =====================================================

  const [post, setPost] = useState(null);

  const [message, setMessage] = useState(
    "Loading news..."
  );

  // =====================================================
  // ROTATING IMAGE
  // =====================================================

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  // =====================================================
  // USER
  // =====================================================

  const [currentUser, setCurrentUser] =
    useState(null);

  // =====================================================
  // LIKES
  // =====================================================

  const [likeCount, setLikeCount] = useState(0);

  const [liked, setLiked] = useState(false);

  // =====================================================
  // COMMENTS
  // =====================================================

  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [commentMessage, setCommentMessage] =
    useState("");

  // =====================================================
  // REPLIES
  // =====================================================

  const [replies, setReplies] = useState({});

  const [replyText, setReplyText] = useState({});

  const [replyMessage, setReplyMessage] = useState({});

  // =====================================================
  // REPORT
  // =====================================================

  const [reportReason, setReportReason] =
    useState("");

  const [showReportForm, setShowReportForm] =
    useState(false);

  const [reportMessage, setReportMessage] =
    useState("");

  // =====================================================
  // ROTATE IMAGE EVERY 30 SECONDS
  // =====================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((previous) => {
        return (
          (previous + 1) % newsImages.length
        );
      });
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // =====================================================
  // GET NEWS
  // =====================================================

  useEffect(() => {
    const getNews = async () => {
      try {
        setMessage("Loading news...");

        const response = await fetch(
          `${API_BASE_URL}/api/news/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "News not found."
          );
          return;
        }

        setPost(data.post);
        setMessage("");
      } catch (error) {
        console.error(
          "Get news error:",
          error
        );

        setMessage(
          "Cannot connect to server."
        );
      }
    };

    getNews();
  }, [id]);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  useEffect(() => {
    const getCurrentUser = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/users/profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error(
          "Get current user error:",
          error
        );
      }
    };

    getCurrentUser();
  }, []);

  // =====================================================
  // GET LIKES
  // =====================================================

  useEffect(() => {
    const getLikes = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/likes/${id}`
        );

        const data =
          await response.json();

        if (response.ok) {
          setLikeCount(
            data.likeCount || 0
          );

          setLiked(
            Boolean(data.liked)
          );
        }
      } catch (error) {
        console.error(
          "Get likes error:",
          error
        );
      }
    };

    getLikes();
  }, [id]);

  // =====================================================
  // GET COMMENTS
  // =====================================================

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/${id}`
        );

        const data =
          await response.json();

        if (response.ok) {
          setComments(
            data.comments || []
          );
        }
      } catch (error) {
        console.error(
          "Get comments error:",
          error
        );
      }
    };

    getComments();
  }, [id]);

  // =====================================================
  // GET REPLIES
  // =====================================================

  const getReplies = async (commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/replies/comment/${commentId}`
      );

      const data =
        await response.json();

      if (response.ok) {
        setReplies((previous) => ({
          ...previous,
          [commentId]:
            data.replies || []
        }));
      }
    } catch (error) {
      console.error(
        "Get replies error:",
        error
      );
    }
  };

  // =====================================================
  // LIKE / UNLIKE
  // =====================================================

  const handleLike = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Please login to like this news."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/likes/${id}`,
        {
          method:
            liked
              ? "DELETE"
              : "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Unable to update like."
        );
        return;
      }

      setLikeCount(
        data.likeCount || 0
      );

      setLiked(!liked);
    } catch (error) {
      console.error(
        "Like error:",
        error
      );

      alert(
        "Cannot connect to server."
      );
    }
  };

  // =====================================================
  // REPORT NEWS
  // =====================================================

  const handleReport = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setReportMessage(
        "Please login to report this news."
      );
      return;
    }

    if (!reportReason.trim()) {
      setReportMessage(
        "Please enter a reason."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reports/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            reason:
              reportReason.trim()
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setReportMessage(
          data.message ||
          "Unable to submit report."
        );
        return;
      }

      setReportMessage(
        "Report submitted successfully."
      );

      setReportReason("");

      setShowReportForm(false);
    } catch (error) {
      console.error(
        "Report error:",
        error
      );

      setReportMessage(
        "Cannot connect to server."
      );
    }
  };

  // =====================================================
  // ADD COMMENT
  // =====================================================

  const handleComment = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("token");

    if (!token) {
      setCommentMessage(
        "Please login to comment."
      );
      return;
    }

    if (!commentText.trim()) {
      setCommentMessage(
        "Comment cannot be empty."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/comments/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            comment:
              commentText.trim()
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setCommentMessage(
          data.message ||
          "Unable to add comment."
        );
        return;
      }

      setComments((previous) => [
        ...previous,
        data.comment
      ]);

      setCommentText("");

      setCommentMessage("");
    } catch (error) {
      console.error(
        "Comment error:",
        error
      );

      setCommentMessage(
        "Cannot connect to server."
      );
    }
  };

  // =====================================================
  // ADD REPLY
  // =====================================================

  const handleReply = async (commentId) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setReplyMessage((previous) => ({
        ...previous,
        [commentId]:
          "Please login to reply."
      }));

      return;
    }

    const text =
      replyText[commentId];

    if (!text || !text.trim()) {
      setReplyMessage((previous) => ({
        ...previous,
        [commentId]:
          "Reply cannot be empty."
      }));

      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/replies/comment/${commentId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            reply:
              text.trim()
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setReplyMessage((previous) => ({
          ...previous,
          [commentId]:
            data.message ||
            "Unable to add reply."
        }));

        return;
      }

      setReplies((previous) => ({
        ...previous,

        [commentId]: [
          ...(previous[commentId] || []),
          data.reply
        ]
      }));

      setReplyText((previous) => ({
        ...previous,
        [commentId]: ""
      }));

      setReplyMessage((previous) => ({
        ...previous,
        [commentId]: ""
      }));
    } catch (error) {
      console.error(
        "Reply error:",
        error
      );

      setReplyMessage((previous) => ({
        ...previous,

        [commentId]:
          "Cannot connect to server."
      }));
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (message) {
    return (
      <div className="page-background news-background">
        <div className="details-page">
          <div className="details-loading">
            <div className="details-spinner"></div>

            <p>{message}</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO POST
  // =====================================================

  if (!post) {
    return (
      <div className="page-background news-background">
        <div className="details-page">
          <div className="details-loading">
            <div className="details-spinner"></div>

            <p>News not found.</p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="page-background news-background">

      <div className="details-page">

        {/* BACK */}

        <Link
          to="/news"
          className="back-news"
        >
          ← Back to News Feed
        </Link>

        {/* ARTICLE */}

        <article className="article-card">

          {/* CATEGORY */}

          <div className="article-category">
            {post.category || "General"}
          </div>

          {/* TITLE */}

          <h1 className="article-title">
            {post.title}
          </h1>

          {/* AUTHOR */}

          <div className="article-meta">

            <div className="article-avatar">
              {post.author
                ? post.author
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>

              <strong>
                {post.author ||
                  "Unknown"}
              </strong>

              <p>
                Published{" "}
                {post.created_at
                  ? new Date(
                      post.created_at
                    ).toLocaleString()
                  : "Recently"}
              </p>

            </div>

          </div>

          {/* ROTATING IMAGE */}

          <div className="rotating-news-image">

            <img
              src={
                post.image_url ||
                post.image ||
                newsImages[
                  currentImageIndex
                ]
              }
              alt={post.title}
              onError={(e) => {
                e.currentTarget.src =
                  newsImages[
                    currentImageIndex
                  ];
              }}
            />

          </div>

          {/* CONTENT */}

          <div className="article-content">
            {post.content}
          </div>

          {/* ACTION BAR */}

          <div className="article-actions">

            {/* LIKE */}

            <button
              className={
                liked
                  ? "like-button liked"
                  : "like-button"
              }
              onClick={handleLike}
            >
              {liked
                ? "❤️ Liked"
                : "🤍 Like"}

              <span>
                {likeCount}
              </span>
            </button>

            {/* COMMENTS */}

            <div className="comment-count">
              💬 {comments.length} Comments
            </div>

            {/* REPORT */}

            <button
              className="report-button"
              onClick={() => {
                setShowReportForm(
                  !showReportForm
                );

                setReportMessage("");
              }}
            >
              🚩 Report
            </button>

          </div>

          {/* REPORT FORM */}

          {showReportForm && (
            <div className="report-box">

              <h3>
                🚩 Report this news
              </h3>

              <p>
                Tell us why you think
                this article should be
                reviewed.
              </p>

              <textarea
                placeholder="Enter your reason..."
                value={reportReason}
                onChange={(e) =>
                  setReportReason(
                    e.target.value
                  )
                }
                rows="4"
              />

              <div className="report-actions">

                <button
                  className="submit-report"
                  onClick={handleReport}
                >
                  Submit Report
                </button>

                <button
                  className="cancel-report"
                  onClick={() => {
                    setShowReportForm(false);
                    setReportMessage("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          {/* REPORT MESSAGE */}

          {reportMessage && (
            <div className="report-message">
              {reportMessage}
            </div>
          )}

        </article>

        {/* COMMENTS */}

        <section className="comments-section">

          {/* COMMENT HEADER */}

          <div className="comments-heading">

            <h2>
              💬 Comments
            </h2>

            <span>
              {comments.length}
            </span>

          </div>

          {/* COMMENT FORM */}

          <div className="comment-form-card">

            <h3>
              Join the conversation
            </h3>

            <form
              onSubmit={handleComment}
            >

              <textarea
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(
                    e.target.value
                  )
                }
                rows="4"
              />

              <div className="comment-form-bottom">

                <span>
                  {currentUser
                    ? `Commenting as ${currentUser.name}`
                    : "Login required to comment"}
                </span>

                <button type="submit">
                  💬 Post Comment
                </button>

              </div>

            </form>

            {commentMessage && (
              <p className="form-message">
                {commentMessage}
              </p>
            )}

          </div>

          {/* COMMENTS LIST */}

          {comments.length === 0 ? (

            <div className="no-comments">

              <div>
                💬
              </div>

              <h3>
                No comments yet
              </h3>

              <p>
                Be the first to share
                your thoughts.
              </p>

            </div>

          ) : (

            <div className="comments-list">

              {comments.map((comment) => (

                <div
                  className="comment-card"
                  key={comment.id}
                >

                  {/* COMMENT HEADER */}

                  <div className="comment-header">

                    <div className="comment-avatar">

                      {comment.author
                        ? comment.author
                            .charAt(0)
                            .toUpperCase()
                        : "U"}

                    </div>

                    <div>

                      <strong>
                        {comment.author ||
                          "User"}
                      </strong>

                      <small>
                        {comment.created_at
                          ? new Date(
                              comment.created_at
                            ).toLocaleString()
                          : "Recently"}
                      </small>

                    </div>

                  </div>

                  {/* COMMENT TEXT */}

                  <p className="comment-text">
                    {comment.comment}
                  </p>

                  {/* REPLIES BUTTON */}

                  <button
                    className="reply-toggle"
                    onClick={() =>
                      getReplies(
                        comment.id
                      )
                    }
                  >
                    ↩️ View Replies
                  </button>

                  {/* REPLIES */}

                  {replies[comment.id] &&
                    replies[comment.id].map(
                      (reply) => (

                        <div
                          className="reply-card"
                          key={reply.id}
                        >

                          <div className="reply-header">

                            <div className="reply-avatar">

                              {reply.author
                                ? reply.author
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                            </div>

                            <div>

                              <strong>

                                {reply.author ||
                                  "User"}

                                {Number(
                                  reply.user_id
                                ) ===
                                  Number(
                                    post.user_id
                                  ) && (

                                    <span className="publisher-badge">
                                      Publisher
                                    </span>

                                  )}

                              </strong>

                              <small>

                                {reply.created_at
                                  ? new Date(
                                      reply.created_at
                                    ).toLocaleString()
                                  : "Recently"}

                              </small>

                            </div>

                          </div>

                          <p>
                            {reply.reply}
                          </p>

                        </div>

                      )
                    )}

                  {/* PUBLISHER REPLY FORM */}

                  {currentUser &&
                    Number(
                      currentUser.id
                    ) ===
                      Number(
                        post.user_id
                      ) && (

                      <div className="reply-form">

                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={
                            replyText[
                              comment.id
                            ] || ""
                          }
                          onChange={(e) =>
                            setReplyText(
                              (previous) => ({
                                ...previous,

                                [comment.id]:
                                  e.target.value
                              })
                            )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleReply(
                              comment.id
                            )
                          }
                        >
                          Reply
                        </button>

                        {replyMessage[
                          comment.id
                        ] && (

                          <p>
                            {
                              replyMessage[
                                comment.id
                              ]
                            }
                          </p>

                        )}

                      </div>

                    )}

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default NewsDetails;