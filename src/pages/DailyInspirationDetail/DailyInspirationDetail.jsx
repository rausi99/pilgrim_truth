import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Loader2,
  Quote,
  Sparkles,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./DailyInspirationDetail.css";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const BACKEND_URL = API_URL.replace(/\/api$/, "");

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function resolveImageUrl(image) {
  if (!image) return null;

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

  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
}

function calculateReadingTime(inspiration) {
  const text = [
    inspiration?.reflection,
    inspiration?.practical_application,
    inspiration?.prayer_prompt,
  ]
    .filter(Boolean)
    .join(" ");

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export default function DailyInspirationDetail() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [inspiration, setInspiration] = useState(null);
  const [allInspirations, setAllInspirations] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadInspiration() {
      try {
        setLoading(true);
        setError("");

        if (!date) {
          throw new Error(
            "No Daily Inspiration date was provided."
          );
        }

        const detailUrl =
          `${API_URL}/content/public/daily-inspirations/${date}`;

        const archiveUrl =
          `${API_URL}/content/public/daily-inspirations`;

        const [
          detailResponse,
          archiveResponse,
        ] = await Promise.all([
          fetch(detailUrl, {
            signal: controller.signal,
          }),
          fetch(archiveUrl, {
            signal: controller.signal,
          }),
        ]);

        const detailData =
          await detailResponse.json();

        const archiveData =
          await archiveResponse.json();

        if (!detailResponse.ok) {
          throw new Error(
            detailData.message ||
              "Unable to load Daily Inspiration."
          );
        }

        if (!archiveResponse.ok) {
          throw new Error(
            archiveData.message ||
              "Unable to load Daily Inspirations."
          );
        }

        setInspiration(
          detailData.inspiration || null
        );

        setAllInspirations(
          archiveData.inspirations || []
        );
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(
          "Daily Inspiration detail error:",
          err
        );

        setError(
          err.message ||
            "Unable to load Daily Inspiration."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadInspiration();

    return () => controller.abort();
  }, [date]);

  const currentIndex = useMemo(() => {
    return allInspirations.findIndex(
      (item) => item.inspiration_date === date
    );
  }, [allInspirations, date]);

  const previousInspiration =
    currentIndex >= 0
      ? allInspirations[currentIndex + 1]
      : null;

  const nextInspiration =
    currentIndex > 0
      ? allInspirations[currentIndex - 1]
      : null;

  const readingTime =
    calculateReadingTime(inspiration);

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="daily-detail-page">
          <section className="daily-detail-loading">
            <Loader2
              size={34}
              className="spin"
            />

            <p>
              Loading Daily Inspiration...
            </p>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  /* =====================================================
     ERROR / NOT FOUND
     ===================================================== */

  if (error || !inspiration) {
    return (
      <>
        <Navbar />

        <main className="daily-detail-page">
          <section className="daily-detail-error">
            <div className="daily-detail-error-icon">
              <Heart size={28} />
            </div>

            <span className="section-label">
              DAILY INSPIRATION
            </span>

            <h1>Inspiration Not Found</h1>

            <p>
              {error ||
                "The Daily Inspiration you are looking for is not available."}
            </p>

            <Link
              to="/daily-inspirations"
              className="primary-button"
            >
              <ArrowLeft size={17} />
              Back to Daily Inspirations
            </Link>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const imageUrl = resolveImageUrl(
    inspiration.featured_image
  );

  return (
    <>
      <Navbar />

      <main className="daily-detail-page">
        {/* =================================================
            HERO
            ================================================= */}

        <section className="daily-detail-hero">
          <div className="container">
            <button
              type="button"
              className="daily-detail-back"
              onClick={() =>
                navigate("/daily-inspirations")
              }
            >
              <ArrowLeft size={17} />
              Back to Daily Inspirations
            </button>

            <div className="daily-detail-category">
              <Sparkles size={15} />

              {inspiration.category ||
                "Daily Inspiration"}
            </div>

            <h1>{inspiration.title}</h1>

            <div className="daily-detail-meta">
              <span>
                <CalendarDays size={16} />

                {formatDate(
                  inspiration.inspiration_date
                )}
              </span>

              <span className="daily-meta-divider">
                •
              </span>

              <span>
                <Clock3 size={16} />

                {readingTime} min read
              </span>

              {inspiration.author && (
                <>
                  <span className="daily-meta-divider">
                    •
                  </span>

                  <span>
                    By {inspiration.author}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
            ================================================= */}

        <section className="daily-detail-content">
          <div className="container">
            {imageUrl && (
              <div className="daily-detail-image-wrapper">
                <img
                  src={imageUrl}
                  alt={inspiration.title}
                  className="daily-detail-image"
                />
              </div>
            )}

            <div className="daily-detail-layout">
              <article className="daily-detail-main">
                {/* SCRIPTURE */}

                {(inspiration.scripture_reference ||
                  inspiration.scripture_text) && (
                  <section className="daily-scripture">
                    <Quote size={30} />

                    <span className="section-label">
                      SCRIPTURE
                    </span>

                    {inspiration.scripture_reference && (
                      <h2>
                        {
                          inspiration.scripture_reference
                        }
                      </h2>
                    )}

                    {inspiration.scripture_text && (
                      <p>
                        {inspiration.scripture_text}
                      </p>
                    )}
                  </section>
                )}

                {/* REFLECTION */}

                {inspiration.reflection && (
                  <section className="daily-detail-section">
                    <span className="section-label">
                      REFLECTION
                    </span>

                    <div className="daily-detail-text">
                      {inspiration.reflection}
                    </div>
                  </section>
                )}

                {/* PRACTICAL APPLICATION */}

                {inspiration.practical_application && (
                  <section className="daily-detail-section">
                    <span className="section-label">
                      PRACTICAL APPLICATION
                    </span>

                    <div className="daily-detail-text">
                      {
                        inspiration.practical_application
                      }
                    </div>
                  </section>
                )}

                {/* PRAYER */}

                {inspiration.prayer_prompt && (
                  <section className="daily-prayer">
                    <div className="daily-prayer-icon">
                      <Heart size={21} />
                    </div>

                    <div>
                      <span className="section-label">
                        PRAYER
                      </span>

                      <p>
                        {inspiration.prayer_prompt}
                      </p>
                    </div>
                  </section>
                )}
              </article>

              {/* SIDEBAR */}

              <aside className="daily-detail-sidebar">
                <div className="daily-sidebar-card">
                  <span className="section-label">
                    KEEP GROWING
                  </span>

                  <h3>
                    Continue your journey of faith.
                  </h3>

                  <p>
                    Explore more biblical studies,
                    Christian living articles, and
                    other resources from Pilgrim
                    Truth.
                  </p>

                  <Link
                    to="/articles"
                    className="secondary-button"
                  >
                    Explore Articles
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="daily-sidebar-card secondary">
                  <span className="section-label">
                    DAILY INSPIRATION
                  </span>

                  <h3>
                    Make Scripture part of your
                    everyday life.
                  </h3>

                  <Link
                    to="/daily-inspirations"
                    className="sidebar-text-link"
                  >
                    View the archive
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =================================================
            PREVIOUS / NEXT
            ================================================= */}

        <section className="daily-detail-navigation">
          <div className="container">
            <div className="daily-nav-header">
              <span className="section-label">
                CONTINUE READING
              </span>

              <h2>
                Previous &amp; Next Inspirations
              </h2>
            </div>

            <div className="daily-nav-grid">
              {previousInspiration ? (
                <button
                  type="button"
                  className="daily-nav-card"
                  onClick={() =>
                    navigate(
                      `/daily-inspirations/${previousInspiration.inspiration_date}`
                    )
                  }
                >
                  <span>
                    <ChevronLeft size={17} />
                    Previous Inspiration
                  </span>

                  <strong>
                    {previousInspiration.title}
                  </strong>

                  <small>
                    {formatDate(
                      previousInspiration.inspiration_date
                    )}
                  </small>
                </button>
              ) : (
                <div className="daily-nav-card daily-nav-disabled">
                  <span>
                    <ChevronLeft size={17} />
                    Previous Inspiration
                  </span>

                  <strong>
                    No earlier inspiration
                  </strong>
                </div>
              )}

              {nextInspiration ? (
                <button
                  type="button"
                  className="daily-nav-card daily-nav-next"
                  onClick={() =>
                    navigate(
                      `/daily-inspirations/${nextInspiration.inspiration_date}`
                    )
                  }
                >
                  <span>
                    Next Inspiration
                    <ChevronRight size={17} />
                  </span>

                  <strong>
                    {nextInspiration.title}
                  </strong>

                  <small>
                    {formatDate(
                      nextInspiration.inspiration_date
                    )}
                  </small>
                </button>
              ) : (
                <div className="daily-nav-card daily-nav-disabled">
                  <span>
                    Next Inspiration
                    <ChevronRight size={17} />
                  </span>

                  <strong>
                    No newer inspiration
                  </strong>
                </div>
              )}
            </div>

            <Link
              to="/daily-inspirations"
              className="daily-view-all"
            >
              <ArrowLeft size={16} />
              View All Daily Inspirations
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
