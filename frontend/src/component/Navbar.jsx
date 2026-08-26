import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          📰 News11
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* NAVIGATION */}
        <div
          className={`navbar-links ${
            menuOpen ? "navbar-links-open" : ""
          }`}
        >

          <Link
            to="/"
            className="navbar-link"
            onClick={closeMenu}
          >
            🏠 Home
          </Link>

          <Link
            to="/news"
            className="navbar-link"
            onClick={closeMenu}
          >
            📰 News
          </Link>

          {token ? (
            <>
              <Link
                to="/create-news"
                className="navbar-link"
                onClick={closeMenu}
              >
                ✍️ Create News
              </Link>

              <Link
                to="/profile"
                className="navbar-link"
                onClick={closeMenu}
              >
                👤 Profile
              </Link>

              <Link
                to="/notifications"
                className="navbar-link"
                onClick={closeMenu}
              >
                🔔 Notifications
              </Link>

              <Link
                to="/reports"
                className="navbar-link"
                onClick={closeMenu}
              >
                📊 Reports
              </Link>

              <Link
                to="/admin"
                className="navbar-link"
                onClick={closeMenu}
              >
                🛡️ Admin
              </Link>

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-link"
                onClick={closeMenu}
              >
                🔐 Login
              </Link>

              <Link
                to="/Register"
                className="navbar-register"
                onClick={closeMenu}
              >
                📝 Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;