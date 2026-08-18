const mysql = require("mysql2");

let db;

if (process.env.MYSQL_URL) {
  // Railway
  db = mysql.createPool(process.env.MYSQL_URL);
} else {
  // Local XAMPP
  db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT)
  });
}

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("MySQL database connected successfully!");
  connection.release();
});

module.exports = db;