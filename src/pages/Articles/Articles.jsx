import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BookOpen,
  Clock3,
  Flame,
  Heart,
  History,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Articles.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* =========================================================
   HELPERS
   ========================================================= */

function getReadingTime(content = "") {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = plainText
    .split(" ")
    .filter(Boolean).length;

  return wordCount
    ? Math.max(1, Math.ceil(wordCount / 200))
    : 5;
}

function getCategoryIcon(category = "") {
  const value = category.toLowerCase();

  if (value.includes("prophecy")) {
    return Flame;
  }

  if (value.includes("history")) {
    return History;
  }

  if (value.includes("living")) {
    return Heart;
  }

  if (value.includes("health")) {
    return Sparkles;
  }

  return BookOpen;
}

/* =========================================================
   PAGE
   ========================================================= */

function Articles() {
  const [articles, setArticles] = useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All Articles");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* -------------------------------------------------------
     CATEGORIES
     ------------------------------------------------------- */

  const categories = [
    "All Articles",
    "Bible & Theology",
    "Prophecy",
    "Bible History",
    "Christian Living",
    "Health",
  ];

  /* -------------------------------------------------------
     FETCH ARTICLES
     ------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/articles`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load articles."
          );
        }

        if (cancelled) {
          return;
        }

        const formattedArticles =
          (data.articles || []).map(
            (article) => ({
              ...article,

              duration: `${getReadingTime(
                article.content
              )} min read`,

              icon: getCategoryIcon(
                article.category
              ),
            })
          );

        setArticles(formattedArticles);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Articles fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load articles."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------------------------------------
     FEATURED ARTICLE
     ------------------------------------------------------- */

  const featuredArticle = useMemo(() => {
    return (
      articles.find(
        (article) => article.is_featured
      ) ||
      articles[0] ||
      null
    );
  }, [articles]);

  /* -------------------------------------------------------
     FILTER ARTICLES
     ------------------------------------------------------- */

  const filteredArticles = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All Articles" ||
        article.category === activeCategory;

      const searchableText = [
        article.title,
        article.description,
        article.category,
        article.content,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    articles,
    activeCategory,
    searchQuery,
  ]);

  /* -------------------------------------------------------
     POPULAR TOPICS
     ------------------------------------------------------- */

  const popularTopics = [
    {
      label: "Bible Study",
      category: "Bible & Theology",
    },
    {
      label: "Biblical Prophecy",
      category: "Prophecy",
    },
    {
      label: "Christian Faith",
      category: "Christian Living",
    },
    {
      label: "Bible History",
      category: "Bible History",
    },
    {
      label: "Prayer",
      category: "Christian Living",
    },
    {
      label: "Healthy Living",
      category: "Health",
    },
  ];

  /* -------------------------------------------------------
     HANDLERS
     ------------------------------------------------------- */

  const handleCategoryChange = (
    category
  ) => {
    setActiveCategory(category);
  };

  const handleTopicClick = (
    category
  ) => {
    setActiveCategory(category);

    window.setTimeout(() => {
      document
        .getElementById(
          "latest-articles"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All Articles");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="inner-page articles-page">
      <Navbar />

      <main>

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="articles-page-hero">

          <div className="articles-hero-background" />

          <div className="articles-hero-overlay" />

          <div className="container articles-hero-content">

            <span className="section-label">
              PILGRIM TRUTH ARTICLES
            </span>

            <h1>
              Ideas worth exploring.
              <em>
                Truth worth studying.
              </em>
            </h1>

            <p>
              Explore thoughtful articles on
              Scripture, prophecy, Bible history,
              Christian living, health, and
              questions of faith.
            </p>

            {/* SEARCH */}

            <div className="articles-search">

              <Search
                size={19}
                strokeWidth={2}
              />

              <input
                id="article-search"
                name="articleSearch"
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search articles..."
                aria-label="Search articles"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* HERO STATS */}

            <div className="articles-hero-stats">

              <div>
                <strong>
                  {articles.length}
                </strong>

                <span>
                  Published Articles
                </span>
              </div>

              <div>
                <strong>
                  {categories.length - 1}
                </strong>

                <span>
                  Study Categories
                </span>
              </div>

              <div>
                <strong>
                  Scripture
                </strong>

                <span>
                  At the Center
                </span>
              </div>

            </div>

          </div>
        </section>


        {/* ===================================================
            FEATURED ARTICLE
            =================================================== */}

        {!loading &&
          !error &&
          featuredArticle && (
            <section className="section featured-article">

              <div className="container">

                <div className="featured-article-card">

                  {/* IMAGE */}

                  <div className="featured-article-visual">

                    {featuredArticle.featured_image ? (
                      <img
                        src={
                          featuredArticle.featured_image
                        }
                        alt={
                          featuredArticle.title
                        }
                      />
                    ) : (
                      <div className="featured-article-placeholder">
                        <BookOpen
                          size={42}
                        />
                      </div>
                    )}

                    <div className="featured-article-overlay" />

                    <div className="featured-article-badge">
                      <Sparkles size={14} />
                      FEATURED ARTICLE
                    </div>

                    <div className="featured-article-visual-text">

                      <span>
                        SEEK • STUDY • UNDERSTAND
                      </span>

                      <strong>
                        {featuredArticle.title}
                      </strong>

                    </div>

                  </div>


                  {/* CONTENT */}

                  <div className="featured-article-content">

                    <span className="section-label">
                      EDITOR'S FEATURE
                    </span>

                    <h2>
                      {featuredArticle.title}
                    </h2>

                    {featuredArticle.description && (
                      <p>
                        {
                          featuredArticle.description
                        }
                      </p>
                    )}

                    <div className="featured-article-meta">

                      <span>
                        <Clock3
                          size={14}
                        />

                        {
                          featuredArticle.duration
                        }
                      </span>

                      {featuredArticle.category && (
                        <span>
                          <Tag size={14} />

                          {
                            featuredArticle.category
                          }
                        </span>
                      )}

                    </div>

                    <Link
                      to={`/articles/${featuredArticle.slug}`}
                      className="btn btn-primary"
                    >
                      Read Featured Article

                      <ArrowRight
                        size={16}
                      />
                    </Link>

                  </div>

                </div>

              </div>

            </section>
          )}


        {/* ===================================================
            CATEGORY FILTER
            =================================================== */}

        <section className="articles-filter-section">

          <div className="container">

            <div className="articles-filter-header">

              <div>
                <span className="section-label">
                  EXPLORE BY TOPIC
                </span>

                <h2>
                  Find something meaningful.
                </h2>
              </div>

              {(searchQuery ||
                activeCategory !==
                  "All Articles") && (
                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={
                    clearFilters
                  }
                >
                  Clear filters
                  <X size={14} />
                </button>
              )}

            </div>


            <div className="articles-filter">

              {categories.map(
                (category) => (
                  <button
                    type="button"
                    key={category}
                    className={`article-filter-button ${
                      activeCategory ===
                      category
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleCategoryChange(
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


        {/* ===================================================
            LATEST ARTICLES
            =================================================== */}

        <section
          className="section latest-articles"
          id="latest-articles"
        >

          <div className="container">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  {searchQuery
                    ? "SEARCH RESULTS"
                    : activeCategory ===
                      "All Articles"
                    ? "LATEST ARTICLES"
                    : activeCategory.toUpperCase()}
                </span>

                <h2>
                  {searchQuery
                    ? "Articles matching your search."
                    : "Keep exploring."}
                </h2>

                <p>
                  {searchQuery
                    ? `Showing results for “${searchQuery}”.`
                    : "Fresh perspectives and thoughtful resources for your continued journey."}
                </p>

              </div>


              {!loading &&
                !error && (
                  <div className="article-count">

                    <strong>
                      {
                        filteredArticles.length
                      }
                    </strong>

                    <span>
                      {filteredArticles.length ===
                      1
                        ? "article"
                        : "articles"}
                    </span>

                  </div>
                )}

            </div>


            {/* ===============================================
                LOADING
                =============================================== */}

            {loading && (
              <div className="articles-grid">

                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    className="article-skeleton-card"
                    key={index}
                  >
                    <div className="article-skeleton-icon" />

                    <div className="article-skeleton-line small" />

                    <div className="article-skeleton-line" />

                    <div className="article-skeleton-line" />

                    <div className="article-skeleton-line medium" />

                    <div className="article-skeleton-footer" />
                  </div>
                ))}

              </div>
            )}


            {/* ===============================================
                ERROR
                =============================================== */}

            {!loading && error && (
              <div className="articles-state">

                <div className="articles-state-icon error">
                  <X size={22} />
                </div>

                <h3>
                  Unable to load articles
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    handleRetry
                  }
                >
                  Try Again
                </button>

              </div>
            )}


            {/* ===============================================
                ARTICLES
                =============================================== */}

            {!loading &&
              !error &&
              filteredArticles.length >
                0 && (
                <div className="articles-grid">

                  {filteredArticles.map(
                    (article) => {
                      const Icon =
                        article.icon ||
                        BookOpen;

                      return (
                        <article
                          className="article-card"
                          key={
                            article.slug ||
                            article.id
                          }
                        >

                          <div className="article-card-top">

                            <div className="article-card-icon">
                              <Icon
                                size={19}
                                strokeWidth={
                                  1.8
                                }
                              />
                            </div>

                            {article.is_featured && (
                              <span className="article-featured-label">
                                Featured
                              </span>
                            )}

                          </div>


                          {article.category && (
                            <span className="article-card-category">
                              {
                                article.category
                              }
                            </span>
                          )}


                          <h3>
                            {
                              article.title
                            }
                          </h3>


                          {article.description && (
                            <p>
                              {
                                article.description
                              }
                            </p>
                          )}


                          <div className="article-card-bottom">

                            <span>
                              <Clock3
                                size={13}
                              />

                              {
                                article.duration
                              }
                            </span>


                            <Link
                              to={`/articles/${article.slug}`}
                              className="article-read-link"
                            >
                              Read

                              <ArrowRight
                                size={15}
                              />
                            </Link>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>
              )}


            {/* ===============================================
                EMPTY
                =============================================== */}

            {!loading &&
              !error &&
              filteredArticles.length ===
                0 && (
                <div className="articles-state">

                  <div className="articles-state-icon">
                    <Search size={22} />
                  </div>

                  <h3>
                    No articles found
                  </h3>

                  <p>
                    No articles match your
                    current search or category.
                    Try another keyword or
                    choose a different topic.
                  </p>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>

                </div>
              )}

          </div>

        </section>


        {/* ===================================================
            POPULAR TOPICS
            =================================================== */}

        <section className="section popular-topics">

          <div className="container popular-topics-grid">

            <div className="popular-topics-intro">

              <span className="section-label">
                POPULAR TOPICS
              </span>

              <h2>
                Follow a topic
                <em>
                  that interests you.
                </em>
              </h2>

              <p>
                Explore articles by theme
                and continue learning at
                your own pace.
              </p>

            </div>


            <div className="popular-topic-list">

              {popularTopics.map(
                (topic, index) => (
                  <button
                    type="button"
                    className={`popular-topic ${
                      activeCategory ===
                      topic.category
                        ? "active"
                        : ""
                    }`}
                    key={topic.label}
                    onClick={() =>
                      handleTopicClick(
                        topic.category
                      )
                    }
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <strong>
                      {topic.label}
                    </strong>

                    <ArrowRight
                      size={16}
                    />

                  </button>
                )
              )}

            </div>

          </div>

        </section>


        {/* ===================================================
            NEWSLETTER
            =================================================== */}

        <section className="section articles-newsletter">

          <div className="container articles-newsletter-content">

            <span className="section-label">
              STAY CONNECTED
            </span>

            <h2>
              New articles.
              <em>
                Delivered to you.
              </em>
            </h2>

            <p>
              Join the Pilgrim Truth
              newsletter for new studies,
              articles, resources, and
              updates.
            </p>

            <form
              className="articles-newsletter-form"
              onSubmit={(event) =>
                event.preventDefault()
              }
            >

              <input
                id="newsletter-email"
                name="email"
                type="email"
                placeholder="Your email address"
                aria-label="Your email address"
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                Subscribe

                <ArrowRight
                  size={16}
                />
              </button>

            </form>

            <small>
              We respect your privacy.
              You can unsubscribe at any
              time.
            </small>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Articles;