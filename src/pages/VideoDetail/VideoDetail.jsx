import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Play,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./VideoDetail.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(
  /\/api\/?$/,
  ""
);

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

function resolveImageUrl(image) {
  if (!image) return "";

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

function getYouTubeId(video) {
  if (video?.youtube_id) {
    return video.youtube_id;
  }

  if (!video?.youtube_url) {
    return "";
  }

  try {
    const url = new URL(video.youtube_url);

    if (
      url.hostname.includes("youtu.be")
    ) {
      return url.pathname
        .replace("/", "")
        .trim();
    }

    if (
      url.hostname.includes("youtube.com")
    ) {
      if (
        url.pathname.startsWith(
          "/embed/"
        )
      ) {
        return url.pathname
          .replace("/embed/", "")
          .trim();
      }

      if (
        url.pathname.startsWith(
          "/shorts/"
        )
      ) {
        return url.pathname
          .replace("/shorts/", "")
          .trim();
      }

      return (
        url.searchParams.get("v") || ""
      );
    }
  } catch {
    return "";
  }

  return "";
}

function getYouTubeThumbnail(video) {
  const thumbnail = resolveImageUrl(
    video?.thumbnail_url
  );

  if (thumbnail) {
    return thumbnail;
  }

  const youtubeId =
    getYouTubeId(video);

  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }

  return "";
}

function getYouTubeEmbedUrl(video) {
  const youtubeId =
    getYouTubeId(video);

  if (!youtubeId) {
    return "";
  }

  return `https://www.youtube.com/embed/${youtubeId}`;
}

function getYouTubeWatchUrl(video) {
  if (video?.youtube_url) {
    return video.youtube_url;
  }

  const youtubeId =
    getYouTubeId(video);

  if (!youtubeId) {
    return "";
  }

  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

function isPublished(video) {
  return (
    String(video?.status || "").toLowerCase() ===
    "published"
  );
}

function calculateReadingTime(text = "") {
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(words / 200)
  );
}

