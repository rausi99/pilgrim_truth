import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  HeartPulse,
  Search,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Health.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const getImageUrl = (image) => {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const serverUrl = API_URL.replace(
    /\/api$/,
    ""
  );

  if (image.startsWith("/uploads")) {
    return `${serverUrl}${image}`;
  }

  return `${serverUrl}/${image.replace(
    /^\/+/,
    ""
  )}`;
};

const getExcerpt = (text, length = 150) => {
  if (!text) return "";

  const cleanText = text
    .replace(/<[^>]*>/g, "")
    .trim();

  if (cleanText.length <= length) {
    return cleanText;
  }

  return `${cleanText
    .substring(0, length)
    .trim()}...`;
};

function Health() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All");

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchHealth = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/health`,
          {
            signal: controller.signal,
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load health content."
          );
        }

        setStudies(data.studies || []);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error(
          "Health page error:",
          err
        );

        setError(
          "We could not load the health library right now."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHealth();

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const values = studies
      .map((study) => study.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(values),
    ];
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return studies.filter((study) => {
      const matchesCategory =
        activeCategory === "All" ||
        study.category ===
          activeCategory;

      const contentText =
        typeof study.content ===
        "string"
          ? study.content
          : "";

      const matchesSearch =
        !search ||
        study.title
          ?.toLowerCase()
          .includes(search) ||
        study.description
          ?.toLowerCase()
          .includes(search) ||
        study.category
          ?.toLowerCase()
          .includes(search) ||
        contentText
          .toLowerCase()
          .includes(search);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    studies,
    searchTerm,
    activeCategory,
  ]);

  const featuredStudy =
    filteredStudies.find(
      (study) => study.is_featured
    ) ||
    filteredStudies[0] ||
    null;

  const regularStudies =
    filteredStudies.filter(
      (study) =>
        study.id !== featuredStudy?.id
    );

  return (
    <div className="health-page">
      <Navbar />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="health-hero">
          {featuredStudy?.featured_image ? (
            <img
              className="health-hero-image"
              src={getImageUrl(
                featuredStudy.featured_image
              )}
              alt=""
            />
          ) : (
            <div className="health-hero-fallback" />
          )}

          <div className="health-hero-overlay" />

          <div className="health-container health-hero-content">
            <div className="health-hero-copy">
              <div className="health-eyebrow">
                <BookOpen size={16} />
                <span>
                  BIBLICAL HEALTH & WELLNESS
                </span>
              </div>

              <h1>
                Caring for the life
                <span>
                  {" "}
                  God has entrusted to us.
                </span>
              </h1>

              <p>
                Explore practical health
                principles through the wisdom
                of Scripture, thoughtful
                guidance, and a Christ-centered
                understanding of whole-person
                wellbeing.
              </p>

              <div className="health-hero-actions">
                <a
                  href="#health-library"
                  className="health-primary-button"
                >
                  Explore Health
                  <ArrowRight size={17} />
                </a>

                <div className="health-scripture">
                  <span>
                    “Beloved, I wish above all
                    things that thou mayest
                    prosper and be in health.”
                  </span>

                  <strong>
                    3 John 1:2
                  </strong>
                </div>
              </div>
            </div>

            <div className="health-hero-badge">
              <div className="health-hero-badge-icon">
                <HeartPulse size={25} />
              </div>

              <div>
                <strong>
                  Whole-Person Care
                </strong>

                <span>
                  Body · Mind · Spirit
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section className="health-intro">
          <div className="health-container health-intro-grid">
            <div>
              <span className="health-section-label">
                A CHRIST-CENTERED VIEW
              </span>

              <h2>
                Health is part of
                <span>
                  {" "}
                  faithful living.
                </span>
              </h2>
            </div>

            <div className="health-intro-copy">
              <p>
                Scripture reminds us that our
                lives belong to God. Caring for
                our bodies, cultivating a healthy
                mind, and nurturing our spiritual
                life can all form part of a
                faithful Christian walk.
              </p>

              <p>
                Our health library brings these
                ideas together in accessible
                articles designed to encourage
                wisdom, balance, and practical
                application.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="health-topics">
          <div className="health-container">
            <div className="health-section-heading">
              <div>
                <span className="health-section-label">
                  EXPLORE TOPICS
                </span>

                <h2>
                  Health for everyday life
                </h2>
              </div>

              <Stethoscope size={30} />
            </div>

            <div className="health-category-list">
              {categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory ===
                      category
                        ? "health-category active"
                        : "health-category"
                    }
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            LIBRARY
        ===================================================== */}

        <section
          className="health-library"
          id="health-library"
        >
          <div className="health-container">
            <div className="health-library-header">
              <div>
                <span className="health-section-label">
                  HEALTH LIBRARY
                </span>

                <h2>
                  Practical wisdom for
                  healthy living
                </h2>
              </div>

              <div className="health-search">
                <Search size={18} />

                <input
                  type="search"
                  placeholder="Search health articles..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="health-state">
                <div className="health-loader" />

                <p>
                  Loading health
                  resources...
                </p>
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="health-state health-state-error">
                <p>{error}</p>
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              filteredStudies.length ===
                0 && (
                <div className="health-state">
                  <BookOpen size={34} />

                  <h3>
                    No health resources
                    found
                  </h3>

                  <p>
                    Try another search or
                    choose a different
                    category.
                  </p>
                </div>
              )}

            {/* CONTENT */}

            {!loading &&
              !error &&
              featuredStudy && (
                <>
                  {/* FEATURED */}

                  <article className="health-featured">
                    <div className="health-featured-image">
                      {featuredStudy.featured_image ? (
                        <img
                          src={getImageUrl(
                            featuredStudy.featured_image
                          )}
                          alt={
                            featuredStudy.title
                          }
                        />
                      ) : (
                        <div className="health-image-placeholder">
                          <BookOpen size={42} />
                        </div>
                      )}

                      <span className="health-featured-tag">
                        Featured
                      </span>
                    </div>

                    <div className="health-featured-content">
                      <span className="health-card-category">
                        {
                          featuredStudy.category
                        }
                      </span>

                      <h3>
                        {
                          featuredStudy.title
                        }
                      </h3>

                      {featuredStudy.scripture_reference && (
                        <div className="health-card-scripture">
                          <BookOpen size={16} />

                          {
                            featuredStudy.scripture_reference
                          }
                        </div>
                      )}

                      <p>
                        {getExcerpt(
                          featuredStudy.description ||
                            featuredStudy.content,
                          220
                        )}
                      </p>

                      <Link
                        to={`/health/${featuredStudy.slug}`}
                        className="health-text-link"
                      >
                        Read article
                        <ArrowRight
                          size={17}
                        />
                      </Link>
                    </div>
                  </article>

                  {/* GRID */}

                  {regularStudies.length >
                    0 && (
                    <div className="health-grid">
                      {regularStudies.map(
                        (study) => (
                          <article
                            className="health-card"
                            key={study.id}
                          >
                            <Link
                              to={`/health/${study.slug}`}
                              className="health-card-image"
                            >
                              {study.featured_image ? (
                                <img
                                  src={getImageUrl(
                                    study.featured_image
                                  )}
                                  alt={
                                    study.title
                                  }
                                />
                              ) : (
                                <div className="health-image-placeholder">
                                  <BookOpen
                                    size={32}
                                  />
                                </div>
                              )}
                            </Link>

                            <div className="health-card-content">
                              <span className="health-card-category">
                                {
                                  study.category
                                }
                              </span>

                              <h3>
                                <Link
                                  to={`/health/${study.slug}`}
                                >
                                  {
                                    study.title
                                  }
                                </Link>
                              </h3>

                              {study.scripture_reference && (
                                <span className="health-card-reference">
                                  {
                                    study.scripture_reference
                                  }
                                </span>
                              )}

                              <p>
                                {getExcerpt(
                                  study.description ||
                                    study.content,
                                  135
                                )}
                              </p>

                              <Link
                                to={`/health/${study.slug}`}
                                className="health-card-read"
                              >
                                Read more
                                <ArrowRight
                                  size={16}
                                />
                              </Link>
                            </div>
                          </article>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
          </div>
        </section>

        {/* =====================================================
            SCRIPTURE
        ===================================================== */}

        <section className="health-scripture-section">
          <div className="health-container">
            <div className="health-scripture-mark">
              <Sparkles size={19} />
            </div>

            <blockquote>
              “I beseech you therefore,
              brethren, by the mercies of God,
              that ye present your bodies a
              living sacrifice, holy,
              acceptable unto God.”
            </blockquote>

            <span>
              Romans 12:1
            </span>
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="health-cta">
          <div className="health-container health-cta-inner">
            <div>
              <span className="health-section-label">
                KEEP LEARNING
              </span>

              <h2>
                Discover more from
                Pilgrim Truth
              </h2>

              <p>
                Continue exploring Scripture,
                Christian living, Bible studies,
                history, prophecy, and practical
                faith.
              </p>
            </div>

            <Link
              to="/"
              className="health-primary-button"
            >
              Explore Pilgrim Truth
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Health;