const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET;

// =====================================================
// BREVO SEND EMAIL
// =====================================================

const sendEmail = async ({
  to,
  subject,
  html
}) => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },

      body: JSON.stringify({
        sender: {
          name:
            process.env.EMAIL_FROM_NAME ||
            "News11",

          email:
            process.env.EMAIL_FROM
        },

        to: [
          {
            email: to
          }
        ],

        subject,
        htmlContent: html
      })
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Brevo email error:", data);

    throw new Error(
      data.message ||
      "Brevo email sending failed"
    );
  }

  return data;
};


// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    const cleanName = name?.trim();
    const cleanEmail =
      email?.trim().toLowerCase();

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !cleanName ||
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING USER
    // -------------------------------------------------

    const [existingUsers] =
      await db.promise().query(
        `SELECT id, email_verified
         FROM users
         WHERE email = ?`,
        [cleanEmail]
      );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message:
          "Email already registered"
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------------------------------
    // EMAIL VERIFICATION TOKEN
    // -------------------------------------------------

    const verificationToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    const verificationExpires =
      new Date(
        Date.now() +
        24 * 60 * 60 * 1000
      );

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const [result] =
      await db.promise().query(
        `INSERT INTO users
        (
          name,
          email,
          password_hash,
          role,
          email_verified,
          verification_token,
          verification_token_expires
        )
        VALUES
        (?, ?, ?, 'publisher', 0, ?, ?)`,
        [
          cleanName,
          cleanEmail,
          passwordHash,
          verificationToken,
          verificationExpires
        ]
      );

    // -------------------------------------------------
    // VERIFICATION LINK
    // -------------------------------------------------

    const verificationLink =
      `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // -------------------------------------------------
    // SEND VERIFICATION EMAIL USING BREVO
    // -------------------------------------------------

    await sendEmail({
      to: cleanEmail,

      subject:
        "Verify your News11 email address",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2>
            Welcome to News11
          </h2>

          <p>
            Hello ${cleanName},
          </p>

          <p>
            Thank you for creating a News11 account.
          </p>

          <p>
            Please verify your email address before
            logging in to your account.
          </p>

          <p style="margin: 30px 0;">

            <a
              href="${verificationLink}"
              style="
                display: inline-block;
                padding: 12px 22px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
              "
            >
              Verify Email Address
            </a>

          </p>

          <p>
            This verification link will expire in
            24 hours.
          </p>

          <p>
            If you did not create this News11 account,
            you can safely ignore this email.
          </p>

          <p>
            News11 Team
          </p>

        </div>
      `
    });

    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    res.status(201).json({
      message:
        "Registration successful! Please check your email and click the verification link before logging in.",

      userId:
        result.insertId
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to complete registration"
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const cleanEmail =
      email?.trim().toLowerCase();

    if (
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required"
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const [users] =
      await db.promise().query(
        "SELECT * FROM users WHERE email = ?",
        [cleanEmail]
      );

    if (users.length === 0) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    const user = users[0];

    // -------------------------------------------------
    // CHECK EMAIL VERIFICATION
    // -------------------------------------------------

    if (
      Number(user.email_verified) !== 1
    ) {
      return res.status(403).json({
        message:
          "Please verify your email address before logging in."
      });
    }

    // -------------------------------------------------
    // CHECK PASSWORD
    // -------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password"
      });
    }

    // -------------------------------------------------
    // CREATE JWT
    // -------------------------------------------------

    const token =
      jwt.sign(
        {
          id: user.id,
          role: user.role
        },

        JWT_SECRET,

        {
          expiresIn: "1d"
        }
      );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    res.json({

      message:
        "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message:
        "Server error"
    });
  }
};


// =====================================================
// VERIFY EMAIL
// =====================================================

const verifyEmail = async (req, res) => {
  try {

    const {
      token
    } = req.params;

    if (!token) {
      return res.status(400).json({
        message:
          "Invalid verification link"
      });
    }

    // -------------------------------------------------
    // FIND VALID TOKEN
    // -------------------------------------------------

    const [users] =
      await db.promise().query(
        `SELECT id, email_verified
         FROM users
         WHERE verification_token = ?
         AND verification_token_expires > NOW()`,
        [token]
      );

    if (users.length === 0) {
      return res.status(400).json({
        message:
          "Verification link is invalid or expired"
      });
    }

    const user = users[0];

    // -------------------------------------------------
    // VERIFY USER
    // -------------------------------------------------

    await db.promise().query(
      `UPDATE users
       SET email_verified = 1,
           verification_token = NULL,
           verification_token_expires = NULL
       WHERE id = ?`,
      [user.id]
    );

    res.json({
      message:
        "Email verified successfully. You can now log in."
    });

  } catch (error) {

    console.error(
      "Email verification error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to verify email"
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {

    const {
      email
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Email address is required"
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const [users] =
      await db.promise().query(
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

    // -------------------------------------------------
    // CREATE RESET TOKEN
    // -------------------------------------------------

    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    // 30 minutes
    const expiresAt =
      new Date(
        Date.now() +
        30 * 60 * 1000
      );

    // -------------------------------------------------
    // SAVE RESET TOKEN
    // -------------------------------------------------

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

    // -------------------------------------------------
    // RESET LINK
    // -------------------------------------------------

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // -------------------------------------------------
    // SEND EMAIL USING BREVO
    // -------------------------------------------------

    await sendEmail({

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
                font-weight: bold;
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

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

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

    const {
      token
    } = req.params;

    const {
      password
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (!token) {
      return res.status(400).json({
        message:
          "Invalid reset link"
      });
    }

    if (!password) {
      return res.status(400).json({
        message:
          "New password is required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });
    }

    // -------------------------------------------------
    // FIND VALID RESET TOKEN
    // -------------------------------------------------

    const [users] =
      await db.promise().query(
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

    // -------------------------------------------------
    // HASH NEW PASSWORD
    // -------------------------------------------------

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------------------------------
    // UPDATE PASSWORD
    // -------------------------------------------------

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
  verifyEmail,
  forgotPassword,
  resetPassword
};

