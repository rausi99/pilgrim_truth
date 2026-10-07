import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BookOpen,
  Clock3,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./BibleStudies.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  const imageValue = String(image).trim();

  if (!imageValue) {
    return "";
  }

  // External or data image
  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

  // Uploaded local image
  if (imageValue.startsWith("/")) {
    return `${BACKEND_URL}${imageValue}`;
  }

  return imageValue;
}

function getReadingTime(content = "") {
  const text = String(content || "").trim();

  if (!text) {
    return "5 min read";
  }

  const words = text
    .split(/\s+/)
    .filter(Boolean).length;

  if (!words) {
    return "5 min read";
  }

  const minutes = Math.max(
    1,
    Math.ceil(words / 200)
  );

  return `${minutes} min read`;
}

function BibleStudies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStudies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/bible-studies`
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load Bible Studies."
          );
        }

        const loadedStudies = Array.isArray(data)
          ? data
          : Array.isArray(data?.studies)
          ? data.studies
          : [];

        if (mounted) {
          setStudies(loadedStudies);
        }
      } catch (err) {
        console.error(
          "Load public Bible Studies error:",
          err
        );

        if (mounted) {
          setStudies([]);

          setError(
            err.message ||
              "Unable to load Bible Studies. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStudies();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredStudies = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return studies;
    }

    return studies.filter((study) => {
      const searchableText = [
        study.title,
        study.description,
        study.category,
        study.scripture_reference,
        study.content,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, studies]);

  return (
    <div className="inner-page">
      <Navbar />

      <main>
        {/* PAGE HERO */}
        <section className="page-hero">
          <div className="container page-hero-content">
            <span className="section-label">
              BIBLE STUDIES
            </span>

            <h1>
              Explore Scripture.
              <em> Understand the Word.</em>
            </h1>

            <p>
              Thoughtful Bible studies designed to
              help you discover biblical truth,
              understand Scripture in context, and
              grow in your knowledge and faith.
            </p>

            <div className="page-search">
              <Search size={19} />

              <input
                id="bible-study-search"
                name="bibleStudySearch"
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search Bible studies..."
                aria-label="Search Bible studies"
                autoComplete="off"
              />
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="section studies-intro">
          <div className="container studies-intro-grid">
            <div>
              <span className="section-label">
                START HERE
              </span>

              <h2>
                A clearer path to
                <span> deeper study.</span>
              </h2>
            </div>

            <div>
              <p>
                Scripture invites us to search,
                question, learn, and grow. Pilgrim
                Truth provides structured studies
                that make important biblical topics
                easier to explore.
              </p>

              <p>
                Whether you are beginning your Bible
                journey or looking deeper into a
                familiar subject, start with a study
                that interests you.
              </p>
            </div>
          </div>
        </section>

        {/* STUDY GRID */}
        <section className="section study-library">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">
                  STUDY LIBRARY
                </span>

                <h2>
                  Choose a study.
                </h2>

                <p>
                  Explore biblical foundations,
                  prophecy, history, and Christian
                  living.
                </p>
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div
                className="study-search-empty"
                role="status"
                aria-live="polite"
              >
                <BookOpen size={28} />

                <h3>
                  Loading Bible Studies
                </h3>

                <p>
                  Preparing the latest studies
                  from Pilgrim Truth.
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div
                className="study-search-empty"
                role="alert"
              >
                <Search size={28} />

                <h3>
                  Unable to load studies
                </h3>

                <p>{error}</p>
              </div>
            )}

            {/* EMPTY SEARCH */}
            {!loading &&
              !error &&
              filteredStudies.length === 0 && (
                <div className="study-search-empty">
                  <Search size={28} />

                  <h3>
                    {searchQuery.trim()
                      ? "No studies found"
                      : "No Bible Studies available"}
                  </h3>

                  <p>
                    {searchQuery.trim()
                      ? "Try a different search term."
                      : "Published Bible Studies will appear here when available."}
                  </p>
                </div>
              )}

            {/* STUDIES */}
            {!loading &&
              !error &&
              filteredStudies.length > 0 && (
                <div className="study-library-grid">
                  {filteredStudies.map((study) => {
                    const imageUrl = getImageUrl(
                      study.featured_image ||
                        study.image
                    );

                    const studyTitle =
                      study.title ||
                      "Bible Study";

                    const studyDescription =
                      study.description ||
                      study.excerpt ||
                      "Explore this Bible Study and discover more from Scripture.";

                    const studySlug =
                      study.slug ||
                      study.id;

                    return (
                      <article
                        className="library-card"
                        key={study.id}
                      >
                        <div className="library-card-top">
                          <div className="library-icon">
                            <BookOpen
                              size={21}
                            />
                          </div>

                          <span className="library-category">
                            {study.category ||
                              "BIBLE STUDY"}
                          </span>
                        </div>

                        {imageUrl && (
                          <div className="library-card-image">
                            <img
                              src={imageUrl}
                              alt={studyTitle}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}

                        <h3>
                          {studyTitle}
                        </h3>

                        <p>
                          {studyDescription}
                        </p>

                        {study.scripture_reference && (
                          <span className="library-scripture">
                            {
                              study.scripture_reference
                            }
                          </span>
                        )}

                        <div className="library-card-bottom">
                          <span className="study-duration">
                            <Clock3
                              size={15}
                            />

                            {getReadingTime(
                              study.content
                            )}
                          </span>

                          <Link
                            to={`/bible-studies/${studySlug}`}
                            className="study-open"
                            aria-label={`Explore ${studyTitle}`}
                          >
                            Explore

                            <ArrowRight
                              size={15}
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
          </div>
        </section>

        {/* FEATURED CTA */}
        <section className="section studies-cta">
          <div className="container studies-cta-content">
            <div>
              <span className="section-label">
                GO DEEPER
              </span>

              <h2>
                The more you search,
                <em>
                  the more you discover.
                </em>
              </h2>

              <p>
                Take time to examine Scripture
                carefully and allow its message to
                shape your understanding.
              </p>
            </div>

            <Link
              to="/prophecy"
              className="btn btn-primary"
            >
              Explore Prophecy
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BibleStudies;