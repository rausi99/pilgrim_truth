import { useState } from "react";
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

function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const categories = [
    "All Articles",
    "Bible & Theology",
    "Prophecy",
    "Bible History",
    "Christian Living",
    "Health",
  ];

  const articles = [
    {
      slug: "context-matters-scripture",
      category: "Bible & Theology",
      title: "Why Context Matters When Reading Scripture",
      description:
        "Explore how literary, historical, and biblical context can help us read Scripture more carefully.",
      duration: "9 min read",
      icon: BookOpen,
    },
    {
      slug: "approach-biblical-prophecy",
      category: "Prophecy",
      title: "How Should We Approach Biblical Prophecy?",
      description:
        "Consider foundational principles for studying prophetic passages without losing their wider biblical context.",
      duration: "12 min read",
      icon: Flame,
    },
    {
      slug: "world-behind-the-bible",
      category: "Bible History",
      title: "Understanding the World Behind the Bible",
      description:
        "Discover how geography, culture, kingdoms, and historical settings can illuminate the biblical narrative.",
      duration: "11 min read",
      icon: History,
    },
    {
      slug: "faith-ordinary-life",
      category: "Christian Living",
      title: "Faith in the Ordinary Moments of Life",
      description:
        "Reflect on how biblical faith can influence everyday decisions, relationships, and responsibilities.",
      duration: "8 min read",
      icon: Heart,
    },
    {
      slug: "sustainable-healthy-habits",
      category: "Health",
      title: "Building Sustainable Healthy Habits",
      description:
        "Explore practical principles for developing balanced habits around food, movement, rest, and wellbeing.",
      duration: "10 min read",
      icon: Sparkles,
    },
    {
      slug: "search-the-scriptures",
      category: "Bible & Theology",
      title: "Learning to Search the Scriptures",
      description:
        "Discover a thoughtful approach to asking questions, comparing passages, and growing through Bible study.",
      duration: "7 min read",
      icon: BookOpen,
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "All Articles" ||
      article.category === activeCategory;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      query === "" ||
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const popularTopics = [
    "Bible Study",
    "Biblical Prophecy",
    "Christian Faith",
    "Bible History",
    "Prayer",
    "Healthy Living",
  ];

  return (
    <div className="inner-page articles-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="articles-page-hero">
          <div className="container articles-hero-content">
            <span className="section-label">
              PILGRIM TRUTH ARTICLES
            </span>

            <h1>
              Ideas worth exploring.
              <em>Truth worth studying.</em>
            </h1>

            <p>
              Read thoughtful articles exploring Scripture, prophecy, history,
              Christian living, health, and questions of faith.
            </p>

            <div className="articles-search">
              <Search size={19} />

              <input
                id="article-search"
                name="articleSearch"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder="Search articles..."
                aria-label="Search articles"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLE */}
        <section className="section featured-article">
          <div className="container">
            <div className="featured-article-card">
              <div className="featured-article-visual">
                <div className="featured-article-badge">
                  <Sparkles size={16} />
                  FEATURED ARTICLE
                </div>

                <div className="featured-article-visual-text">
                  <span>SEEK • STUDY • UNDERSTAND</span>
                  <strong>Scripture in Context</strong>
                </div>
              </div>

              <div className="featured-article-content">
                <span className="section-label">
                  EDITOR'S FEATURE
                </span>

                <h2>
                  Reading Scripture with
                  <em>care and context.</em>
                </h2>

                <p>
                  The Bible contains many different books, writers, settings,
                  literary styles, and historical periods. Understanding those
                  contexts can help us approach Scripture with greater care.
                </p>

                <div className="featured-article-meta">
                  <span>
                    <Clock3 size={15} />
                    10 min read
                  </span>

                  <span>
                    <Tag size={15} />
                    Bible Study
                  </span>
                </div>

                <Link
                  to="/articles/context-matters-scripture"
                  className="btn btn-primary"
                >
                  Read Featured Article
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="articles-filter-section">
          <div className="container">
            <div className="articles-filter">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`article-filter-button ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveCategory(category);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ARTICLES */}
        <section
          className="section latest-articles"
          id="latest-articles"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">
                  LATEST ARTICLES
                </span>

                <h2>Keep exploring.</h2>

                <p>
                  Fresh perspectives and thoughtful resources for your
                  continued journey.
                </p>
              </div>

              <div>
                <strong>{filteredArticles.length}</strong>{" "}
                {filteredArticles.length === 1
                  ? "article"
                  : "articles"}
              </div>
            </div>

            <div className="articles-grid">
              {filteredArticles.map((article) => {
                const Icon = article.icon;

                return (
                  <article
                    className="article-card"
                    key={article.slug}
                  >
                    <div className="article-card-icon">
                      <Icon size={20} />
                    </div>

                    <span className="article-card-category">
                      {article.category}
                    </span>

                    <h3>{article.title}</h3>

                    <p>{article.description}</p>

                    <div className="article-card-bottom">
                      <span>
                        <Clock3 size={14} />
                        {article.duration}
                      </span>

                      <Link
                        to={`/articles/${article.slug}`}
                        className="article-read-link"
                      >
                        Read
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredArticles.length === 0 && (
              <div className="articles-no-results">
                <Search size={32} />

                <h3>No articles found</h3>

                <p>
                  No articles match your search. Try another keyword or
                  category.
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All Articles");
                  }}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* POPULAR TOPICS */}
        <section className="section popular-topics">
          <div className="container popular-topics-grid">
            <div>
              <span className="section-label">
                POPULAR TOPICS
              </span>

              <h2>
                Follow a topic
                <em>that interests you.</em>
              </h2>

              <p>
                Explore articles by theme and continue learning at your own
                pace.
              </p>
            </div>

            <div className="popular-topic-list">
              {popularTopics.map((topic, index) => (
                <a
                  href="#latest-articles"
                  className="popular-topic"
                  key={topic}
                >
                  <span>0{index + 1}</span>

                  <strong>{topic}</strong>

                  <ArrowRight size={17} />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="section articles-newsletter">
          <div className="container articles-newsletter-content">
            <span className="section-label">
              STAY CONNECTED
            </span>

            <h2>
              New articles.
              <em>Delivered to you.</em>
            </h2>

            <p>
              Join the Pilgrim Truth newsletter for new studies, articles,
              resources, and updates.
            </p>

            <form
              className="articles-newsletter-form"
              onSubmit={(event) => event.preventDefault()}
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
                <ArrowRight size={16} />
              </button>
            </form>

            <small>
              We respect your privacy. You can unsubscribe at any time.
            </small>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Articles;