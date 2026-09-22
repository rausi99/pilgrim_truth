import { ArrowLeft, ArrowRight, Clock3, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import videos from "../../data/videos";

function VideoDetail() {
  const { slug } = useParams();

  const videoIndex = videos.findIndex(
    (video) => video.slug === slug
  );

  const video = videos[videoIndex];

  if (!video) {
    return (
      <div className="inner-page">
        <Navbar />

        <main className="video-not-found">
          <div className="container">
            <span className="section-label">
              VIDEO NOT FOUND
            </span>

            <h1>We couldn't find that video.</h1>

            <p>
              The video may have been moved or the link may be
              incorrect.
            </p>

            <Link to="/videos" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to Videos
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const relatedVideos = videos
    .filter(
      (item) =>
        item.slug !== video.slug &&
        item.category === video.category
    )
    .slice(0, 3);

  const previousVideo =
    videoIndex > 0 ? videos[videoIndex - 1] : null;

  const nextVideo =
    videoIndex < videos.length - 1
      ? videos[videoIndex + 1]
      : null;

  return (
    <div className="inner-page video-detail-page">
      <Navbar />

      <main>
        <section className="video-detail-hero">
          <div className="container">
            <Link to="/videos" className="video-back-link">
              <ArrowLeft size={16} />
              Back to Videos
            </Link>

            <div className="video-detail-category">
              <Tag size={15} />
              {video.category}
            </div>

            <h1>{video.title}</h1>

            <p className="video-detail-description">
              {video.description}
            </p>

            <div className="video-detail-meta">
              <span>
                <Clock3 size={15} />
                {video.duration}
              </span>

              <span>{video.date}</span>

              <span>Pilgrim Truth</span>
            </div>
          </div>
        </section>

        <section className="section video-detail-content-section">
          <div className="container video-detail-layout">
            <div className="video-main-content">
              <div className="video-player">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="video-detail-info">
                <span className="section-label">
                  ABOUT THIS VIDEO
                </span>

                <h2>{video.title}</h2>

                <p>{video.description}</p>
              </div>
            </div>

            <aside className="video-detail-sidebar">
              <div className="video-sidebar-card">
                <span className="section-label">
                  RELATED VIDEOS
                </span>

                {relatedVideos.length > 0 ? (
                  <div className="related-video-list">
                    {relatedVideos.map((related) => (
                      <Link
                        to={`/videos/${related.slug}`}
                        className="related-video"
                        key={related.slug}
                      >
                        <div className="related-video-image">
                          <img
                            src={related.image}
                            alt={related.title}
                          />

                          <span>
                            <ArrowRight size={14} />
                          </span>
                        </div>

                        <div>
                          <small>{related.category}</small>
                          <strong>{related.title}</strong>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p>No related videos yet.</p>
                )}
              </div>

              <div className="video-sidebar-card">
                <span className="section-label">
                  KEEP EXPLORING
                </span>

                <p>
                  Continue discovering Bible studies, prophecy,
                  history, Christian living, and health.
                </p>

                <Link
                  to="/videos"
                  className="sidebar-link"
                >
                  Browse all videos
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="video-navigation-section">
          <div className="container video-navigation">
            {previousVideo ? (
              <Link
                to={`/videos/${previousVideo.slug}`}
                className="video-nav-card"
              >
                <span>
                  <ArrowLeft size={15} />
                  Previous Video
                </span>

                <strong>{previousVideo.title}</strong>
              </Link>
            ) : (
              <div />
            )}

            {nextVideo && (
              <Link
                to={`/videos/${nextVideo.slug}`}
                className="video-nav-card video-nav-next"
              >
                <span>
                  Next Video
                  <ArrowRight size={15} />
                </span>

                <strong>{nextVideo.title}</strong>
              </Link>
            )}
          </div>
        </section>

        <section className="section video-detail-cta">
          <div className="container">
            <span className="section-label">
              KEEP WATCHING
            </span>

            <h2>
              Watch thoughtfully.
              <em>Study deeply.</em>
            </h2>

            <Link to="/videos" className="btn btn-primary">
              Explore More Videos
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default VideoDetail;