import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Play, Search } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./Videos.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const YOUTUBE_CHANNEL_URL =
  "https://www.youtube.com/@pilgrimtruthministry";

function getYoutubeId(video) {
  if (video?.youtube_id) {
    return video.youtube_id;
  }

  if (!video?.youtube_url) {
    return "";
  }

  try {
    const url = new URL(video.youtube_url);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").split("?")[0];
    }

    if (url.pathname.includes("/shorts/")) {
      return url.pathname.split("/shorts/")[1].split("/")[0];
    }

    if (url.pathname.includes("/embed/")) {
      return url.pathname.split("/embed/")[1].split("/")[0];
    }

    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function getThumbnail(video) {
  if (video?.thumbnail_url) {
    return video.thumbnail_url;
  }

  const youtubeId = getYoutubeId(video);

  if (youtubeId) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  return "/images/video-placeholder.jpg";
}

function getYoutubeUrl(video) {
  if (video?.youtube_url) {
    return video.youtube_url;
  }

  const youtubeId = getYoutubeId(video);

  if (youtubeId) {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  return YOUTUBE_CHANNEL_URL;
}

function Videos() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/videos`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load videos."
          );
        }

        if (isMounted) {
          setVideos(
            Array.isArray(data.videos)
              ? data.videos
              : []
          );
        }
      } catch (err) {
        console.error("Videos loading error:", err);

        if (isMounted) {
          setError(
            err.message ||
              "Unable to load videos at the moment."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVideos = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return videos;
    }

    return videos.filter((video) => {
      const title =
        video?.title?.toLowerCase() || "";

      const category =
        video?.category?.toLowerCase() || "";

      const author =
        video?.author?.toLowerCase() || "";

      const description =
        video?.description?.toLowerCase() || "";

      return (
        title.includes(search) ||
        category.includes(search) ||
        author.includes(search) ||
        description.includes(search)
      );
    });
  }, [videos, searchTerm]);

  return (
    <>
      <Navbar />

      <main className="videos-page">
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="videos-hero">
          <div className="videos-hero-overlay" />

          <div className="videos-container videos-hero-container">
            <div className="videos-hero-content">
              <span className="videos-eyebrow">
                PILGRIM TRUTH MEDIA
              </span>

              <h1>
                Faith. Truth.
                <br />
                Understanding.
              </h1>

              <p>
                Explore Bible teachings, Christian
                reflections, and ministry messages
                designed to strengthen your faith and
                deepen your understanding of God's Word.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            VIDEO LIBRARY
        ====================================================== */}
        <section className="video-library">
          <div className="videos-container">
            <div className="library-header">
              <div className="library-heading">
                <span className="videos-eyebrow">
                  OUR MEDIA
                </span>

                <h2>Videos</h2>

                <p>
                  Browse our collection of Bible
                  teachings, reflections, and ministry
                  content.
                </p>
              </div>

              <div className="video-search">
                <Search size={18} aria-hidden="true" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search videos..."
                  aria-label="Search videos"
                />
              </div>
            </div>

            {!loading &&
              !error &&
              searchTerm.trim() && (
                <div className="search-result-info">
                  <span>
                    {filteredVideos.length}{" "}
                    {filteredVideos.length === 1
                      ? "video"
                      : "videos"}{" "}
                    found
                  </span>

                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                  >
                    Clear search
                  </button>
                </div>
              )}

            {loading && (
              <div className="videos-state">
                <p>Loading videos...</p>
              </div>
            )}

            {!loading && error && (
              <div className="videos-state videos-error">
                <p>{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredVideos.length === 0 && (
                <div className="videos-state">
                  <p>
                    {searchTerm.trim()
                      ? "No videos match your search."
                      : "No videos are available yet."}
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              filteredVideos.length > 0 && (
                <div className="video-grid">
                  {filteredVideos.map((video) => (
                    <article
                      className="video-card"
                      key={video.id || video.slug}
                    >
                      <a
                        href={getYoutubeUrl(video)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-card-link"
                        aria-label={`Watch ${video.title}`}
                      >
                        <div className="video-card-image">
                          <img
                            src={getThumbnail(video)}
                            alt={video.title}
                            loading="lazy"
                          />

                          <span
                            className="video-play-button"
                            aria-hidden="true"
                          >
                            <Play
                              size={17}
                              fill="currentColor"
                            />
                          </span>

                          {video.duration && (
                            <span className="video-duration">
                              {video.duration}
                            </span>
                          )}
                        </div>

                        <div className="video-card-content">
                          {video.category && (
                            <span className="video-category">
                              {video.category}
                            </span>
                          )}

                          <h3>{video.title}</h3>

                          {video.author && (
                            <p className="video-author">
                              By {video.author}
                            </p>
                          )}
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </section>

        {/* =====================================================
            YOUTUBE CTA
        ====================================================== */}
        <section className="videos-youtube-section">
          <div className="videos-container">
            <div className="youtube-content">
              <span className="videos-eyebrow">
                PILGRIM TRUTH ON YOUTUBE
              </span>

              <h2>
                Continue exploring God's Word.
              </h2>

              <p>
                Find more teachings, reflections, and
                ministry content on our YouTube channel.
              </p>

              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="video-primary-button"
              >
                Visit YouTube
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Videos;