export default function VideoDetail() {
  const { slug } = useParams();

  const [video, setVideo] =
    useState(null);

  const [videos, setVideos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadVideo() {
      try {
        setLoading(true);
        setError("");

        const [videoResponse, videosResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/content/public/videos/${encodeURIComponent(
                slug
              )}`
            ),
            fetch(
              `${API_URL}/content/public/videos`
            ),
          ]);

        const videoData =
          await videoResponse
            .json()
            .catch(() => ({}));

        const videosData =
          await videosResponse
            .json()
            .catch(() => ({}));

        if (!videoResponse.ok) {
          throw new Error(
            videoData.message ||
              "Video not found."
          );
        }

        if (!videosResponse.ok) {
          throw new Error(
            videosData.message ||
              "Unable to load the video library."
          );
        }

        const currentVideo =
          videoData.video ||
          videoData;

        const allVideos = Array.isArray(
          videosData.videos
        )
          ? videosData.videos
          : [];

        if (!currentVideo) {
          throw new Error(
            "Video not found."
          );
        }

        if (!cancelled) {
          setVideo(currentVideo);
          setVideos(allVideos);
        }
      } catch (err) {
        console.error(
          "Load video error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load this video."
          );
          setVideo(null);
          setVideos([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVideo();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const publishedVideos = useMemo(() => {
    return videos.filter(isPublished);
  }, [videos]);

  const navigation = useMemo(() => {
    if (!video) {
      return {
        previous: null,
        next: null,
      };
    }

    const currentIndex =
      publishedVideos.findIndex(
        (item) =>
          item.slug === video.slug
      );

    return {
      previous:
        currentIndex > 0
          ? publishedVideos[
              currentIndex - 1
            ]
          : null,

      next:
        currentIndex >= 0 &&
        currentIndex <
          publishedVideos.length - 1
          ? publishedVideos[
              currentIndex + 1
            ]
          : null,
    };
  }, [video, publishedVideos]);

  const relatedVideos = useMemo(() => {
    if (!video) return [];

    return publishedVideos
      .filter(
        (item) =>
          item.slug !== video.slug &&
          item.category === video.category
      )
      .slice(0, 3);
  }, [video, publishedVideos]);

  if (loading) {
    return (
      <div className="inner-page video-detail-page">
        <Navbar />

        <main className="video-detail-loading">
          <div className="container">
            <div className="video-detail-loading-card">
              <div className="loading-spinner" />

              <p>
                Loading video...
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="inner-page video-detail-page">
        <Navbar />

        <main className="video-detail-error">
          <div className="container">
            <div className="video-detail-error-card">
              <span className="section-label">
                VIDEO
              </span>

              <h1>
                Video not found
              </h1>

              <p>
                {error ||
                  "The video you are looking for could not be found."}
              </p>

              <Link
                to="/videos"
                className="btn btn-primary"
              >
                <ArrowLeft size={16} />
                Back to Videos
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const thumbnail =
    getYouTubeThumbnail(video);

  const embedUrl =
    getYouTubeEmbedUrl(video);

  const youtubeWatchUrl =
    getYouTubeWatchUrl(video);

  const videoDate =
    video.published_at ||
    video.created_at;

  const readingTime =
    calculateReadingTime(
      `${video.title || ""} ${
        video.description || ""
      }`
    );

  return (
    <div className="inner-page video-detail-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="video-detail-hero">
          <div className="container">
            <Link
              to="/videos"
              className="video-back-link"
            >
              <ArrowLeft size={16} />
              Back to Videos
            </Link>

            <div className="video-detail-heading">
              <span className="section-label">
                {video.category ||
                  "PILGRIM TRUTH VIDEOS"}
              </span>

              <h1>{video.title}</h1>

              <div className="video-detail-meta">
                {videoDate && (
                  <span>
                    <CalendarDays
                      size={16}
                    />
                    {formatDate(
                      videoDate
                    )}
                  </span>
                )}

                {video.duration && (
                  <span>
                    <Clock3 size={16} />
                    {video.duration}
                  </span>
                )}

                <span>
                  <BookOpen size={16} />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO PLAYER */}
        <section className="section video-player-section">
          <div className="container">
            <div className="video-player-wrapper">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="video-player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="video-placeholder">
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt={video.title}
                    />
                  )}

                  <div className="video-placeholder-overlay">
                    <div className="video-placeholder-icon">
                      <Play
                        size={28}
                        fill="currentColor"
                      />
                    </div>

                    <h2>
                      Video coming soon
                    </h2>

                    <p>
                      This video has not
                      been published yet.
                      Check back soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section video-content-section">
          <div className="container video-detail-layout">
            <article className="video-main-content">
              {video.category && (
                <div className="video-content-category">
                  {video.category}
                </div>
              )}

              <h2>
                About this video
              </h2>

              {video.description && (
                <p className="video-description">
                  {video.description}
                </p>
              )}

              {video.content && (
                <div className="video-rich-content">
                  {typeof video.content ===
                  "string" ? (
                    video.content
                      .split("\n")
                      .filter(Boolean)
                      .map(
                        (
                          paragraph,
                          index
                        ) => (
                          <p key={index}>
                            {paragraph}
                          </p>
                        )
                      )
                  ) : (
                    video.content
                  )}
                </div>
              )}

              {video.scripture && (
                <blockquote className="video-scripture">
                  <BookOpen size={20} />

                  <div>
                    <p>
                      {video.scripture
                        .text ||
                        video.scripture}
                    </p>

                    {video.scripture
                      .reference && (
                      <cite>
                        {
                          video
                            .scripture
                            .reference
                        }
                      </cite>
                    )}
                  </div>
                </blockquote>
              )}

              {/* NAVIGATION */}
              <div className="video-detail-navigation">
                {navigation.previous ? (
                  <Link
                    to={`/videos/${navigation.previous.slug}`}
                    className="video-nav-card"
                  >
                    <ArrowLeft size={17} />

                    <div>
                      <span>
                        Previous Video
                      </span>

                      <strong>
                        {
                          navigation
                            .previous
                            .title
                        }
                      </strong>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {navigation.next && (
                  <Link
                    to={`/videos/${navigation.next.slug}`}
                    className="video-nav-card next"
                  >
                    <div>
                      <span>
                        Next Video
                      </span>

                      <strong>
                        {
                          navigation.next
                            .title
                        }
                      </strong>
                    </div>

                    <ArrowRight
                      size={17}
                    />
                  </Link>
                )}
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="video-detail-sidebar">
              <div className="video-sidebar-card">
                <span className="section-label">
                  PILGRIM TRUTH
                </span>

                <h3>
                  Continue learning through
                  video.
                </h3>

                <p>
                  Explore Bible studies,
                  prophecy, history, Christian
                  living, and other thoughtful
                  resources.
                </p>

                <Link
                  to="/videos"
                  className="btn btn-primary"
                >
                  Browse Videos
                  <ArrowRight size={16} />
                </Link>
              </div>

              {youtubeWatchUrl && (
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-sidebar-link"
                >
                  <Play
                    size={20}
                    fill="currentColor"
                    strokeWidth={1.5}
                  />

                  <div>
                    <strong>
                      Watch on YouTube
                    </strong>

                    <span>
                      Open the original video
                    </span>
                  </div>

                  <ArrowRight size={16} />
                </a>
              )}
            </aside>
          </div>
        </section>

        {/* RELATED VIDEOS */}
        {relatedVideos.length > 0 && (
          <section className="section related-videos-section">
            <div className="container">
              <div className="section-heading-row">
                <div>
                  <span className="section-label">
                    RELATED VIDEOS
                  </span>

                  <h2>
                    Continue exploring.
                  </h2>
                </div>

                <Link
                  to="/videos"
                  className="text-link"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="related-videos-grid">
                {relatedVideos.map(
                  (relatedVideo) => {
                    const relatedThumbnail =
                      getYouTubeThumbnail(
                        relatedVideo
                      );

                    return (
                      <article
                        key={
                          relatedVideo.slug
                        }
                        className="related-video-card"
                      >
                        <Link
                          to={`/videos/${relatedVideo.slug}`}
                          className="related-video-image"
                        >
                          {relatedThumbnail ? (
                            <img
                              src={
                                relatedThumbnail
                              }
                              alt={
                                relatedVideo.title
                              }
                            />
                          ) : (
                            <div className="video-placeholder">
                              <Play
                                size={24}
                                fill="currentColor"
                              />
                            </div>
                          )}

                          <span className="related-video-play">
                            <Play
                              size={16}
                              fill="currentColor"
                            />
                          </span>
                        </Link>

                        <div className="related-video-content">
                          <span>
                            {
                              relatedVideo.category
                            }
                          </span>

                          <h3>
                            {
                              relatedVideo.title
                            }
                          </h3>

                          <Link
                            to={`/videos/${relatedVideo.slug}`}
                            className="video-card-link"
                          >
                            Watch
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
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section video-detail-cta">
          <div className="container">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Watch thoughtfully.
              <em>Study deeply.</em>
            </h2>

            <p>
              Continue exploring Scripture
              through Bible studies, articles,
              prophecy, history, and Christian
              living.
            </p>

            <div className="video-detail-cta-actions">
              <Link
                to="/bible-studies"
                className="btn btn-primary"
              >
                Explore Bible Studies
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/articles"
                className="btn btn-secondary"
              >
                Read Articles
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
