const db = require("../config/database");

const getCategories = async (req, res) => {
  try {
    const [categories] = await db.promise().query(
      "SELECT id, name, description FROM categories ORDER BY name"
    );

    res.json({
      categories
    });

  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getCategories
};