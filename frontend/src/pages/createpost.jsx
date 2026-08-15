import { useEffect, useState } from "react";

function CreatePost() {
  const API_URL = "http://10.126.15.27:5000";

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

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Unable to load categories."
          );
          setMessageType("error");
          return;
        }

        setCategories(data.categories || []);
      } catch (error) {
        console.error("Get categories error:", error);

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

    // Clear previous message when user edits form
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

    // Trim values before sending
    const title = formData.title.trim();
    const content = formData.content.trim();
    const imageUrl = formData.image_url.trim();

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

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to submit news."
        );

        setMessageType("error");
        return;
      }

      setMessage(
        data.message ||
          "News submitted successfully! Waiting for admin approval."
      );

      setMessageType("success");

      // Clear form after successful submission
      setFormData({
        title: "",
        category_id: "",
        content: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Create news error:", error);

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
      <div className="create-news-page">

        <div className="create-news-loading">
          <div className="create-news-spinner"></div>

          <p>
            Checking login...
          </p>
        </div>

      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="create-news-page">

        <div className="create-news-login-card">

          <div className="create-news-icon">
            📰
          </div>

          <h1>
            Create News
          </h1>

          <p>
            Please login to create and publish
            news articles.
          </p>

          <a
            href="/login"
            className="create-news-login-button"
          >
            Go to Login
          </a>

        </div>

      </div>
    );
  }

  // ==========================================
  // CREATE NEWS PAGE
  // ==========================================

  return (
    <div className="create-news-page">

      {/* HEADER */}

      <div className="create-news-header">

        <div className="create-news-header-icon">
          📰
        </div>

        <div>
          <h1>
            Create News
          </h1>

          <p>
            Share your news with the community
          </p>
        </div>

      </div>


      {/* FORM CARD */}

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
              Give your news a clear and meaningful title.
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
              Write the complete details of your news.
            </span>

          </div>


          {/* IMAGE URL */}

          <div className="create-news-field">

            <label htmlFor="image_url">
              Image URL
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
              Add a public image URL for your news article.
            </span>

          </div>


          {/* MESSAGE */}

          {message && (
            <div
              className={`create-news-message ${messageType}`}
            >
              {messageType === "loading" && (
                <span className="message-spinner"></span>
              )}

              {messageType === "success" && (
                <span>✓</span>
              )}

              {messageType === "error" && (
                <span>⚠</span>
              )}

              <span>
                {message}
              </span>
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

            <span>
              ℹ️
            </span>

            <p>
              Your news will be reviewed by an
              administrator before it becomes
              publicly visible.
            </p>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreatePost;