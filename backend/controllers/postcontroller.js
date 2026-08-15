const db = require("../config/database");

const createPost = async (req, res) => {
  try {
    if (
  req.user.role !== "publisher" &&
  req.user.role !== "admin"
) {
  return res.status(403).json({
    message: "Only publishers and admins can create news"
  });
}
    const { title, content, category_id, image_url } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({
        message: "Title, content and category are required"
      });
    }

    const [result] = await db.promise().query(
      `INSERT INTO posts
       (user_id, category_id, title, content, image_url, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [
        req.user.id,
        category_id,
        title,
        content,
        image_url || null
      ]
    );

    res.status(201).json({
      message: "News submitted successfully",
      postId: result.insertId
    });

  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createPost
};