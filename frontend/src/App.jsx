import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// =====================================================
// PAGES
// =====================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsFeed from "./pages/newsfeed";
import NewsDetails from "./pages/newdetails";
import Profile from "./pages/profile";
import CreatePost from "./pages/createpost";
import Notifications from "./pages/notification";
import Reports from "./pages/report";
import AdminDashboard from "./pages/admindashboard";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./component/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* =================================================
            NAVBAR
        ================================================= */}

        <Navbar />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="app-content">

          <Routes>

            {/* =================================================
                HOME
            ================================================= */}

            <Route
              path="/"
              element={<NewsFeed />}
            />

            {/* =================================================
                AUTHENTICATION
            ================================================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            {/* =================================================
                NEWS
            ================================================= */}

            <Route
              path="/news"
              element={<NewsFeed />}
            />

            <Route
              path="/news/:id"
              element={<NewsDetails />}
            />

            {/* =================================================
                USER PROFILE
            ================================================= */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* =================================================
                CREATE NEWS
            ================================================= */}

            <Route
              path="/create-post"
              element={<CreatePost />}
            />

            <Route
              path="/create-news"
              element={<CreatePost />}
            />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />

            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* =================================================
                404
            ================================================= */}

            <Route
              path="*"
              element={
                <div className="not-found">

                  <div className="not-found-icon">
                    🔎
                  </div>

                  <h1>404</h1>

                  <p>
                    The page you are looking for
                    could not be found.
                  </p>

                  <a
                    href="/"
                    className="not-found-button"
                  >
                    ← Back to News
                  </a>

                </div>
              }
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;