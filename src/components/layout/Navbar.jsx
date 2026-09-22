import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
  { name: "Home", href: "/" },
  { name: "Bible Studies", href: "/bible-studies" },
  { name: "Prophecy", href: "/prophecy" },
  { name: "History", href: "/history" },
  { name: "Christian Living", href: "/christian-living" },
  { name: "Health", href: "/health" },
  { name: "Articles", href: "/articles" },
  { name: "Videos", href: "/videos" },
  { name: "Resources", href: "/resources" },
  { name: "Discussions", href: "/discussions" },

];

const searchableContent = [
  {
    title: "Understanding Biblical Prophecy",
    type: "Prophecy",
    description:
      "Explore biblical prophecy and discover how Scripture communicates hope and truth.",
    icon: Flame,
    href: "/prophecy",
  },
  {
    title: "Bible Study Foundations",
    type: "Bible Study",
    description:
      "Build a stronger foundation for studying and understanding the Bible.",
    icon: BookOpen,
    href: "/bible-studies",
  },
  {
    title: "The History of Scripture",
    type: "Bible History",
    description:
      "Discover the historical background, people, places, and events of the Bible.",
    icon: History,
    href: "/history",
  },
  {
    title: "Living With Purpose",
    type: "Christian Living",
    description:
      "Practical reflections on faith, character, purpose, and everyday Christian life.",
    icon: Cross,
    href: "/christian-living",
  },
  {
    title: "Healthy Living",
    type: "Health",
    description:
      "Explore thoughtful principles for nutrition, movement, rest, and whole-person wellness.",
    icon: Heart,
    href: "/health",
  },
  {
    title: "Pilgrim Truth Articles",
    type: "Articles",
    description:
      "Read thoughtful articles exploring Scripture, prophecy, history, Christian living, and health.",
    icon: FileText,
    href: "/articles",
  },
  {
    title: "Watch & Learn",
    type: "Videos",
    description:
      "Explore biblical lessons and discussions through video.",
    icon: Play,
    href: "/videos",
  },
  {
    title: "Study Resources",
    type: "Resources",
    description:
      "Find study guides, Bible maps, timelines, downloads, and useful study tools.",
    icon: BookOpen,
    href: "/resources",
  },
  {
    title: "Pilgrim Truth Discussions",
    type: "Discussions",
    description:
      "Join thoughtful conversations about Scripture, prophecy, history, and Christian living.",
    icon: MessageCircle,
    href: "/discussions",
  },
];

  const results =
    searchQuery.trim().length > 0
      ? searchableContent.filter((item) =>
          `${item.title} ${item.type} ${item.description}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : [];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
            <div className="brand-mark">
              <Cross size={19} strokeWidth={2.2} />
            </div>

            <div className="brand-text">
              <strong>PILGRIM</strong>
              <span>TRUTH</span>
            </div>
          </a>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            <div className="mobile-nav-top">
              <span>MENU</span>

              <button
                className="mobile-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {links.map((link) => (
              <a
                href={link.href}
                key={link.name}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <button className="mobile-search-link" onClick={openSearch}>
              <Search size={18} />
              Search Pilgrim Truth
            </button>
          </nav>

         <div className="nav-actions">

  <button
    className="nav-search-trigger"
    onClick={openSearch}
    aria-label="Search"
  >
    <Search size={17} />
    <span>Search</span>
    <kbd>Ctrl K</kbd>
  </button>

  {isAuthenticated ? (
    <div className="navbar-user">
      <span className="navbar-user-name">
        {user?.name}
      </span>

      <button
        type="button"
        className="navbar-logout"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="navbar-auth">
    <Link to="/login" className="navbar-login">
         Login
    </Link>

    <Link to="/register" className="navbar-register">
  Create Account
    </Link>
    </div>
  )}

  <button
    className="menu-btn"
    onClick={() => setMenuOpen(!menuOpen)}
    aria-label="Open menu"
  >
    {menuOpen ? <X size={22} /> : <Menu size={22} />}
  </button>

</div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="search-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch();
            }
          }}
        >
          <div className="search-panel">
            <div className="search-panel-top">
              <div>
                <span className="search-eyebrow">SEARCH</span>
                <h2>What are you looking for?</h2>
              </div>

              <button
                className="search-close"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <X size={22} />
              </button>
            </div>

            <div className="search-input-wrapper">
              <Search size={21} />

              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search Bible studies, prophecy, articles..."
              />

              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {searchQuery.trim() === "" ? (
              <div className="search-default">
                <p className="search-label">POPULAR SEARCHES</p>

                <div className="search-tags">
                  <button onClick={() => setSearchQuery("Prophecy")}>
                    Prophecy
                  </button>

                  <button onClick={() => setSearchQuery("Daniel")}>
                    Daniel
                  </button>

                  <button onClick={() => setSearchQuery("Bible Study")}>
                    Bible Study
                  </button>

                  <button onClick={() => setSearchQuery("History")}>
                    Bible History
                  </button>
                </div>

                <div className="search-note">
                  <Search size={17} />
                  <span>
                    Search across Bible studies, prophecy, articles, videos
                    and resources.
                  </span>
                </div>
              </div>
            ) : (
              <div className="search-results">
                <p className="search-label">
                  {results.length}{" "}
                  {results.length === 1 ? "RESULT" : "RESULTS"}
                </p>

                {results.length > 0 ? (
                  results.map((item) => {
                    const Icon = item.icon;

                    return (
                      <a
                        href={item.href}
                        className="search-result"
                        key={item.title}
                        onClick={closeSearch}
                      >
                        <div className="search-result-icon">
                          <Icon size={19} />
                        </div>

                        <div className="search-result-content">
                          <span>{item.type}</span>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>

                        <ArrowRight size={18} />
                      </a>
                    );
                  })
                ) : (
                  <div className="no-results">
                    <Search size={30} />
                    <h3>No results found</h3>
                    <p>
                      Try another search term such as prophecy, Bible, Daniel,
                      history or Christian living.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;