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

import "./BibleStudyDetail.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(
  /\/api\/?$/,
  ""
);

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  const imageValue = String(image).trim();

  if (!imageValue) {
    return "";
  }

  if (
    imageValue.startsWith("http://") ||
    imageValue.startsWith("https://") ||
    imageValue.startsWith("data:")
  ) {
    return imageValue;
  }

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

  return `${Math.max(
    1,
    Math.ceil(words / 200)
  )} min read`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getContentParagraphs(content = "") {
  const text = String(content || "").trim();

  if (!text) {
    return [];
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function BibleStudyDetail() {
  const { slug } = useParams();

  const [study, setStudy] = useState(null);
  const [studies, setStudies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStudy = async () => {
      if (!slug) {
        if (mounted) {
          setError(
            "The Bible Study could not be identified."
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          studyResponse,
          studiesResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/content/public/bible-studies/${encodeURIComponent(
              slug
            )}`
          ),
          fetch(
            `${API_URL}/content/public/bible-studies`
          ),
        ]);

        let studyData = {};
        let studiesData = {};

        try {
          studyData =
            await studyResponse.json();
        } catch {
          studyData = {};
        }

        try {
          studiesData =
            await studiesResponse.json();
        } catch {
          studiesData = {};
        }

        if (!studyResponse.ok) {
          throw new Error(
            studyData?.message ||
              "Unable to load this Bible Study."
          );
        }

        if (!studiesResponse.ok) {
          throw new Error(
            studiesData?.message ||
              "Unable to load Bible Studies."
          );
        }

        const loadedStudy =
          studyData?.study || studyData;

        const loadedStudies =
          Array.isArray(studiesData)
            ? studiesData
            : Array.isArray(
                studiesData?.studies
              )
            ? studiesData.studies
            : [];

        if (!mounted) {
          return;
        }

        if (
          !loadedStudy ||
          typeof loadedStudy !== "object" ||
          Array.isArray(loadedStudy)
        ) {
          throw new Error(
            "The requested Bible Study was not found."
          );
        }

        setStudy(loadedStudy);
        setStudies(loadedStudies);
      } catch (err) {
        console.error(
          "Load Bible Study detail error:",
          err
        );

        if (mounted) {
          setStudy(null);
          setStudies([]);

          setError(
            err.message ||
              "Unable to load this Bible Study."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStudy();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const navigation = useMemo(() => {
    if (
      !study ||
      !Array.isArray(studies) ||
      studies.length === 0
    ) {
      return {
        previous: null,
        next: null,
      };
    }

    const currentIndex =
      studies.findIndex((item) => {
        if (!item) {
          return false;
        }

        if (
          study.id &&
          item.id &&
          Number(item.id) === Number(study.id)
        ) {
          return true;
        }

        return (
          item.slug &&
          study.slug &&
          item.slug === study.slug
        );
      });

    if (currentIndex === -1) {
      return {
        previous: null,
        next: null,
      };
    }

    return {
      previous:
        currentIndex <
        studies.length - 1
          ? studies[currentIndex + 1]
          : null,

      next:
        currentIndex > 0
          ? studies[currentIndex - 1]
          : null,
    };
  }, [study, studies]);

  const contentParagraphs = useMemo(
    () =>
      getContentParagraphs(
        study?.content
      ),
    [study?.content]
  );

  const studyImage = getImageUrl(
    study?.featured_image ||
      study?.image
  );

  if (loading) {
    return (
      <div className="inner-page">
        <Navbar />

        <main className="bible-study-detail-page">
          <div
            className="bible-study-detail-loading"
            role="status"
            aria-live="polite"
          >
            <BookOpen size={32} />

            <h2>
              Loading Bible Study
            </h2>

            <p>
              Preparing the study for you.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="inner-page">
        <Navbar />

        <main className="bible-study-detail-page">
          <section className="bible-study-detail-error">
            <div className="container">
              <BookOpen size={34} />

              <span className="section-label">
                BIBLE STUDIES
              </span>

              <h1>
                Study not available.
              </h1>

              <p>
                {error ||
                  "The Bible Study you are looking for could not be found."}
              </p>

              <Link
                to="/bible-studies"
                className="btn btn-primary"
              >
                <ArrowLeft size={16} />
                Back to Bible Studies
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const studyTitle =
    study.title || "Bible Study";

  const studyDescription =
    study.description ||
    study.excerpt ||
    "";

  const studySlug =
    study.slug || study.id;

  return (
    <div className="inner-page">
      <Navbar />

      <main className="bible-study-detail-page">
        {/* HERO */}
        <section className="bible-study-detail-hero">
          <div className="container">
            <Link
              to="/bible-studies"
              className="bible-study-back-link"
            >
              <ArrowLeft size={16} />
              Back to Bible Studies
            </Link>

            <div className="bible-study-detail-hero-content">
              <span className="section-label">
                {study.category ||
                  "BIBLE STUDY"}
              </span>

              <h1>{studyTitle}</h1>

              {studyDescription && (
                <p className="bible-study-detail-description">
                  {studyDescription}
                </p>
              )}

              <div className="bible-study-meta">
                {study.scripture_reference && (
                  <span>
                    <BookOpen size={15} />
                    {study.scripture_reference}
                  </span>
                )}

                <span>
                  <Clock3 size={15} />
                  {getReadingTime(
                    study.content
                  )}
                </span>

                {study.published_at && (
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(
                      study.published_at
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="section bible-study-reading-section">
          <div className="container bible-study-reading-layout">
            <article className="bible-study-reading-content">
              {studyImage && (
                <div className="bible-study-featured-image">
                  <img
                    src={studyImage}
                    alt={studyTitle}
                    loading="eager"
                    onError={(event) => {
                      event.currentTarget.parentElement.style.display =
                        "none";
                    }}
                  />
                </div>
              )}

              {study.scripture_reference && (
                <div className="bible-study-scripture-card">
                  <span>
                    SCRIPTURE REFERENCE
                  </span>

                  <strong>
                    {study.scripture_reference}
                  </strong>
                </div>
              )}

              <div className="bible-study-content">
                {contentParagraphs.length > 0 ? (
                  contentParagraphs.map(
                    (paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  )
                ) : (
                  <p>
                    This Bible Study does not
                    have published content yet.
                  </p>
                )}
              </div>

              {study.author && (
                <div className="bible-study-author">
                  <div className="bible-study-author-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>
                      Written by
                    </span>

                    <strong>
                      {study.author}
                    </strong>
                  </div>
                </div>
              )}
            </article>

            <aside className="bible-study-reading-sidebar">
              <div className="bible-study-sidebar-card">
                <span className="section-label">
                  KEEP EXPLORING
                </span>

                <h3>
                  Continue your study.
                </h3>

                <p>
                  Explore more Bible Studies
                  from Pilgrim Truth.
                </p>

                <Link
                  to="/bible-studies"
                  className="study-sidebar-link"
                >
                  View all studies
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* PREVIOUS / NEXT */}
        {(navigation.previous ||
          navigation.next) && (
          <section className="bible-study-navigation">
            <div className="container bible-study-navigation-grid">
              {navigation.previous ? (
                <Link
                  to={`/bible-studies/${navigation.previous.slug || navigation.previous.id}`}
                  className="bible-study-nav-card"
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

              {navigation.next ? (
                <Link
                  to={`/bible-studies/${navigation.next.slug || navigation.next.id}`}
                  className="bible-study-nav-card bible-study-nav-card-next"
                >
                  <span>
                    Next study
                    <ArrowRight size={15} />
                  </span>

                  <strong>
                    {navigation.next.title}
                  </strong>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default BibleStudyDetail;