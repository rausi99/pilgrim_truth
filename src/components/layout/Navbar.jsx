import { useAuth } from "../../context/AuthContext";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Cross,
  FileText,
  Flame,
  Heart,
  History,
  Menu,
  MessageCircle,
  Play,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import "./Navbar.css";

const primaryLinks = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Bible Studies",
    to: "/bible-studies",
  },
  {
    label: "Prophecy",
    to: "/prophecy",
  },
  {
    label: "History",
    to: "/history",
  },
  {
    label: "Christian Living",
    to: "/christian-living",
  },
  {
    label: "Health",
    to: "/health",
  },
  {
    label: "Articles",
    to: "/articles",
  },
];

const moreLinks = [
  {
    label: "Daily Inspiration",
    to: "/daily-inspirations",
    icon: Flame,
  },
  {
    label: "Videos",
    to: "/videos",
    icon: Play,
  },
  {
    label: "Resources",
    to: "/resources",
    icon: BookOpen,
  },
  {
    label: "Discussions",
    to: "/discussions",
    icon: MessageCircle,
  },
];

const searchItems = [
  {
    title: "Bible Studies",
    type: "Bible Study",
    description: "Explore Bible-based studies and practical lessons.",
    to: "/bible-studies",
  },
  {
    title: "Prophecy",
    type: "Prophecy",
    description: "Explore biblical prophecy and its meaning.",
    to: "/prophecy",
  },
  {
    title: "History",
    type: "History",
    description: "Discover historical events and biblical context.",
    to: "/history",
  },
  {
    title: "Christian Living",
    type: "Christian Living",
    description: "Practical guidance for everyday Christian life.",
    to: "/christian-living",
  },
  {
    title: "Health",
    type: "Health",
    description: "Explore principles of healthy Christian living.",
    to: "/health",
  },
  {
    title: "Articles",
    type: "Articles",
    description: "Read articles covering faith, Scripture and life.",
    to: "/articles",
  },
  {
    title: "Daily Inspiration",
    type: "Daily Inspiration",
    description: "Daily biblical encouragement and reflection.",
    to: "/daily-inspirations",
  },
  {
    title: "Videos",
    type: "Videos",
    description: "Watch Bible teachings and Christian content.",
    to: "/videos",
  },
  {
    title: "Resources",
    type: "Resources",
    description: "Find useful Christian study resources.",
    to: "/resources",
  },
  {
    title: "Discussions",
    type: "Discussions",
    description: "Join conversations and discuss biblical topics.",
    to: "/discussions",
  },
];

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin =
    user?.role === "admin" || user?.role === "administrator";

  const moreIsActive = moreLinks.some((item) =>
    location.pathname.startsWith(item.to)
  );

  useEffect(() => {
    document.body.classList.toggle("navbar-menu-open", menuOpen);

    return () => {
      document.body.classList.remove("navbar-menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMoreOpen(false);
        setAccountOpen(false);
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, searchOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setMoreOpen(false);
    setAccountOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    closeMenus();
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    closeMenus();
    logout();
  };

  const filteredSearchItems = searchItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      item.title.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <header className="navbar">
        <div className="nav-inner">
          {/* Brand */}
          <Link
            to="/"
            className="navbar-brand"
            onClick={closeMenus}
            aria-label="Pilgrim Truth Home"
          >
            <span className="brand-mark">
              <Cross size={21} strokeWidth={2.2} />
            </span>

            <span className="brand-text">
              <span className="brand-primary">PILGRIM</span>
              <span className="brand-secondary">TRUTH</span>
            </span>
          </Link>

          {/* Desktop / Mobile Navigation */}
          <nav
            className={`nav-links ${menuOpen ? "open" : ""}`}
            aria-label="Primary navigation"
          >
            {/* Primary links */}
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeMenus}
              >
                {link.label}
              </NavLink>
            ))}

            {/* More */}
            <div className="nav-more">
              <button
                type="button"
                className={`nav-more-trigger ${
                  moreIsActive ? "active" : ""
                }`}
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown
                  size={16}
                  className={moreOpen ? "rotate" : ""}
                />
              </button>

              <div
                className={`nav-more-menu ${
                  moreOpen ? "show" : ""
                }`}
              >
                {moreLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `more-link ${isActive ? "active" : ""}`
                      }
                      onClick={closeMenus}
                    >
                      <span className="more-link-icon">
                        <Icon size={17} />
                      </span>

                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Mobile search */}
            <button
              type="button"
              className="mobile-search-link"
              onClick={openSearch}
            >
              <Search size={18} />
              <span>Search</span>
            </button>

            {/* Mobile authentication */}
            <div className="mobile-auth">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="mobile-auth-link"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="mobile-register-link"
                    onClick={closeMenus}
                  >
                    Create Account
                    <ArrowRight size={17} />
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="mobile-auth-link"
                      onClick={closeMenus}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    className="mobile-logout-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="nav-actions">
            <button
              type="button"
              className="nav-search-trigger"
              onClick={openSearch}
              aria-label="Search"
            >
              <Search size={19} />
              <span>Search</span>
            </button>

            {isAuthenticated ? (
              <div className="account-wrapper">
                <button
                  type="button"
                  className="account-trigger"
                  onClick={() => {
                    setAccountOpen((open) => !open);
                    setMoreOpen(false);
                  }}
                  aria-expanded={accountOpen}
                >
                  <span className="account-avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>

                  <span className="account-label">
                    Account
                  </span>

                  <ChevronDown
                    size={15}
                    className={accountOpen ? "rotate" : ""}
                  />
                </button>

                <div
                  className={`account-menu ${
                    accountOpen ? "show" : ""
                  }`}
                >
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="account-menu-link"
                      onClick={closeMenus}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    className="account-menu-link logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="login-link"
                  onClick={closeMenus}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="register-link"
                  onClick={closeMenus}
                >
                  Create Account
                  <ArrowRight size={17} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className={`menu-btn ${menuOpen ? "open" : ""}`}
            onClick={() => {
              setMenuOpen((open) => !open);
              setMoreOpen(false);
              setAccountOpen(false);
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={25} strokeWidth={2} />
            ) : (
              <Menu size={25} strokeWidth={2} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      <div
        className={`menu-backdrop ${menuOpen ? "show" : ""}`}
        onClick={closeMenus}
        aria-hidden="true"
      />

      {/* Search */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-panel">
            <div className="search-header">
              <div>
                <span className="search-eyebrow">
                  PILGRIM TRUTH
                </span>

                <h2>Search</h2>
              </div>

              <button
                type="button"
                className="search-close"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <X size={23} />
              </button>
            </div>

            <div className="search-input-wrapper">
              <Search size={21} />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search Pilgrim Truth..."
                autoFocus
              />

              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="popular-searches">
              <span>Popular:</span>

              {[
                "Bible Studies",
                "Prophecy",
                "Articles",
                "Videos",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSearchQuery(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="search-results">
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="search-result"
                    onClick={closeSearch}
                  >
                    <div className="search-result-icon">
                      <FileText size={19} />
                    </div>

                    <div className="search-result-content">
                      <span>{item.type}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <ArrowRight
                      className="search-result-arrow"
                      size={18}
                    />
                  </Link>
                ))
              ) : (
                <div className="no-search-results">
                  <Search size={30} />
                  <h3>No results found</h3>
                  <p>
                    Try another search term or browse the
                    navigation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;