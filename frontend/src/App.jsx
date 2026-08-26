import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsFeed from "./pages/newsfeed";
import NewsDetails from "./pages/newdetails";
import Profile from "./pages/profile";
import CreatePost from "./pages/createpost";
import Notifications from "./pages/notification";
import Reports from "./pages/report";
import AdminDashboard from "./pages/admindashboard";
import ForgotPassword from "./pages/forgotpassword";
import ResetPassword from "./pages/resetpassword";

// Components
import Navbar from "./component/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Navbar />

        <main className="app-content">
          <Routes>

            {/* ==============================
                HOME
            ============================== */}

            <Route
              path="/"
              element={<NewsFeed />}
            />

            {/* ==============================
                AUTHENTICATION
            ============================== */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/Register"
              element={<Register />}
            />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            {/* Password reset link from email */}
            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />

            {/* ==============================
                NEWS
            ============================== */}

            <Route
              path="/news"
              element={<NewsFeed />}
            />

            <Route
              path="/news/:id"
              element={<NewsDetails />}
            />

            {/* ==============================
                USER
            ============================== */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* ==============================
                CREATE NEWS
            ============================== */}

            <Route
              path="/create-post"
              element={<CreatePost />}
            />

            <Route
              path="/create-news"
              element={<CreatePost />}
            />

            {/* ==============================
                NOTIFICATIONS
            ============================== */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            {/* ==============================
                REPORTS
            ============================== */}

            <Route
              path="/reports"
              element={<Reports />}
            />

            {/* ==============================
                ADMIN
            ============================== */}

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            {/* ==============================
                404
            ============================== */}

            <Route
              path="*"
              element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>Page not found</p>

                  <a href="/">
                    Go to Home
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