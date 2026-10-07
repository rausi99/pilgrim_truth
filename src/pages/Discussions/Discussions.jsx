import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Flame,
  Heart,
  History,
  MessageCircle,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getDiscussions } from "../../services/discussions";
import { useAuth } from "../../context/AuthContext";
import "./Discussions.css";

function Discussions() {
  const { isAuthenticated } = useAuth();

  const [discussions, setDiscussions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDiscussions();

        setDiscussions(data.discussions || []);
      } catch (error) {
        console.error("Discussion loading error:", error);
        setError(
          error.message || "Unable to load discussions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDiscussions();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        discussions.map((discussion) => discussion.category)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [discussions]);

  const filteredDiscussions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return discussions.filter((discussion) => {
      const matchesCategory =
        activeCategory === "All" ||
        discussion.category === activeCategory;

      const matchesSearch =
        !query ||
        discussion.title.toLowerCase().includes(query) ||
        discussion.content.toLowerCase().includes(query) ||
        discussion.category.toLowerCase().includes(query) ||
        discussion.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [
    discussions,
    searchQuery,
    activeCategory,
  ]);

  const featuredDiscussions = filteredDiscussions.filter(
    (discussion) => discussion.is_featured
  );

  const regularDiscussions = filteredDiscussions.filter(
    (discussion) => !discussion.is_featured
  );

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Prophecy":
        return Flame;

      case "Bible History":
        return History;

      case "Christian Living":
        return Heart;

      case "Health":
        return Heart;

      case "Bible Study":
      default:
        return BookOpen;
    }
  };

  return (
    <>
      <Navbar />

      <main className="discussions-page">

        {/* HERO */}
        <section className="page-hero discussions-hero">
          <div className="container page-hero-content">

            <span className="section-label">
              PILGRIM TRUTH COMMUNITY
            </span>

            <h1>
              Thoughtful
              <em> conversations.</em>
            </h1>

            <p>
              Ask questions, explore Scripture, and
              engage in meaningful conversations with
              other seekers of truth.
            </p>

            <div className="discussions-hero-actions">
              {isAuthenticated ? (
                <Link
                  to="/discussions/new"
                  className="primary-button"
                >
                  Start a Discussion
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="primary-button"
                >
                  Sign In to Participate
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>

          </div>
        </section>

        {/* CONTENT */}
        <section className="section discussions-content">
          <div className="container">

            {/* HEADER */}
            <div className="discussions-toolbar">

              <div>
                <span className="section-label">
                  COMMUNITY DISCUSSIONS
                </span>

                <h2>
                  Explore the
                  <em> conversation.</em>
                </h2>
              </div>

              <div className="discussion-search">
                <Search size={17} />

                <input
                  id="discussion-search"
                  name="discussionSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search discussions..."
                />
              </div>

            </div>

            {/* CATEGORIES */}
            <div className="discussion-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    activeCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {/* ERROR */}
            {error && (
              <div className="discussions-message">
                <strong>Unable to load discussions.</strong>
                <p>{error}</p>
              </div>
            )}

            {/* LOADING */}
            {loading && !error && (
              <div className="discussions-message">
                <p>Loading discussions...</p>
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              !error &&
              filteredDiscussions.length === 0 && (
                <div className="discussions-message">
                  <MessageCircle size={30} />

                  <h3>
                    No discussions found
                  </h3>

                  <p>
                    Try another search or choose a
                    different category.
                  </p>
                </div>
              )}

            {/* FEATURED */}
            {!loading &&
              !error &&
              featuredDiscussions.length > 0 && (
                <div className="discussion-section">

                  <div className="discussion-section-heading">
                    <span className="section-label">
                      FEATURED
                    </span>

                    <h3>
                      Conversations worth
                      <em> exploring.</em>
                    </h3>
                  </div>

                  <div className="featured-discussions">
                    {featuredDiscussions.map(
                      (discussion) => {
                        const Icon = getCategoryIcon(
                          discussion.category
                        );

                        return (
                          <article
                            key={discussion.id}
                            className="featured-discussion-card"
                          >
                            <div className="discussion-card-top">

                              <span className="discussion-category">
                                <Icon size={15} />
                                {discussion.category}
                              </span>

                              <span className="discussion-featured">
                                Featured
                              </span>

                            </div>

                            <h3>
                              {discussion.title}
                            </h3>

                            <p>
                              {discussion.content}
                            </p>

                            <div className="discussion-card-bottom">

                              <div className="discussion-meta">
                                <span>
                                  {discussion.author}
                                </span>

                                <span>
                                  {formatDate(
                                    discussion.created_at
                                  )}
                                </span>

                                <span>
                                  {discussion.replies}{" "}
                                  {discussion.replies === 1
                                    ? "reply"
                                    : "replies"}
                                </span>
                              </div>

                              <Link
                                to={`/discussions/${discussion.id}`}
                                className="discussion-read-link"
                              >
                                View Discussion
                                <ChevronRight size={17} />
                              </Link>

                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>

                </div>
              )}

            {/* ALL DISCUSSIONS */}
            {!loading &&
              !error &&
              regularDiscussions.length > 0 && (
                <div className="discussion-section">

                  <div className="discussion-section-heading">
                    <span className="section-label">
                      DISCUSSION LIBRARY
                    </span>

                    <h3>
                      Recent
                      <em> conversations.</em>
                    </h3>
                  </div>

                  <div className="discussion-list">

                    {regularDiscussions.map(
                      (discussion) => {
                        const Icon = getCategoryIcon(
                          discussion.category
                        );

                        return (
                          <article
                            key={discussion.id}
                            className="discussion-list-card"
                          >

                            <div className="discussion-list-icon">
                              <Icon size={20} />
                            </div>

                            <div className="discussion-list-content">

                              <div className="discussion-list-category">
                                {discussion.category}
                              </div>

                              <h3>
                                {discussion.title}
                              </h3>

                              <p>
                                {discussion.content}
                              </p>

                              <div className="discussion-list-meta">
                                <span>
                                  {discussion.author}
                                </span>

                                <span>
                                  {formatDate(
                                    discussion.created_at
                                  )}
                                </span>

                                <span>
                                  {discussion.replies}{" "}
                                  {discussion.replies === 1
                                    ? "reply"
                                    : "replies"}
                                </span>
                              </div>

                            </div>

                            <Link
                              to={`/discussions/${discussion.id}`}
                              className="discussion-list-arrow"
                              aria-label={`View ${discussion.title}`}
                            >
                              <ChevronRight size={20} />
                            </Link>

                          </article>
                        );
                      }
                    )}

                  </div>

                </div>
              )}

            {/* COMMUNITY GUIDELINES */}
            <section className="discussion-guidelines">

              <div>
                <span className="section-label">
                  OUR COMMUNITY
                </span>

                <h2>
                  Seek truth with
                  <em> humility.</em>
                </h2>

                <p>
                  Pilgrim Truth is a place for thoughtful
                  questions, careful study, and respectful
                  conversation.
                </p>
              </div>

              <div className="guidelines-list">

                <div>
                  <strong>01</strong>
                  <span>
                    Keep conversations respectful.
                  </span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>
                    Support ideas with Scripture and
                    thoughtful reasoning.
                  </span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>
                    Ask honest questions and allow room
                    for sincere disagreement.
                  </span>
                </div>

              </div>

            </section>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

export default Discussions;