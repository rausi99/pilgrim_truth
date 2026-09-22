import { useMemo, useState } from "react";
import { ArrowRight, Play, Search } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import videos from "../../data/videos";

function Videos() {
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

  const popularTopics = [
    { label: "Bible Study", category: "Bible Study" },
    { label: "Biblical Prophecy", category: "Prophecy" },
    { label: "Bible History", category: "Bible History" },
    { label: "Christian Living", category: "Christian Living" },
    { label: "Healthy Living", category: "Health" },
    { label: "Faith & Purpose", category: null },
  ];

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesCategory =
        activeCategory === "All" ||
        video.category === activeCategory;

      const matchesSearch =
        !query ||
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const featuredVideo = videos[0];

  const handleTopicClick = (category) => {
    if (!category) return;

    setActiveCategory(category);
    setSearchQuery("");

    document
      .querySelector(".videos-library-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="inner-page videos-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="page-hero videos-hero">
          <div className="container">
            <span className="section-label">
              PILGRIM TRUTH VIDEOS
            </span>

            <h1>
              Watch. Learn.
              <em>Discover truth.</em>
            </h1>

            <p>
              Explore biblical lessons, thoughtful discussions,
              history, prophecy, Christian living, and practical
              faith through video.
            </p>

            <div className="video-search-wrapper">
              <div className="page-search">
                <Search size={19} />

                <input
                  id="video-search"
                  name="videoSearch"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                  }}
                  placeholder="Search videos, topics, or lessons..."
                  aria-label="Search videos, topics, or lessons"
                  autoComplete="off"
                />

                {searchQuery && (
                  <button
                    type="button"
                    className="video-search-clear"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear video search"
                  >
                    ×
                  </button>
                )}
              </div>

              {searchQuery.trim() && (
                <p className="video-search-results">
                  {filteredVideos.length}{" "}
                  {filteredVideos.length === 1
                    ? "video"
                    : "videos"}{" "}
                  found for{" "}
                  <strong>"{searchQuery}"</strong>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED VIDEO */}
        <section className="section videos-featured-section">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-label">
                  FEATURED VIDEO
                </span>

                <h2>Take a closer look.</h2>
              </div>
            </div>

            <div className="video-featured-card">
              <div className="video-featured-image">
                <img
                  src={featuredVideo.image}
                  alt={featuredVideo.title}
                />

                <Link
                  to={`/videos/${featuredVideo.slug}`}
                  className="video-play-button"
                  aria-label={`Watch ${featuredVideo.title}`}
                >
                  <Play size={24} fill="currentColor" />
                </Link>

                <span className="video-duration">
                  {featuredVideo.duration}
                </span>
              </div>

              <div className="video-featured-content">
                <span className="section-label">
                  {featuredVideo.category}
                </span>

                <h3>{featuredVideo.title}</h3>

                <p>{featuredVideo.description}</p>

                <Link
                  to={`/videos/${featuredVideo.slug}`}
                  className="btn btn-primary"
                >
                  Watch Featured Video
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO LIBRARY */}
        <section className="section videos-library-section">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <span className="section-label">
                  VIDEO LIBRARY
                </span>

                <h2>Explore the collection.</h2>
              </div>

              <span className="videos-count">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1
                  ? "video"
                  : "videos"}
              </span>
            </div>

            <div className="video-filters">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "video-filter active"
                      : "video-filter"
                  }
                  onClick={() => {
                    setActiveCategory(category);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredVideos.length > 0 ? (
              <div className="videos-grid">
                {filteredVideos.map((video) => (
                  <article
                    className="video-card"
                    key={video.slug}
                  >
                    <div className="video-card-image">
                      <img
                        src={video.image}
                        alt={video.title}
                      />

                      <Link
                        to={`/videos/${video.slug}`}
                        className="video-card-play"
                        aria-label={`Watch ${video.title}`}
                      >
                        <Play
                          size={18}
                          fill="currentColor"
                        />
                      </Link>

                      <span className="video-duration">
                        {video.duration}
                      </span>
                    </div>

                    <div className="video-card-content">
                      <span>{video.category}</span>

                      <h3>{video.title}</h3>

                      <p>{video.description}</p>

                      <Link
                        to={`/videos/${video.slug}`}
                        className="video-card-link"
                      >
                        Watch
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="videos-empty-state">
                <h3>No videos found.</h3>

                <p>
                  Try a different search term or choose another
                  category.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  View All Videos
                </button>
              </div>
            )}
          </div>
        </section>

        {/* POPULAR TOPICS */}
        <section className="section videos-topics-section">
          <div className="container">
            <span className="section-label">
              POPULAR TOPICS
            </span>

            <h2>Where would you like to explore?</h2>

            <div className="video-topic-grid">
              {popularTopics.map((topic) => (
                <button
                  type="button"
                  key={topic.label}
                  className="video-topic-card"
                  onClick={() =>
                    handleTopicClick(topic.category)
                  }
                  disabled={!topic.category}
                >
                  <strong>{topic.label}</strong>

                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section videos-cta">
          <div className="container">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Watch thoughtfully.
              <em>Study deeply.</em>
            </h2>

            <p>
              Continue exploring Scripture through Bible studies,
              articles, prophecy, history, and Christian living.
            </p>

            <Link
              to="/bible-studies"
              className="btn btn-primary"
            >
              Explore Bible Studies
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Videos;