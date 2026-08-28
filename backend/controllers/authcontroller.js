const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET;


// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

const cleanName = name?.trim();
const cleanEmail = email?.trim().toLowerCase();

if (!cleanName || !cleanEmail || !password) {
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
      [cleanEmail]
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
       VALUES (?, ?, ?, 'publisher')`,
      [cleanName, cleanEmail, passwordHash]
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


// =====================================================
// LOGIN
// =====================================================

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


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email address is required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [users] = await db.promise().query(
      `SELECT id, name, email
       FROM users
       WHERE email = ?`,
      [cleanEmail]
    );

    /*
      Always return the same message.
      This prevents people from checking
      whether an email is registered.
    */

    if (users.length === 0) {
      return res.json({
        message:
          "If an account exists with this email, a password reset link has been sent."
      });
    }

    const user = users[0];

    // Generate secure random token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Token expires after 30 minutes
    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000
    );

    await db.promise().query(
      `UPDATE users
       SET reset_token = ?,
           reset_token_expires = ?
       WHERE id = ?`,
      [
        resetToken,
        expiresAt,
        user.id
      ]
    );

    // Reset link
    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });


    // Send email
    await transporter.sendMail({

      from:
        `"News11" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject:
        "News11 Password Reset",

      html: `

        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2>
            News11 Password Reset
          </h2>

          <p>
            Hello ${user.name || "User"},
          </p>

          <p>
            We received a request to reset
            your News11 password.
          </p>

          <p>
            Click the button below to create
            a new password.
          </p>

          <p>

            <a
              href="${resetLink}"

              style="
                display: inline-block;
                padding: 12px 20px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset Password
            </a>

          </p>

          <p>
            This link will expire in 30 minutes.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

          <p>
            News11 Team
          </p>

        </div>

      `
    });


    res.json({
      message:
        "If an account exists with this email, a password reset link has been sent."
    });


  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to process password reset request"
    });

  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {

  try {

    const { token } = req.params;

    const { password } = req.body;


    if (!token) {

      return res.status(400).json({
        message: "Invalid reset link"
      });

    }


    if (!password) {

      return res.status(400).json({
        message: "New password is required"
      });

    }


    if (password.length < 6) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });

    }


    // Find valid token
    const [users] = await db.promise().query(

      `SELECT id
       FROM users
       WHERE reset_token = ?
       AND reset_token_expires > NOW()`,

      [token]

    );


    if (users.length === 0) {

      return res.status(400).json({

        message:
          "Reset link is invalid or expired"

      });

    }


    const user = users[0];


    // Hash new password
    const passwordHash =
      await bcrypt.hash(password, 10);


    // Update password
    // Remove reset token
    await db.promise().query(

      `UPDATE users
       SET password_hash = ?,
           reset_token = NULL,
           reset_token_expires = NULL
       WHERE id = ?`,

      [
        passwordHash,
        user.id
      ]

    );


    res.json({

      message:
        "Password reset successful"

    });


  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({

      message:
        "Unable to reset password"

    });

  }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  register,

  login,

  forgotPassword,

  resetPassword

};