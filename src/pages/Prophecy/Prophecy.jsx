import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Flame,
  Play,
  ScrollText,
  Star,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Prophecy.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

/*
 * Online hero image.
 * The dark overlay in Prophecy.css keeps the text readable.
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=2000&q=85";

function getReadingTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  if (!words) {
    return "5 min read";
  }

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${BACKEND_URL}${image}`;
  }

  return image;
}

function getCategoryIcon(category = "") {
  const value = category.toLowerCase();

  if (value.includes("daniel")) {
    return <ScrollText size={20} strokeWidth={1.8} />;
  }

  if (value.includes("revelation")) {
    return <Flame size={20} strokeWidth={1.8} />;
  }

  return <BookOpen size={20} strokeWidth={1.8} />;
}

function Prophecy() {
  const [activeTheme, setActiveTheme] = useState("All");
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchProphecies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/prophecy`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load prophecy studies."
          );
        }

        setStudies(Array.isArray(data.prophecies) ? data.prophecies : []);
      } catch (err) {
        console.error("Load public Prophecies error:", err);

        setError(
          err.message || "Unable to load prophecy studies."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProphecies();
  }, []);

  const themes = useMemo(() => {
    const categories = studies
      .map((study) => study.category?.trim())
      .filter(Boolean);

    return [...new Set(categories)];
  }, [studies]);

  useEffect(() => {
    if (
      activeTheme !== "All" &&
      !themes.includes(activeTheme)
    ) {
      setActiveTheme("All");
    }
  }, [activeTheme, themes]);

  const filteredStudies = useMemo(() => {
    if (activeTheme === "All") {
      return studies;
    }

    return studies.filter(
      (study) => study.category?.trim() === activeTheme
    );
  }, [activeTheme, studies]);

  const handleThemeClick = (theme) => {
    setActiveTheme(theme);

    requestAnimationFrame(() => {
      document
        .getElementById("prophecy-studies")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  const handleImageError = (id) => {
    setImageErrors((previous) => ({
      ...previous,
      [id]: true,
    }));
  };

  const scrollToStudies = () => {
    document
      .getElementById("prophecy-studies")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="inner-page prophecy-page">
      <Navbar />

      <main>
        {/* =====================================================
            HERO
            ===================================================== */}
        <section
          className="prophecy-page-hero"
          style={{
            "--prophecy-hero-image": `url("${HERO_IMAGE}")`,
          }}
        >
          <div className="prophecy-hero-overlay" />

          <div className="container prophecy-page-hero-inner">
            <div className="prophecy-page-hero-content">
              <span className="section-label">
                BIBLICAL PROPHECY
              </span>

              <h1>
                Discover the message
                <em>within the prophecy.</em>
              </h1>

              <p>
                Explore Daniel, Revelation, prophetic symbols,
                biblical history, hope, and the promises of
                Scripture through thoughtful, Christ-centered study.
              </p>

              <div className="prophecy-page-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={scrollToStudies}
                >
                  Start Exploring
                  <ArrowRight size={16} />
                </button>

                <Link
                  to="/videos"
                  className="btn btn-secondary"
                >
                  <Play size={16} />
                  Watch a Study
                </Link>
              </div>

              <div className="prophecy-scripture-card">
                <div className="prophecy-scripture-icon">
                  <Flame size={19} />
                </div>

                <div>
                  <span>KEY PRINCIPLE</span>

                  <blockquote>
                    “The testimony of Jesus is the spirit of prophecy.”
                  </blockquote>

                  <cite>Revelation 19:10</cite>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRODUCTION
            ===================================================== */}
        <section className="section prophecy-page-intro">
          <div className="container prophecy-intro-grid">
            <div className="prophecy-intro-heading">
              <span className="section-label">
                WHY STUDY PROPHECY?
              </span>

              <h2>
                Prophecy is more than
                <span> predicting the future.</span>
              </h2>
            </div>

            <div className="prophecy-intro-text">
              <p>
                Biblical prophecy contains messages about God,
                humanity, history, hope, judgment, redemption,
                and the future.
              </p>

              <p>
                Understanding prophecy begins with Scripture itself.
                Rather than approaching prophetic passages through
                speculation, examine their context, symbols, themes,
                and connections throughout the Bible.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            STUDY LIBRARY
            ===================================================== */}
        <section
          className="section prophecy-studies-section"
          id="prophecy-studies"
        >
          <div className="container">
            <div className="prophecy-section-top">
              <div>
                <span className="section-label">
                  {activeTheme === "All"
                    ? "PROPHECY LIBRARY"
                    : activeTheme.toUpperCase()}
                </span>

                <h2>
                  {activeTheme === "All"
                    ? "Begin your prophecy journey."
                    : `Explore ${activeTheme}.`}
                </h2>

                <p>
                  {activeTheme === "All"
                    ? "Study published lessons from Scripture and explore the themes that matter most."
                    : "Browse the published studies available in this category."}
                </p>
              </div>

              {!loading && !error && studies.length > 0 && (
                <div className="prophecy-study-count">
                  <strong>{filteredStudies.length}</strong>
                  <span>
                    {filteredStudies.length === 1
                      ? "study"
                      : "studies"}
                  </span>
                </div>
              )}
            </div>

            {activeTheme !== "All" && (
              <div className="prophecy-active-filter">
                <span>
                  Showing <strong>{activeTheme}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setActiveTheme("All")}
                >
                  Clear filter
                  <X size={14} />
                </button>
              </div>
            )}

            {loading ? (
              <div className="prophecy-study-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    className="prophecy-skeleton-card"
                    key={item}
                  >
                    <div className="prophecy-skeleton-image" />

                    <div className="prophecy-skeleton-content">
                      <span />
                      <i />
                      <i />
                      <i className="short" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="prophecy-state">
                <div className="prophecy-state-icon">
                  <Flame size={25} />
                </div>

                <h3>Unable to load studies</h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredStudies.length === 0 ? (
              <div className="prophecy-state">
                <div className="prophecy-state-icon">
                  <BookOpen size={25} />
                </div>

                <h3>No studies found</h3>

                <p>
                  There are currently no published studies in
                  this category.
                </p>

                {activeTheme !== "All" && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setActiveTheme("All")}
                  >
                    View All Studies
                  </button>
                )}
              </div>
            ) : (
              <div className="prophecy-study-grid">
                {filteredStudies.map((study) => {
                  const imageUrl = getImageUrl(
                    study.featured_image
                  );

                  const hasImage =
                    imageUrl && !imageErrors[study.id];

                  return (
                    <article
                      className="prophecy-study-card"
                      key={study.id}
                    >
                      <div className="prophecy-study-media">
                        {hasImage ? (
                          <img
                            src={imageUrl}
                            alt={study.title}
                            loading="lazy"
                            onError={() =>
                              handleImageError(study.id)
                            }
                          />
                        ) : (
                          <div className="prophecy-study-placeholder">
                            {getCategoryIcon(study.category)}
                          </div>
                        )}

                        <span className="prophecy-study-badge">
                          {study.category ||
                            "BIBLICAL PROPHECY"}
                        </span>
                      </div>

                      <div className="prophecy-study-body">
                        <div className="prophecy-study-icon">
                          {getCategoryIcon(study.category)}
                        </div>

                        <h3>{study.title}</h3>

                        {study.description && (
                          <p>{study.description}</p>
                        )}

                        <div className="prophecy-study-bottom">
                          <span className="prophecy-reading-time">
                            <Clock3 size={14} />
                            {getReadingTime(study.content)}
                          </span>

                          <Link
                            to={`/prophecy/${study.slug}`}
                            className="prophecy-study-link"
                          >
                            Explore
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            TOPICS
            ===================================================== */}
        {!loading && !error && themes.length > 0 && (
          <section className="section prophecy-themes-section">
            <div className="container">
              <div className="prophecy-themes-heading">
                <span className="section-label">
                  EXPLORE TOPICS
                </span>

                <h2>
                  Choose a topic
                  <em> to continue.</em>
                </h2>

                <p>
                  Filter the prophecy library by its published
                  categories.
                </p>
              </div>

              <div className="prophecy-themes-grid">
                <button
                  type="button"
                  className={`prophecy-theme-card ${
                    activeTheme === "All" ? "active" : ""
                  }`}
                  onClick={() => handleThemeClick("All")}
                >
                  <span className="prophecy-theme-number">
                    ALL
                  </span>

                  <div>
                    <h3>All Studies</h3>
                    <small>{studies.length} studies</small>
                  </div>

                  <ArrowRight size={17} />
                </button>

                {themes.map((theme, index) => {
                  const count = studies.filter(
                    (study) =>
                      study.category?.trim() === theme
                  ).length;

                  return (
                    <button
                      type="button"
                      className={`prophecy-theme-card ${
                        activeTheme === theme ? "active" : ""
                      }`}
                      key={theme}
                      onClick={() =>
                        handleThemeClick(theme)
                      }
                    >
                      <span className="prophecy-theme-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <h3>{theme}</h3>
                        <small>
                          {count}{" "}
                          {count === 1 ? "study" : "studies"}
                        </small>
                      </div>

                      <ArrowRight size={17} />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            VIDEO
            ===================================================== */}
        <section className="section prophecy-video-section">
          <div className="container">
            <div className="prophecy-video-card">
              <div className="prophecy-video-content">
                <span className="section-label">
                  WATCH & LEARN
                </span>

                <h2>
                  Take your study
                  <em> beyond the page.</em>
                </h2>

                <p>
                  Watch Bible-focused lessons that help bring
                  prophetic themes, symbols, and passages into
                  clearer focus.
                </p>

                <Link
                  to="/videos"
                  className="btn btn-primary"
                >
                  <Play
                    size={16}
                    fill="currentColor"
                  />
                  Explore Videos
                </Link>
              </div>

              <div className="prophecy-video-visual">
                <div className="prophecy-video-pattern" />

                <Link
                  to="/videos"
                  className="prophecy-video-play"
                  aria-label="Explore prophecy videos"
                >
                  <Play
                    size={25}
                    fill="currentColor"
                  />
                </Link>

                <div className="prophecy-video-label">
                  <span>VIDEO LIBRARY</span>
                  <strong>Bible-focused visual lessons</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
            ===================================================== */}
        <section className="section prophecy-final-section">
          <div className="container">
            <div className="prophecy-final-content">
              <div className="prophecy-final-icon">
                <Star size={19} />
              </div>

              <span className="section-label">
                KEEP SEARCHING
              </span>

              <h2>
                “Blessed is the one who reads
                <em> and those who hear.”</em>
              </h2>

              <p>
                Continue studying, asking questions, and
                searching Scripture with an open heart and
                a thoughtful mind.
              </p>

              <Link
                to="/bible-studies"
                className="btn btn-primary"
              >
                Explore Bible Studies
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Prophecy;