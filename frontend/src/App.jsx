import {
  BrowserRouter,
  Routes,
  Route,
  Link
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

import Protectedroute from "./component/protectedroutes";

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

        console.error(
          "Notification count error:",
          error
        );

      }
    };


    getUnreadCount();


    const interval = setInterval(
      getUnreadCount,
      10000
    );


    return () => {
      clearInterval(interval);
    };

  }, []);


  return (

    <BrowserRouter>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="nav-links">

          <Link
            to="/register"
            className="nav-link"
          >
            Register
          </Link>


          <Link
            to="/login"
            className="nav-link"
          >
            Login
          </Link>


          <Link
            to="/profile"
            className="nav-link"
          >
            Profile
          </Link>


          <Link
            to="/create-news"
            className="nav-link"
          >
            Create News
          </Link>


          <Link
            to="/admin"
            className="nav-link"
          >
            Admin
          </Link>


          <Link
            to="/report"
            className="nav-link"
          >
            🚩 Reports
          </Link>


          <Link
            to="/news"
            className="nav-link"
          >
            📰 News
          </Link>


          <Link
            to="/notifications"
            className="nav-link notification-link"
          >

            🔔 Notifications

            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount}
              </span>
            )}

          </Link>


          <Link
            to="/feedback"
            className="nav-link"
          >
            💬 Feedback
          </Link>


          <Link
            to="/admin/feedback"
            className="nav-link"
          >
            💬 Manage Feedback
          </Link>

        </div>

      </nav>


      {/* =========================
          ROUTES
      ========================= */}

      <main className="page-container">

        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={<Login />}
          />


          {/* AUTH */}

          <Route
            path="/register"
            element={<Register />}
          />


          <Route
            path="/login"
            element={<Login />}
          />


          {/* PROFILE */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />


          {/* USER PROFILE */}

          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />


          {/* CREATE NEWS */}

          <Route
            path="/create-news"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />


          {/* ADMIN */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* NEWS */}

          <Route
            path="/news"
            element={<NewsFeed />}
          />


          <Route
            path="/news/:id"
            element={<NewsDetails />}
          />


          {/* NOTIFICATIONS */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />


          {/* REPORTS */}

          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />


          {/* FEEDBACK */}

          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />


          {/* ADMIN FEEDBACK */}

          <Route
            path="/admin/feedback"
            element={
              <ProtectedRoute>
                <FeedbackAdmin />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

    </BrowserRouter>
  );
}


export default App;