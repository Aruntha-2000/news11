import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  // ==========================================
  // UPDATE LOGIN STATE WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setMenuOpen(false);

    navigate("/login", { replace: true });
  };

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ==========================================
  // ACTIVE LINK
  // ==========================================

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  // ==========================================
  // NAVBAR
  // ==========================================

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* ======================================
            LOGO
        ====================================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          📰 News11
        </Link>

        {/* ======================================
            MOBILE MENU BUTTON
        ====================================== */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* ======================================
            NAVIGATION LINKS
        ====================================== */}

        <div
          className={`navbar-links ${
            menuOpen ? "navbar-links-open" : ""
          }`}
        >

          {/* HOME */}

          <Link
            to="/"
            className={`navbar-link ${
              isActive("/") ? "navbar-link-active" : ""
            }`}
            onClick={closeMenu}
          >
            🏠 Home
          </Link>


          {/* NEWS */}

          <Link
            to="/news"
            className={`navbar-link ${
              isActive("/news") ? "navbar-link-active" : ""
            }`}
            onClick={closeMenu}
          >
            📰 News
          </Link>


          {/* ====================================
              LOGGED-IN LINKS
          ==================================== */}

          {token ? (
            <>

              {/* CREATE NEWS */}

              <Link
                to="/create-news"
                className={`navbar-link ${
                  isActive("/create-news")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                ✍️ Create News
              </Link>


              {/* PROFILE */}

              <Link
                to="/profile"
                className={`navbar-link ${
                  isActive("/profile")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                👤 Profile
              </Link>


              {/* NOTIFICATIONS */}

              <Link
                to="/notifications"
                className={`navbar-link ${
                  isActive("/notifications")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                🔔 Notifications
              </Link>


              {/* REPORTS */}

              <Link
                to="/reports"
                className={`navbar-link ${
                  isActive("/reports")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                📊 Reports
              </Link>


              {/* ADMIN */}

              <Link
                to="/admin"
                className={`navbar-link ${
                  isActive("/admin")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                🛡️ Admin
              </Link>


              {/* LOGOUT */}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </>
          ) : (

            /* ==================================
               LOGGED-OUT LINKS
            ================================== */

            <>

              {/* LOGIN */}

              <Link
                to="/login"
                className={`navbar-link ${
                  isActive("/login")
                    ? "navbar-link-active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                🔐 Login
              </Link>


              {/* REGISTER */}

              <Link
                to="/register"
                className={`navbar-register ${
                  isActive("/register")
                    ? "navbar-link-active"
                    : ""
                }`}
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