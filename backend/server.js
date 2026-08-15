const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const authroutes = require("./routes/authroutes");
const userroutes = require("./routes/userroutes");
const postroutes = require("./routes/postrouter");
const categoryroutes = require("./routes/categoryroutes");
const adminroutes = require("./routes/adminroutes");
const newsroutes = require("./routes/newsroutes");
const likeroutes = require("./routes/likesroutes");
const commentroutes = require("./routes/commentroutes");
const repleroutes = require("./routes/repleroutes");
const followroutes = require("./routes/followroutes");
const notificationroutes = require("./routes/notificationroutes");
const reportroutes = require("./routes/reportroutes");
const feedbackroute = require("./routes/feedbackroute");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authroutes);
app.use("/api/users", userroutes);
app.use("/api/posts", postroutes);
app.use("/api/categories", categoryroutes);
app.use("/api/admin", adminroutes);
app.use("/api/news", newsroutes);
app.use("/api/likes", likeroutes);
app.use("/api/comments", commentroutes);
app.use("/api/replies", repleroutes);
app.use("/api/follows", followroutes);
app.use("/api/notifications", notificationroutes);
app.use("/api/reports",reportroutes);
app.use("/api/feedbacks",feedbackroute);


app.get("/", (req, res) => {
  res.json({
    message: "News Social Platform API is running!"
  });
});

app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 AS result", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Database connection failed"
      });
    }

    res.json({
      message: "Database connection successful!",
      result: results[0].result
    });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});