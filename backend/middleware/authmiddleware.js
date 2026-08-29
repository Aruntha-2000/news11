require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


// =====================================================
// AUTHENTICATE TOKEN
// =====================================================

const authenticateToken = (req, res, next) => {

  const authHeader = req.headers.authorization;

  const token =
    authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, user) => {

      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token"
        });
      }

      req.user = user;

      next();
    }
  );
};


// =====================================================
// ADMIN ONLY
// =====================================================

const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  authenticateToken,
  adminOnly
};