const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET;

// =========================
// REGISTER
// =========================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const [existingUsers] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query(
      `INSERT INTO users
       (name, email, password_hash, role)
       VALUES (?, ?, ?, 'reader')`,
      [name, email, passwordHash]
    );

    res.status(201).json({
      message: "Registration successful",
      userId: result.insertId
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// LOGIN
// =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// EXPORT
// =========================

module.exports = {
  register,
  login
};