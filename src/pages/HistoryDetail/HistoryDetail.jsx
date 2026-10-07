import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./HistoryDetail.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getReadingTime(content = "") {
  const words = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return words ? Math.max(1, Math.ceil(words / 200)) : 5;
}

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
    const backendUrl = API_URL.replace(/\/api\/?$/, "");
    return `${backendUrl}${image}`;
  }

  return image;
}

function HistoryDetail() {
  const { slug } = useParams();

  const [history, setHistory] = useState(null);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const [historyResponse, listResponse] =
          await Promise.all([
            fetch(`${API_URL}/content/public/history/${slug}`),
            fetch(`${API_URL}/content/public/history`),
          ]);

        const historyData = await historyResponse.json();
        const listData = await listResponse.json();

        if (!historyResponse.ok) {
          throw new Error(
            historyData.message ||
              "Unable to load this History study."
          );
        }

        if (!listResponse.ok) {
          throw new Error(
            listData.message ||
              "Unable to load History studies."
          );
        }

        if (cancelled) return;

        setHistory(historyData.history);
        setHistories(listData.histories || []);
      } catch (err) {
        if (cancelled) return;

        console.error("Load History detail error:", err);

        setError(
          err.message || "Unable to load this History study."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const navigation = useMemo(() => {
    if (!history || histories.length === 0) {
      return {
        previous: null,
        next: null,
      };
    }

    const currentIndex = histories.findIndex(
      (item) => item.slug === history.slug
    );

    if (currentIndex === -1) {
      return {
        previous: null,
        next: null,
      };
    }

    return {
      previous:
        currentIndex > 0
          ? histories[currentIndex - 1]
          : null,

      next:
        currentIndex < histories.length - 1
          ? histories[currentIndex + 1]
          : null,
    };
  }, [history, histories]);

  if (loading) {
    return (
      <div className="inner-page history-detail-page">
        <Navbar />

        <main>
          <section className="detail-state detail-loading">
            <div className="container">
              <div className="detail-state-icon">
                <BookOpen size={22} />
              </div>

              <span className="section-label">
                HISTORY
              </span>

              <h1>Loading History study...</h1>

              <p>
                Preparing the study for you.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="inner-page history-detail-page">
        <Navbar />

        <main>
          <section className="detail-state detail-error">
            <div className="container">
              <div className="detail-state-icon">
                <BookOpen size={22} />
              </div>

              <span className="section-label">
                HISTORY
              </span>

              <h1>History study not found.</h1>

              <p>
                {error ||
                  "The History study you are looking for could not be found."}
              </p>

              <Link
                to="/history"
                className="btn btn-primary"
              >
                <ArrowLeft size={16} />
                Back to History
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const imageUrl = getImageUrl(history.featured_image);

  const contentParagraphs = (history.content || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="inner-page history-detail-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="history-detail-hero">
          <div className="container">
            <Link
              to="/history"
              className="detail-back-link"
            >
              <ArrowLeft size={16} />
              Back to History
            </Link>

            <div className="history-detail-hero-content">
              <span className="section-label">
                {history.category || "BIBLE HISTORY"}
              </span>

              <h1>{history.title}</h1>

              {history.description && (
                <p className="history-detail-description">
                  {history.description}
                </p>
              )}

              <div className="history-detail-meta">
                {history.scripture_reference && (
                  <span>
                    <BookOpen size={15} />
                    {history.scripture_reference}
                  </span>
                )}

                <span>
                  <Clock3 size={15} />
                  {getReadingTime(history.content)} min read
                </span>

                {history.published_at && (
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(history.published_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section history-detail-content">
          <div className="container">
            <div className="history-detail-layout">
              <article className="history-detail-main">
                {imageUrl && (
                  <div className="history-detail-image">
                    <img
                      src={imageUrl}
                      alt={history.title}
                    />
                  </div>
                )}

                {history.scripture_reference && (
                  <div className="history-scripture-card">
                    <div className="scripture-card-icon">
                      <BookOpen size={18} />
                    </div>

                    <div>
                      <span>SCRIPTURE</span>

                      <strong>
                        {history.scripture_reference}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="history-study-content">
                  {contentParagraphs.length > 0 ? (
                    contentParagraphs.map((paragraph, index) => {
                      const isHeading =
                        paragraph.length < 100 &&
                        !/[.!?]$/.test(paragraph);

                      if (isHeading) {
                        return (
                          <h2 key={index}>
                            {paragraph}
                          </h2>
                        );
                      }

                      return (
                        <p key={index}>
                          {paragraph}
                        </p>
                      );
                    })
                  ) : (
                    <p className="empty-content">
                      No study content is available yet.
                    </p>
                  )}
                </div>

                {history.author && (
                  <div className="history-detail-author">
                    <div className="history-author-avatar">
                      <User size={18} />
                    </div>

                    <div>
                      <span>WRITTEN BY</span>

                      <strong>{history.author}</strong>
                    </div>
                  </div>
                )}
              </article>

              {/* SIDEBAR */}
              <aside className="history-detail-sidebar">
                <div className="history-detail-sidebar-card">
                  <span className="section-label">
                    HISTORY
                  </span>

                  <h3>
                    Explore more historical context.
                  </h3>

                  <p>
                    Discover more studies about
                    biblical people, places, kingdoms,
                    cultures, and historical settings.
                  </p>

                  <Link
                    to="/history"
                    className="detail-sidebar-link"
                  >
                    Browse History
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {history.category && (
                  <div className="history-detail-sidebar-card">
                    <span className="section-label">
                      CATEGORY
                    </span>

                    <h3>{history.category}</h3>

                    <p>
                      Continue exploring studies in
                      this historical category.
                    </p>

                    <Link
                      to="/history"
                      className="detail-sidebar-link"
                    >
                      View studies
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                )}

                {history.scripture_reference && (
                  <div className="history-detail-sidebar-card sidebar-scripture">
                    <span className="section-label">
                      SCRIPTURE
                    </span>

                    <div className="sidebar-scripture-reference">
                      <BookOpen size={16} />
                      <strong>
                        {history.scripture_reference}
                      </strong>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* PREVIOUS / NEXT */}
        {(navigation.previous || navigation.next) && (
          <section className="history-detail-navigation">
            <div className="container">
              <div className="history-detail-nav-grid">
                {navigation.previous ? (
                  <Link
                    to={`/history/${navigation.previous.slug}`}
                    className="history-detail-nav-card"
                  >
                    <span>
                      <ArrowLeft size={15} />
                      Previous study
                    </span>

                    <strong>
                      {navigation.previous.title}
                    </strong>
                  </Link>
                ) : (
                  <div />
                )}

                {navigation.next && (
                  <Link
                    to={`/history/${navigation.next.slug}`}
                    className="history-detail-nav-card next"
                  >
                    <span>
                      Next study
                      <ArrowRight size={15} />
                    </span>

                    <strong>
                      {navigation.next.title}
                    </strong>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section history-detail-final">
          <div className="container history-detail-final-content">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Continue your journey
              <em>through Scripture.</em>
            </h2>

            <p>
              Explore more Bible studies and biblical
              prophecy at Pilgrim Truth.
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

export default HistoryDetail;