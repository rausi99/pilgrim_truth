import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  LoaderCircle,
  Quote,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./DailyInspirations.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const BACKEND_URL = API_URL.replace(/\/api$/, "");

function formatDate(date) {
  if (!date) return "";

  const safeDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(safeDate.getTime())) {
    return date;
  }

  return safeDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

  return `${BACKEND_URL}/${image.replace(/^\/+/, "")}`;
}

function DailyInspirations() {
  const [inspirations, setInspirations] = useState([]);
  const [todayInspiration, setTodayInspiration] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadInspirations = async () => {
      try {
        setLoading(true);
        setError("");

        const [allResponse, todayResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/content/public/daily-inspirations`,
              {
                signal: controller.signal,
              }
            ),
            fetch(
              `${API_URL}/content/public/daily-inspirations/today`,
              {
                signal: controller.signal,
              }
            ),
          ]);

        const allData = await allResponse.json();
        const todayData = await todayResponse.json();

        if (!allResponse.ok) {
          throw new Error(
            allData.message ||
              "Unable to load Daily Inspirations."
          );
        }

        setInspirations(allData.inspirations || []);

        if (todayResponse.ok) {
          setTodayInspiration(
            todayData.inspiration || null
          );
        } else {
          setTodayInspiration(null);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(
          "Daily Inspirations error:",
          err
        );

        setError(
          err.message ||
            "Unable to load Daily Inspirations."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadInspirations();

    return () => controller.abort();
  }, []);

  const archiveInspirations = useMemo(() => {
    if (!todayInspiration) {
      return inspirations;
    }

    return inspirations.filter(
      (item) => item.id !== todayInspiration.id
    );
  }, [inspirations, todayInspiration]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="daily-inspirations-page">
          <section className="daily-loading">
            <LoaderCircle
              size={32}
              className="spin"
            />

            <p>
              Loading Daily Inspirations...
            </p>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="daily-inspirations-page">
        {/* =================================================
            HERO
            ================================================= */}
        <section className="daily-page-hero">
          <div className="container">
            <span className="section-label">
              DAILY INSPIRATION
            </span>

            <h1>
              A moment to pause,
              <em> reflect, and seek truth.</em>
            </h1>

            <p>
              Scripture, reflection, and practical
              encouragement for everyday life.
            </p>
          </div>
        </section>

        {/* =================================================
            ERROR
            ================================================= */}
        {error && (
          <section className="container">
            <div className="daily-error">
              {error}
            </div>
          </section>
        )}

        {/* =================================================
            TODAY'S INSPIRATION
            ================================================= */}
        {!error && todayInspiration && (
          <section className="daily-featured-section">
            <div className="container">
              <div className="daily-featured-card">
                <div className="daily-featured-content">
                  <div className="daily-featured-top">
                    <span className="daily-badge">
                      <Sparkles size={15} />
                      TODAY'S INSPIRATION
                    </span>

                    <span className="daily-date">
                      <CalendarDays size={15} />

                      {formatDate(
                        todayInspiration.inspiration_date
                      )}
                    </span>
                  </div>

                  <span className="daily-category">
                    {todayInspiration.category ||
                      "Daily Inspiration"}
                  </span>

                  <h2>
                    {todayInspiration.title}
                  </h2>

                  {todayInspiration.scripture_reference && (
                    <div className="daily-scripture">
                      <Quote size={22} />

                      <div>
                        <strong>
                          {
                            todayInspiration.scripture_reference
                          }
                        </strong>

                        {todayInspiration.scripture_text && (
                          <p>
                            {
                              todayInspiration.scripture_text
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {todayInspiration.reflection && (
                    <div className="daily-section">
                      <span>REFLECTION</span>

                      <p>
                        {todayInspiration.reflection}
                      </p>
                    </div>
                  )}

                  {todayInspiration.practical_application && (
                    <div className="daily-section">
                      <span>
                        PRACTICAL APPLICATION
                      </span>

                      <p>
                        {
                          todayInspiration.practical_application
                        }
                      </p>
                    </div>
                  )}

                  {todayInspiration.prayer_prompt && (
                    <div className="daily-prayer">
                      <Heart size={19} />

                      <div>
                        <span>PRAYER</span>

                        <p>
                          {
                            todayInspiration.prayer_prompt
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {todayInspiration.author && (
                    <div className="daily-author">
                      Written by{" "}
                      {todayInspiration.author}
                    </div>
                  )}
                </div>

                {todayInspiration.featured_image && (
                  <div className="daily-featured-image">
                    <img
                      src={resolveImageUrl(
                        todayInspiration.featured_image
                      )}
                      alt={todayInspiration.title}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ARCHIVE
            ================================================= */}
        <section className="daily-archive-section">
          <div className="container">
            <div className="daily-section-heading">
              <div>
                <span className="section-label">
                  FROM THE ARCHIVE
                </span>

                <h2>Previous Inspirations</h2>
              </div>

              <BookOpen size={25} />
            </div>

            {archiveInspirations.length === 0 ? (
              <div className="daily-empty">
                <BookOpen size={34} />

                <h3>
                  No previous inspirations yet
                </h3>

                <p>
                  More Daily Inspirations will appear
                  here as they are published.
                </p>
              </div>
            ) : (
              <div className="daily-archive-grid">
                {archiveInspirations.map(
                  (inspiration) => (
                    <article
                      className="daily-archive-card"
                      key={inspiration.id}
                    >
                      {inspiration.featured_image && (
                        <div className="daily-archive-image">
                          <img
                            src={resolveImageUrl(
                              inspiration.featured_image
                            )}
                            alt={inspiration.title}
                          />
                        </div>
                      )}

                      <div className="daily-archive-content">
                        <div className="daily-archive-meta">
                          <span>
                            {formatDate(
                              inspiration.inspiration_date
                            )}
                          </span>

                          {inspiration.category && (
                            <span>
                              {inspiration.category}
                            </span>
                          )}
                        </div>

                        <h3>
                          {inspiration.title}
                        </h3>

                        {inspiration.scripture_reference && (
                          <strong>
                            {
                              inspiration.scripture_reference
                            }
                          </strong>
                        )}

                        {inspiration.reflection && (
                          <p>
                            {inspiration.reflection}
                          </p>
                        )}

                        <Link
                          to={`/daily-inspirations/${inspiration.inspiration_date}`}
                          className="secondary-button"
                        >
                          Read Inspiration
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            CLOSING
            ================================================= */}
        <section className="daily-closing">
          <div className="container">
            <Quote size={30} />

            <h2>
              Study carefully.
              <em> Reflect honestly.</em>
            </h2>

            <p>
              Take time to read the Scripture,
              consider its message, and carry one
              meaningful thought into your day.
            </p>

            <Link to="/articles">
              Explore more studies
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default DailyInspirations;
