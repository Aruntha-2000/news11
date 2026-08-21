import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function FloatingSidebar() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const closeMenu = () => {
    setOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setOpen(false);

    navigate("/login");
  };

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const getMenuItems = () => {
    const path = location.pathname;

    // =================================================
    // REGISTER PAGE
    // =================================================

    if (path === "/register") {
      return [
        {
          path: "/login",
          label: " Login",
        },
      ];
    }

    // =================================================
    // LOGIN PAGE
    // =================================================

    if (path === "/login") {
      return [
        {
          path: "/register",
          label: "REGISTER",
        },
      ];
    }

    // =================================================
    // FORGOT PASSWORD
    // =================================================

    if (path === "/forgot-password") {
      return [
        {
          path: "/login",
          label: " Login",
        },
        {
          path: "/register",
          label: "REGISTER",
        },
      ];
    }

    // =================================================
    // RESET PASSWORD
    // =================================================

    if (path.startsWith("/reset-password")) {
      return [
        {
          path: "/login",
          label: " Login",
        },
      ];
    }

    // =================================================
    // LOGGED-IN USER
    // =================================================

    if (token) {
      const items = [
        {
          path: "/",
          label: "📰 News",
        },
        {
          path: "/create-news",
          label: "✏️ Create News",
        },
        {
          path: "/profile",
          label: "👤 Profile",
        },
        {
          path: "/feedback",
          label: "💬 Feedback",
        },
        {
          path: "/notifications",
          label: "🔔 Notifications",
        },
        {
          path: "/report",
          label: "📋 Reports",
        },
      ];

      // ===============================================
      // ADMIN MENU
      // ===============================================

      if (user?.role === "admin") {
        items.push({
          path: "/admin",
          label: "🛠️ Admin Dashboard",
        });

        items.push({
          path: "/admin/feedback",
          label: "💬 Feedback Admin",
        });
      }

      return items;
    }

    // =================================================
    // PUBLIC USER / HOME PAGE
    // =================================================

    return [
      {
        path: "/",
        label: "📰 News",
      },
      {
        path: "/login",
        label: " Login",
      },
      {
        path: "/register",
        label: "REGISTER",
      },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* =================================================
          MENU BUTTON
      ================================================= */}

      <button
        className="menu-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* =================================================
          OVERLAY
      ================================================= */}

      {open && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <nav
        className={`floating-sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        {/* SIDEBAR HEADER */}

        <div className="sidebar-header">
          <h3>News11</h3>

          <button
            className="sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* MENU */}

        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="nav-item"
              onClick={closeMenu}
            >
              <span>{item.label}</span>
            </Link>
          ))}

          {/* LOGOUT */}

          {token && (
            <button
              type="button"
              className="nav-item logout-button"
              onClick={logout}
            >
              🚪 Logout
            </button>
          )}
        </div>
      </nav>
    </>
  );
}