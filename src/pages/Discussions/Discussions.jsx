import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Flame,
  Heart,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import discussions from "../../data/discussions";

function Discussions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Bible Study",
    "Prophecy",
    "Bible History",
    "Christian Living",
    "Health",
  ];

  const filteredDiscussions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return discussions.filter((discussion) => {
      const matchesCategory =
        activeCategory === "All" ||
        discussion.category === activeCategory;

      const matchesSearch =
        !query ||
        discussion.title.toLowerCase().includes(query) ||
        discussion.excerpt.toLowerCase().includes(query) ||
        discussion.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const featuredDiscussions = discussions.filter(
    (discussion) => discussion.featured
  );

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="inner-page discussions-page">
      <Navbar />

      <main>

        {/* HERO */}
        <section className="page-hero discussions-hero">
          <div className="container">

            <span className="section-label">
              PILGRIM TRUTH DISCUSSIONS
            </span>

            <h1>
              Ask questions.
              <em>Search together.</em>
            </h1>

            <p>
              Join thoughtful conversations about Scripture,
              prophecy, history, Christian living, and the
              questions that help us grow.
            </p>

            <div className="discussion-search-wrapper">
              <div className="page-search">
                <Search size={19} />

                <input
                  id="discussion-search"
                  name="discussionSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search discussions..."
                  aria-label="Search discussions"
                  autoComplete="off"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="discussion-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear discussion search"
                  >
                    ×
                  </button>
                )}
              </div>

              {searchQuery.trim() && (
                <p className="discussion-search-results">
                  {filteredDiscussions.length}{" "}
                  {filteredDiscussions.length === 1
                    ? "discussion"
                    : "discussions"}{" "}
                  found for{" "}
                  <strong>"{searchQuery}"</strong>
                </p>
              )}
            </div>

            <div className="discussion-hero-actions">

              <a
                href="#discussion-library"
                className="btn btn-primary"
              >
                Explore Discussions
                <ArrowRight size={16} />
              </a>

              <button
                type="button"
                className="discussion-outline-button"
                onClick={() =>
                  alert(
                    "The discussion creation form will be connected when authentication is added."
                  )
                }
              >
                Start a Discussion
              </button>

            </div>

          </div>
        </section>


        {/* INTRO */}
        <section className="section discussions-intro-section">
          <div className="container">

            <div className="discussions-intro">

              <div className="discussions-intro-icon">
                <Users size={30} />
              </div>

              <div>
                <span className="section-label">
                  THE PILGRIM TRUTH COMMUNITY
                </span>

                <h2>
                  Thoughtful questions can lead
                  to deeper study.
                </h2>

                <p>
                  Discussions are designed to encourage respectful
                  questions, careful study, and meaningful
                  conversations around Scripture.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* FEATURED */}
        <section className="section discussions-featured-section">
          <div className="container">

            <div className="section-heading-row">
              <div>
                <span className="section-label">
                  FEATURED DISCUSSIONS
                </span>

                <h2>
                  Start with the conversation.
                </h2>
              </div>
            </div>

            <div className="featured-discussion-grid">

              {featuredDiscussions.map((discussion) => (
                <article
                  className="featured-discussion-card"
                  key={discussion.id}
                >

                  <span className="discussion-category">
                    {discussion.category}
                  </span>

                  <h3>{discussion.title}</h3>

                  <p>{discussion.excerpt}</p>

                  <div className="discussion-card-footer">
                    <span>
                      {discussion.replies} replies
                    </span>

                    <span>
                      {discussion.date}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="discussion-read-link"
                    onClick={() =>
                      alert(
                        "Discussion detail pages will be connected when the discussion system is built."
                      )
                    }
                  >
                    Join Discussion
                    <ArrowRight size={15} />
                  </button>

                </article>
              ))}

            </div>

          </div>
        </section>


        {/* DISCUSSION LIBRARY */}
        <section
          className="section discussions-library-section"
          id="discussion-library"
        >
          <div className="container">

            <div className="section-heading-row">

              <div>
                <span className="section-label">
                  DISCUSSION LIBRARY
                </span>

                <h2>
                  Explore the conversations.
                </h2>
              </div>

              <span className="discussions-count">
                {filteredDiscussions.length}{" "}
                {filteredDiscussions.length === 1
                  ? "discussion"
                  : "discussions"}
              </span>

            </div>


            {/* FILTERS */}
            <div className="discussion-filters">

              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "discussion-filter active"
                      : "discussion-filter"
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>
              ))}

            </div>


            {/* GRID */}
            {filteredDiscussions.length > 0 ? (
              <div className="discussion-grid">

                {filteredDiscussions.map((discussion) => (
                  <article
                    className="discussion-card"
                    key={discussion.id}
                  >

                    <div className="discussion-card-top">
                      <span className="discussion-card-category">
                        {discussion.category}
                      </span>

                      <MessageCircle size={18} />
                    </div>

                    <h3>{discussion.title}</h3>

                    <p>{discussion.excerpt}</p>

                    <div className="discussion-meta">
                      <span>
                        {discussion.author}
                      </span>

                      <span>
                        {discussion.replies} replies
                      </span>
                    </div>

                    <button
                      type="button"
                      className="discussion-card-link"
                      onClick={() =>
                        alert(
                          "Discussion detail pages will be connected later."
                        )
                      }
                    >
                      View Discussion
                      <ArrowRight size={15} />
                    </button>

                  </article>
                ))}

              </div>
            ) : (
              <div className="discussions-empty-state">

                <h3>
                  No discussions found.
                </h3>

                <p>
                  Try another search term or choose
                  another category.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  View All Discussions
                </button>

              </div>
            )}

          </div>
        </section>


        {/* POPULAR TOPICS */}
        <section className="section discussion-topics-section">
          <div className="container">

            <span className="section-label">
              POPULAR TOPICS
            </span>

            <h2>
              What would you like to explore?
            </h2>

            <div className="discussion-topic-grid">

              <button
                type="button"
                onClick={() =>
                  setActiveCategory("Bible Study")
                }
              >
                <BookOpen size={22} />
                <span>Bible Study</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveCategory("Prophecy")
                }
              >
                <Flame size={22} />
                <span>Prophecy</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveCategory("Christian Living")
                }
              >
                <Heart size={22} />
                <span>Christian Living</span>
                <ArrowRight size={16} />
              </button>

            </div>

          </div>
        </section>


        {/* COMMUNITY GUIDELINES */}
        <section className="section discussions-guidelines-section">
          <div className="container">

            <div className="discussion-guidelines">

              <span className="section-label">
                COMMUNITY GUIDELINES
              </span>

              <h2>
                Search together with respect.
              </h2>

              <div className="guideline-grid">

                <div>
                  <strong>Study carefully.</strong>
                  <p>
                    Support important claims with Scripture
                    and reliable sources.
                  </p>
                </div>

                <div>
                  <strong>Ask honestly.</strong>
                  <p>
                    Questions are welcome. Approach difficult
                    topics with humility.
                  </p>
                </div>

                <div>
                  <strong>Respect others.</strong>
                  <p>
                    Disagree with ideas without attacking
                    the people discussing them.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* CTA */}
        <section className="section discussions-cta">
          <div className="container">

            <span className="section-label">
              JOIN THE CONVERSATION
            </span>

            <h2>
              Ask thoughtfully.
              <em>Study together.</em>
            </h2>

            <p>
              Bring your questions, insights, and curiosity
              into a community centered on thoughtful study.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                alert(
                  "Account creation and discussion posting will be connected in the next stage."
                )
              }
            >
              Start a Discussion
              <ArrowRight size={16} />
            </button>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Discussions;