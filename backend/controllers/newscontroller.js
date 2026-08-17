const db = require("../config/database");

const getPublishedNews = async (req, res) => {
  try {
    const [posts] = await db.promise().query(
      `SELECT
          posts.id,
          posts.user_id,
          posts.title,
          posts.content,
          posts.image_url,
          posts.created_at,
          users.name AS author,
          categories.name AS category,

        (SELECT COUNT(*)
         FROM likes
         WHERE likes.post_id = posts.id) AS likeCount,

        (SELECT COUNT(*)
         FROM comments
         WHERE comments.post_id = posts.id) AS commentCount

       FROM posts

       JOIN users
         ON posts.user_id = users.id

       JOIN categories
         ON posts.category_id = categories.id

       WHERE posts.status = 'approved'

       ORDER BY posts.created_at DESC`
    );

    res.json({
      posts
    });

  } catch (error) {
    console.error("Get news error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getNewsDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await db.promise().query(`
      SELECT
        posts.id,
        posts.user_id,
        posts.title,
        posts.content,
        posts.image_url,
        posts.status,
        posts.created_at,
        users.name AS author,
        categories.name AS category
      FROM posts
      JOIN users
        ON posts.user_id = users.id
      JOIN categories
        ON posts.category_id = categories.id
      WHERE posts.id = ?
        AND posts.status = 'approved'
    `, [id]);

    if (posts.length === 0) {
      return res.status(404).json({
        message: "News not found"
      });
    }

    res.json({
      post: posts[0]
    });

  } catch (error) {
    console.error("Get news details error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getPublishedNews,
  getNewsDetails
};