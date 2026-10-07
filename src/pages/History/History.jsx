import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Globe2,
  Landmark,
  Map,
  Users,
  RefreshCw,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./History.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categoryIcons = {
  "Biblical Places": Map,
  "People of the Bible": Users,
  "Kingdoms & Empires": Landmark,
  "Cultures & Context": Globe2,
};

function getCategoryIcon(category) {
  return categoryIcons[category] || BookOpen;
}

function getReadingTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  if (!words) return 5;

  return Math.max(1, Math.ceil(words / 200));
}

function getImageUrl(image) {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    const backendUrl = API_URL.replace("/api", "");
    return `${backendUrl}${image}`;
  }

  return image;
}

function History() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const loadHistories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/content/public/history`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load History studies."
        );
      }

      setHistories(data.histories || []);
    } catch (err) {
      console.error("Load History studies error:", err);

      setError(
        err.message || "Unable to load History studies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistories();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        histories
          .map((study) => study.category?.trim())
          .filter(Boolean)
      ),
    ];

    return uniqueCategories.map((category) => ({
      title: category,
      description:
        "Explore historical background, people, places, kingdoms, and cultural context connected to Scripture.",
      icon: getCategoryIcon(category),
      count: histories.filter(
        (study) => study.category?.trim() === category
      ).length,
    }));
  }, [histories]);

  const filteredStudies = useMemo(() => {
    if (activeCategory === "All") {
      return histories;
    }

    return histories.filter(
      (study) =>
        study.category?.trim() === activeCategory
    );
  }, [histories, activeCategory]);

  const featuredStudy = useMemo(() => {
    return histories.find(
      (study) => study.is_featured
    );
  }, [histories]);

  const displayStudies = useMemo(() => {
    if (
      activeCategory === "All" &&
      featuredStudy
    ) {
      return filteredStudies.filter(
        (study) => study.id !== featuredStudy.id
      );
    }

    return filteredStudies;
  }, [activeCategory, filteredStudies, featuredStudy]);

  useEffect(() => {
    if (
      activeCategory !== "All" &&
      !categories.some(
        (category) =>
          category.title === activeCategory
      )
    ) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  const totalStudies = histories.length;

  return (
    <div className="inner-page history-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="history-page-hero">
          <div className="history-hero-pattern"></div>

          <div className="container history-hero-content">
            <div className="history-hero-copy">
              <span className="section-label">
                BIBLE HISTORY
              </span>

              <h1>
                Discover the world
                <em> behind Scripture.</em>
              </h1>

              <p>
                Explore the people, places, cultures,
                kingdoms, and historical events that provide
                context for understanding the biblical story.
              </p>

              <div className="history-hero-actions">
                <a
                  href="#history-studies"
                  className="btn btn-primary"
                >
                  Explore studies
                  <ArrowRight size={17} />
                </a>

                <a
                  href="#history-timeline"
                  className="btn btn-ghost"
                >
                  View timeline
                </a>
              </div>
            </div>

            <div className="history-hero-panel">
              <div className="history-hero-panel-top">
                <span className="history-hero-panel-icon">
                  <BookOpen size={22} />
                </span>

                <span>Historical Study</span>
              </div>

              <div className="history-hero-panel-number">
                {totalStudies}
              </div>

              <strong>
                Published studies
              </strong>

              <p>
                Explore historical context connected to
                the biblical narrative.
              </p>

              <div className="history-hero-panel-line"></div>

              <div className="history-hero-panel-meta">
                <span>
                  <Map size={15} />
                  Places
                </span>

                <span>
                  <Users size={15} />
                  People
                </span>

                <span>
                  <Globe2 size={15} />
                  Culture
                </span>
              </div>
            </div>
          </div>

          <div className="history-hero-stats">
            <div className="container history-hero-stats-grid">
              <div>
                <strong>Places</strong>
                <span>Biblical geography</span>
              </div>

              <div>
                <strong>People</strong>
                <span>Stories & lives</span>
              </div>

              <div>
                <strong>Kingdoms</strong>
                <span>Nations & empires</span>
              </div>

              <div>
                <strong>Context</strong>
                <span>History & culture</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="section history-intro">
          <div className="container history-intro-grid">
            <div className="history-intro-heading">
              <span className="section-label">
                WHY HISTORY MATTERS
              </span>

              <h2>
                Context can help us
                <span> understand Scripture.</span>
              </h2>
            </div>

            <div className="history-intro-text">
              <p>
                The Bible was written within real places,
                cultures, societies, and historical periods.
                Understanding that setting can provide
                valuable context for the people and events
                described in Scripture.
              </p>

              <p>
                Pilgrim Truth explores biblical history as a
                way of providing useful background for
                thoughtful Bible study.
              </p>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section history-categories">
          <div className="container">
            <div className="section-heading history-section-heading">
              <div>
                <span className="section-label">
                  EXPLORE HISTORY
                </span>

                <h2>Start with a category.</h2>

                <p>
                  Explore different aspects of the world
                  surrounding the biblical narrative.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="history-state">
                <RefreshCw
                  size={22}
                  className="history-spinner"
                />
                <span>
                  Loading History categories...
                </span>
              </div>
            ) : error ? (
              <div className="history-state history-state-error">
                <BookOpen size={23} />

                <div>
                  <strong>
                    Unable to load History
                  </strong>

                  <p>{error}</p>
                </div>

                <button
                  type="button"
                  onClick={loadHistories}
                  className="history-retry-button"
                >
                  Try again
                </button>
              </div>
            ) : categories.length === 0 ? (
              <div className="history-empty">
                <div className="history-empty-icon">
                  <BookOpen size={25} />
                </div>

                <h3>
                  History studies are coming soon.
                </h3>

                <p>
                  New historical studies will appear here
                  once they are published.
                </p>
              </div>
            ) : (
              <div className="history-category-grid">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive =
                    activeCategory === category.title;

                  return (
                    <button
                      type="button"
                      className={`history-category-card ${
                        isActive ? "active" : ""
                      }`}
                      key={category.title}
                      onClick={() =>
                        setActiveCategory(
                          isActive
                            ? "All"
                            : category.title
                        )
                      }
                    >
                      <div className="history-category-top">
                        <div className="history-category-icon">
                          <Icon size={21} />
                        </div>

                        <span className="history-category-count">
                          {category.count}
                        </span>
                      </div>

                      <h3>{category.title}</h3>

                      <p>{category.description}</p>

                      <span className="history-category-link">
                        {isActive
                          ? "Showing studies"
                          : "Explore category"}

                        <ArrowRight size={15} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* STUDIES */}
        <section
          className="section history-studies"
          id="history-studies"
        >
          <div className="container">
            <div className="section-heading history-section-heading">
              <div>
                <span className="section-label">
                  {activeCategory === "All"
                    ? "HISTORY STUDIES"
                    : activeCategory.toUpperCase()}
                </span>

                <h2>
                  {activeCategory === "All"
                    ? "Explore biblical history."
                    : `Explore ${activeCategory}.`}
                </h2>

                <p>
                  Discover historical background that can
                  enrich your study of Scripture.
                </p>
              </div>

              {activeCategory !== "All" && (
                <button
                  type="button"
                  className="section-heading-link"
                  onClick={() =>
                    setActiveCategory("All")
                  }
                >
                  View all studies
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="history-state">
                <RefreshCw
                  size={22}
                  className="history-spinner"
                />

                <span>
                  Loading History studies...
                </span>
              </div>
            ) : error ? (
              <div className="history-state history-state-error">
                <BookOpen size={23} />

                <div>
                  <strong>
                    Unable to display History studies.
                  </strong>

                  <p>
                    Please try again in a moment.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadHistories}
                  className="history-retry-button"
                >
                  Try again
                </button>
              </div>
            ) : filteredStudies.length === 0 ? (
              <div className="history-empty">
                <div className="history-empty-icon">
                  <BookOpen size={25} />
                </div>

                <h3>No studies found.</h3>

                <p>
                  There are currently no published studies
                  in this category.
                </p>

                {activeCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveCategory("All")
                    }
                    className="btn btn-secondary"
                  >
                    View all studies
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* FEATURED */}
                {featuredStudy &&
                  activeCategory === "All" && (
                    <article className="history-featured-study">
                      {getImageUrl(
                        featuredStudy.featured_image
                      ) ? (
                        <div className="history-featured-image">
                          <img
                            src={getImageUrl(
                              featuredStudy.featured_image
                            )}
                            alt={featuredStudy.title}
                          />
                        </div>
                      ) : (
                        <div className="history-featured-image history-featured-placeholder">
                          <BookOpen size={48} />
                        </div>
                      )}

                      <div className="history-featured-content">
                        <span className="section-label">
                          FEATURED HISTORY
                        </span>

                        <h3>
                          {featuredStudy.title}
                        </h3>

                        <p>
                          {featuredStudy.description ||
                            "Explore this featured historical study and discover more context behind Scripture."}
                        </p>

                        <div className="history-featured-meta">
                          <span>
                            <BookOpen size={15} />
                            {featuredStudy.category}
                          </span>

                          <span>
                            <Clock3 size={15} />
                            {getReadingTime(
                              featuredStudy.content
                            )}{" "}
                            min read
                          </span>
                        </div>

                        <Link
                          to={`/history/${featuredStudy.slug}`}
                          className="btn btn-primary"
                        >
                          Read featured study
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  )}

                {/* STUDY GRID */}
                {displayStudies.length > 0 && (
                  <div className="history-study-grid">
                    {displayStudies.map((study) => (
                      <article
                        className="history-study-card"
                        key={study.id}
                      >
                        <div className="history-study-top">
                          <div className="history-study-icon">
                            <BookOpen size={19} />
                          </div>

                          <span>
                            {study.category}
                          </span>
                        </div>

                        <h3>{study.title}</h3>

                        <p>
                          {study.description ||
                            "Explore this historical study and discover more context behind Scripture."}
                        </p>

                        <div className="history-study-bottom">
                          <span>
                            <Clock3 size={14} />
                            {getReadingTime(
                              study.content
                            )}{" "}
                            min read
                          </span>

                          <Link
                            to={`/history/${study.slug}`}
                          >
                            Read study
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* TIMELINE */}
        <section
          className="section history-timeline"
          id="history-timeline"
        >
          <div className="container history-timeline-grid">
            <div className="history-timeline-heading">
              <span className="section-label">
                A JOURNEY THROUGH TIME
              </span>

              <h2>
                See the biblical story
                <em> in its historical setting.</em>
              </h2>

              <p>
                A future interactive timeline can connect
                major biblical events, people, places, and
                historical periods.
              </p>
            </div>

            <div className="timeline-preview">
              <div className="timeline-line"></div>

              <div className="timeline-item">
                <span>01</span>

                <div>
                  <strong>
                    Early Biblical History
                  </strong>

                  <p>
                    Origins, patriarchs, and the early
                    biblical narrative.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <span>02</span>

                <div>
                  <strong>
                    Israel's Kingdoms
                  </strong>

                  <p>
                    Israel, Judah, their kings, and
                    surrounding nations.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <span>03</span>

                <div>
                  <strong>
                    The Time of Jesus
                  </strong>

                  <p>
                    The political, cultural, and religious
                    world of the New Testament.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <span>04</span>

                <div>
                  <strong>
                    The Early Church
                  </strong>

                  <p>
                    The historical setting of the first
                    Christian communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section history-final">
          <div className="container history-final-content">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              History gives context.
              <em> Scripture gives the message.</em>
            </h2>

            <p>
              Continue your journey through Scripture by
              exploring Bible studies and biblical prophecy.
            </p>

            <div className="history-final-actions">
              <Link
                to="/bible-studies"
                className="btn btn-primary"
              >
                Bible Studies
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/prophecy"
                className="btn btn-secondary"
              >
                Explore Prophecy
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default History;
