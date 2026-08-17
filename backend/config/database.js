const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: Number(process.env.MYSQLPORT)
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  console.log("MySQL database connected successfully!");

  connection.release();
});

module.exports = db;