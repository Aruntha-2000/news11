import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://news-11-production.up.railway.app";

function CreatePost() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content: "",
    image_url: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // CHECK LOGIN + LOAD CATEGORIES
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to create news.");
      setMessageType("error");
      setCheckingLogin(false);
      return;
    }

    const getCategories = async () => {
      setLoadingCategories(true);

      try {
        const response = await fetch(
          `${API_URL}/api/categories`
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          setMessage(
            data.message || "Unable to load categories."
          );

          setMessageType("error");
          return;
        }

        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );
      } catch (error) {
        console.error(
          "Get categories error:",
          error
        );

        setMessage("Cannot connect to server.");
        setMessageType("error");
      } finally {
        setLoadingCategories(false);
        setCheckingLogin(false);
      }
    };

    getCategories();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  // ==========================================
  // SUBMIT NEWS
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to create news.");
      setMessageType("error");
      return;
    }

    const title = formData.title.trim();
    const content = formData.content.trim();
    const imageUrl = formData.image_url.trim();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!title) {
      setMessage("Please enter a news title.");
      setMessageType("error");
      return;
    }

    if (!formData.category_id) {
      setMessage("Please select a category.");
      setMessageType("error");
      return;
    }

    if (!content) {
      setMessage("Please enter the news content.");
      setMessageType("error");
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setMessage("Submitting news...");
    setMessageType("loading");

    const submitData = {
      title,
      category_id: formData.category_id,
      content,
      image_url: imageUrl,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/posts`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(submitData),
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        setMessage(
          data.message || "Failed to submit news."
        );

        setMessageType("error");
        return;
      }

      setMessage(
        data.message ||
          "News submitted successfully! Waiting for admin approval."
      );

      setMessageType("success");

      // CLEAR FORM

      setFormData({
        title: "",
        category_id: "",
        content: "",
        image_url: "",
      });
    } catch (error) {
      console.error(
        "Create news error:",
        error
      );

      setMessage("Cannot connect to server.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOGIN CHECK LOADING
  // ==========================================

  if (checkingLogin) {
    return (
      <>
        <style>{createPostStyles}</style>

        <div className="create-news-background">
          <div className="create-news-page">

            <div className="create-news-loading">
              <div className="create-news-spinner"></div>

              <p>Checking login...</p>
            </div>

          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // CHECK TOKEN
  // ==========================================

  const token = localStorage.getItem("token");

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token) {
    return (
      <>
        <style>{createPostStyles}</style>

        <div className="create-news-background">
          <div className="create-news-page">

            <div className="create-news-login-card">

              <div className="create-news-icon">
                📰
              </div>

              <h1>Create News</h1>

              <p>
                Please login to create and publish
                news articles.
              </p>

              <Link
                to="/login"
                className="create-news-login-button"
              >
                Go to Login
              </Link>

            </div>

          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // CREATE NEWS PAGE
  // ==========================================

  return (
    <>
      <style>{createPostStyles}</style>

      <div className="create-news-background">

        <div className="create-news-page">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="create-news-header">

            <div className="create-news-header-icon">
              📰
            </div>

            <div>
              <h1>Create News</h1>

              <p>
                Share your news with the community
              </p>
            </div>

          </div>

          {/* ==========================================
              FORM CARD
          ========================================== */}

          <div className="create-news-card">

            <form onSubmit={handleSubmit}>

              {/* TITLE */}

              <div className="create-news-field">

                <label htmlFor="title">
                  News Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your news title"
                  maxLength={200}
                  required
                  disabled={submitting}
                />

                <span className="field-hint">
                  Give your news a clear and meaningful
                  title.
                </span>

              </div>

              {/* CATEGORY */}

              <div className="create-news-field">

                <label htmlFor="category_id">
                  Category
                </label>

                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  disabled={
                    submitting ||
                    loadingCategories
                  }
                >

                  <option value="">
                    {loadingCategories
                      ? "Loading categories..."
                      : "Select Category"}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* CONTENT */}

              <div className="create-news-field">

                <label htmlFor="content">
                  News Content
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your news article here..."
                  rows={12}
                  required
                  disabled={submitting}
                />

                <span className="field-hint">
                  Write the complete details of your
                  news.
                </span>

              </div>

              {/* IMAGE URL */}

              <div className="create-news-field">

                <label htmlFor="image_url">
                  <span>Image URL</span>

                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <input
                  id="image_url"
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={submitting}
                />

                <span className="field-hint">
                  Add a public image URL for your news
                  article.
                </span>

              </div>

              {/* IMAGE PREVIEW */}

              {formData.image_url.trim() && (
                <div className="create-news-preview">

                  <p>Image Preview</p>

                  <img
                    src={formData.image_url}
                    alt="News preview"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>
              )}

              {/* MESSAGE */}

              {message && (
                <div
                  className={`create-news-message ${messageType}`}
                >

                  {messageType === "loading" && (
                    <span className="message-spinner"></span>
                  )}

                  {messageType === "success" && (
                    <span className="message-icon">
                      ✓
                    </span>
                  )}

                  {messageType === "error" && (
                    <span className="message-icon">
                      ⚠
                    </span>
                  )}

                  <span>{message}</span>

                </div>
              )}

              {/* SUBMIT */}

              <div className="create-news-actions">

                <button
                  type="submit"
                  className="submit-news-button"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <span className="button-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      📰 Submit News
                    </>
                  )}

                </button>

              </div>

              {/* INFORMATION */}

              <div className="create-news-notice">

                <span>ℹ️</span>

                <p>
                  Your news will be reviewed by an
                  administrator before it becomes
                  publicly visible.
                </p>

              </div>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}


// =====================================================
// CREATE POST STYLES
// Kept inside JSX — no createpost.css required.
// =====================================================

const createPostStyles = `
  .create-news-background {
    width: 100%;
    min-height: 100vh;
    padding: 90px 20px 60px;
  }

  .create-news-page {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  .create-news-header {
    display: flex;
    align-items: center;
    gap: 18px;

    padding: 28px 30px;
    margin-bottom: 22px;

    border-radius: 18px;

    color: white;

    background:
      linear-gradient(
        135deg,
        #2563eb,
        #4f46e5
      );

    box-shadow:
      0 12px 30px rgba(0, 0, 0, 0.18);
  }

  .create-news-header-icon {
    width: 58px;
    height: 58px;
    min-width: 58px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 16px;

    background: rgba(255, 255, 255, 0.18);

    font-size: 30px;
  }

  .create-news-header h1 {
    margin: 0 0 6px;

    font-size: 30px;
    line-height: 1.2;
  }

  .create-news-header p {
    margin: 0;

    font-size: 15px;
    line-height: 1.5;

    opacity: 0.9;
  }

  .create-news-card {
    width: 100%;

    background: rgba(255, 255, 255, 0.97);

    border-radius: 18px;

    padding: 32px;

    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.18);
  }

  .create-news-field {
    margin-bottom: 24px;
  }

  .create-news-field label {
    display: flex;
    align-items: center;
    gap: 10px;

    margin-bottom: 8px;

    color: #111827;

    font-size: 14px;
    font-weight: 700;
  }

  .create-news-field input,
  .create-news-field select,
  .create-news-field textarea {
    width: 100%;

    border: 1px solid #d1d5db;

    border-radius: 10px;

    padding: 13px 14px;

    background: white;

    color: #111827;

    font-size: 14px;

    outline: none;

    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .create-news-field input,
  .create-news-field select {
    min-height: 46px;
  }

  .create-news-field textarea {
    min-height: 220px;

    resize: vertical;

    line-height: 1.6;
  }

  .create-news-field input:focus,
  .create-news-field select:focus,
  .create-news-field textarea:focus {
    border-color: #2563eb;

    box-shadow:
      0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  .create-news-field input:disabled,
  .create-news-field select:disabled,
  .create-news-field textarea:disabled {
    background: #f3f4f6;

    cursor: not-allowed;
  }

  .create-news-field input::placeholder,
  .create-news-field textarea::placeholder {
    color: #9ca3af;
  }

  .field-hint {
    display: block;

    margin-top: 6px;

    color: #6b7280;

    font-size: 12px;

    line-height: 1.5;
  }

  .optional-label {
    padding: 3px 8px;

    border-radius: 20px;

    background: #f3f4f6;

    color: #6b7280;

    font-size: 11px;
    font-weight: 600;
  }

  .create-news-preview {
    margin:
      -4px 0 24px;

    padding: 14px;

    border:
      1px solid #e5e7eb;

    border-radius: 12px;

    background: #f9fafb;
  }

  .create-news-preview p {
    margin: 0 0 10px;

    color: #374151;

    font-size: 13px;
    font-weight: 700;
  }

  .create-news-preview img {
    display: block;

    width: 100%;
    max-height: 280px;

    object-fit: cover;

    border-radius: 9px;
  }

  .create-news-message {
    display: flex;
    align-items: flex-start;

    gap: 10px;

    margin-bottom: 20px;

    padding: 13px 15px;

    border-radius: 10px;

    font-size: 14px;

    line-height: 1.5;
  }

  .create-news-message.success {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
  }

  .create-news-message.error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
  }

  .create-news-message.loading {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
  }

  .message-icon {
    font-weight: 800;
  }

  .message-spinner,
  .button-spinner {
    width: 17px;
    height: 17px;

    border: 2px solid currentColor;
    border-top-color: transparent;

    border-radius: 50%;

    display: inline-block;

    animation:
      createNewsSpin 0.7s linear infinite;
  }

  .create-news-actions {
    margin-top: 10px;
  }

  .submit-news-button {
    width: 100%;

    min-height: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    border: none;
    border-radius: 10px;

    background: #2563eb;

    color: white;

    font-size: 15px;
    font-weight: 700;

    cursor: pointer;

    transition:
      background 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .submit-news-button:hover {
    background: #1d4ed8;

    transform: translateY(-1px);

    box-shadow:
      0 7px 18px rgba(37, 99, 235, 0.25);
  }

  .submit-news-button:disabled {
    opacity: 0.65;

    cursor: not-allowed;

    transform: none;

    box-shadow: none;
  }

  .create-news-notice {
    display: flex;
    align-items: flex-start;

    gap: 10px;

    margin-top: 22px;

    padding: 14px;

    border-radius: 10px;

    background: #f8fafc;

    border: 1px solid #e2e8f0;
  }

  .create-news-notice span {
    flex-shrink: 0;

    font-size: 17px;
  }

  .create-news-notice p {
    margin: 0;

    color: #64748b;

    font-size: 12px;

    line-height: 1.6;
  }

  .create-news-loading,
  .create-news-login-card {
    width: 100%;

    max-width: 600px;

    margin: 40px auto;

    padding: 50px 30px;

    text-align: center;

    background: rgba(255, 255, 255, 0.97);

    border-radius: 18px;

    box-shadow:
      0 12px 35px rgba(0, 0, 0, 0.18);
  }

  .create-news-loading p {
    margin: 15px 0 0;

    color: #6b7280;

    font-size: 14px;
  }

  .create-news-spinner {
    width: 40px;
    height: 40px;

    margin: 0 auto;

    border: 4px solid #e5e7eb;

    border-top-color: #2563eb;

    border-radius: 50%;

    animation:
      createNewsSpin 0.8s linear infinite;
  }

  .create-news-icon {
    width: 70px;
    height: 70px;

    margin: 0 auto 15px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 18px;

    background: #eff6ff;

    font-size: 35px;
  }

  .create-news-login-card h1 {
    margin: 0 0 10px;

    color: #111827;

    font-size: 28px;
  }

  .create-news-login-card p {
    max-width: 420px;

    margin: 0 auto 25px;

    color: #6b7280;

    line-height: 1.6;

    font-size: 14px;
  }

  .create-news-login-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-height: 44px;

    padding: 10px 20px;

    border-radius: 9px;

    background: #2563eb;

    color: white;

    text-decoration: none;

    font-size: 14px;
    font-weight: 700;

    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }

  .create-news-login-button:hover {
    background: #1d4ed8;

    transform: translateY(-1px);
  }

  @keyframes createNewsSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .create-news-background {
      padding: 80px 15px 45px;
    }

    .create-news-header {
      padding: 24px;
      border-radius: 16px;
    }

    .create-news-header h1 {
      font-size: 25px;
    }

    .create-news-card {
      padding: 25px;
      border-radius: 16px;
    }
  }

  @media (max-width: 500px) {
    .create-news-background {
      padding: 75px 10px 35px;
    }

    .create-news-header {
      padding: 18px;
      gap: 12px;
      border-radius: 14px;
    }

    .create-news-header-icon {
      width: 46px;
      height: 46px;
      min-width: 46px;
      border-radius: 12px;
      font-size: 23px;
    }

    .create-news-header h1 {
      font-size: 21px;
    }

    .create-news-header p {
      font-size: 13px;
    }

    .create-news-card {
      padding: 18px;
      border-radius: 14px;
    }

    .create-news-field {
      margin-bottom: 20px;
    }

    .create-news-field textarea {
      min-height: 180px;
    }

    .create-news-login-card,
    .create-news-loading {
      padding: 40px 20px;
    }
  }

  @media (max-width: 360px) {
    .create-news-background {
      padding-left: 8px;
      padding-right: 8px;
    }

    .create-news-card {
      padding: 15px;
    }

    .create-news-header {
      padding: 15px;
    }

    .create-news-header h1 {
      font-size: 19px;
    }

    .create-news-header p {
      font-size: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .submit-news-button,
    .create-news-login-button {
      transition: none;
    }

    .create-news-spinner,
    .message-spinner,
    .button-spinner {
      animation: none;
    }
  }
`;

export default CreatePost;