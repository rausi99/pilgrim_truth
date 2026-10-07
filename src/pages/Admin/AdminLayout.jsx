import { useState } from "react";

import {
  BarChart3,
  BookOpen,
  FileText,
  Flame,
  Heart,
  Home,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Play,
  Settings,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const navigation = [
    {
      section: "MAIN",
      items: [
        {
          label: "Dashboard",
          path: "/admin",
          icon: LayoutDashboard,
        },
        {
          label: "Homepage",
          path: "/admin/homepage",
          icon: Home,
        },
      ],
    },

    {
      section: "CONTENT",
      items: [
        {
          label: "Articles",
          path: "/admin/articles",
          icon: FileText,
        },
        {
          label: "Daily Inspirations",
          path: "/admin/daily-inspirations",
          icon: Sparkles,
        },
        {
          label: "Bible Studies",
          path: "/admin/bible-studies",
          icon: BookOpen,
        },
        {
          label: "Christian Living",
          path: "/admin/christian-living",
          icon: Heart,
        },
        {
          label: "Health",
          path: "/admin/health",
          icon: Stethoscope,
        },
        {
          label: "Prophecy",
          path: "/admin/prophecy",
          icon: Flame,
        },
        {
          label: "History",
          path: "/admin/history",
          icon: Landmark,
        },
        {
          label: "Videos",
          path: "/admin/videos",
          icon: Play,
        },
      ],
    },

    {
      section: "LIBRARY",
      items: [
        {
          label: "Resources",
          path: "/admin/resources",
          icon: FileText,
        },
      ],
    },

    {
      section: "COMMUNITY",
      items: [
        {
          label: "Discussions",
          path: "/admin/discussions",
          icon: MessageCircle,
        },
        {
          label: "Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          label: "Reports",
          path: "/admin/reports",
          icon: BarChart3,
        },
      ],
    },

    {
      section: "SYSTEM",
      items: [
        {
          label: "Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-sidebar-header">
          <Link
            to="/admin"
            className="admin-brand"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="admin-brand-badge">
              PT
            </span>

            <div>
              <strong>PILGRIM TRUTH</strong>
              <span>Administration</span>
            </div>
          </Link>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-section">
          <nav className="admin-nav">
            {navigation.map((section) => (
              <div
                className="admin-nav-section"
                key={section.section}
              >
                <span className="admin-sidebar-label">
                  {section.section}
                </span>

                <div className="admin-nav-section-links">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={
                          isActive(item.path)
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                        }
                        onClick={() =>
                          setSidebarOpen(false)
                        }
                      >
                        <Icon size={18} />

                        <span>
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                {user?.name || "Administrator"}
              </strong>

              <span>Administrator</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu size={22} />
          </button>

          <div className="admin-topbar-title">
            <span>ADMINISTRATION</span>

            <strong>Pilgrim Truth</strong>
          </div>

          <Link
            to="/"
            className="admin-view-site"
          >
            View Site
          </Link>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
