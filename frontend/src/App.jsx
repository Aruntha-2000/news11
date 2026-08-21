import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/profile";
import CreatePost from "./pages/createpost";
import AdminDashboard from "./pages/admindashboard";
import NewsFeed from "./pages/newsfeed";
import NewsDetails from "./pages/newdetails";
import UserProfile from "./pages/userprofile";
import Notifications from "./pages/notification";
import Reports from "./pages/report";
import Feedback from "./pages/feedback";
import FeedbackAdmin from "./pages/feedbackadmin";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";

import Protectedroute from "./component/protectedroutes";
import FloatingSidebar from "./floatingsidebar"; // <-- NEW IMPORT

function App() {
  const [notificationCount, setNotificationCount] = useState(0);

  // =========================
  // NOTIFICATION COUNT
  // =========================
  useEffect(() => {
    const getUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setNotificationCount(0);
        return;
      }
      try {
        const response = await fetch(
          "https://news-11-production.up.railway.app/api/notifications/unread-count",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        if (response.ok) {
          setNotificationCount(data.count || 0);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error("Notification count error:", error);
      }
    };

    getUnreadCount();
    const interval = setInterval(getUnreadCount, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      
      {/* =========================
          NEW FLOATING SIDEBAR
      ========================= */}
      <FloatingSidebar />

      {/* =========================
          ROUTES
      ========================= */}
      <main className="page-container">
        <Routes>
          {/* HOME & AUTH */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <Protectedroute>
                <Profile />
              </Protectedroute>
            }
          />

          {/* USER PROFILE */}
          <Route
            path="/user/:id"
            element={
              <Protectedroute>
                <UserProfile />
              </Protectedroute>
            }
          />

          {/* CREATE NEWS */}
          <Route
            path="/create-news"
            element={
              <Protectedroute>
                <CreatePost />
              </Protectedroute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <Protectedroute>
                <AdminDashboard />
              </Protectedroute>
            }
          />

          {/* NEWS */}
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/news/:id" element={<NewsDetails />} />

            <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />
          
          {/* NOTIFICATIONS */}
          <Route
            path="/notifications"
            element={
              <Protectedroute>
                <Notifications />
              </Protectedroute>
            }
          />

          {/* REPORTS */}
          <Route
            path="/report"
            element={
              <Protectedroute>
                <Reports />
              </Protectedroute>
            }
          />

          {/* FEEDBACK */}
          <Route
            path="/feedback"
            element={
              <Protectedroute>
                <Feedback />
              </Protectedroute>
            }
          />

          {/* ADMIN FEEDBACK */}
          <Route
            path="/admin/feedback"
            element={
              <Protectedroute>
                <FeedbackAdmin />
              </Protectedroute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;