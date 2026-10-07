import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Flame,
  User,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import "./ProphecyDetail.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function getReadingTime(content = "") {
  const words = String(content || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (!words) {
    return "5 min read";
  }

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
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

function ProphecyDetail() {
  const { slug } = useParams();

  const [prophecy, setProphecy] = useState(null);
  const [prophecies, setProphecies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProphecy = async () => {
      try {
        setLoading(true);
        setError("");

        const [prophecyResponse, propheciesResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/content/public/prophecy/${slug}`
            ),
            fetch(
              `${API_URL}/content/public/prophecy`
            ),
          ]);

        const prophecyData =
          await prophecyResponse.json();

        const propheciesData =
          await propheciesResponse.json();

        if (!prophecyResponse.ok) {
          throw new Error(
            prophecyData.message ||
              "Unable to load this prophecy study."
          );
        }

        if (!propheciesResponse.ok) {
          throw new Error(
            propheciesData.message ||
              "Unable to load prophecy studies."
          );
        }

        if (!mounted) {
          return;
        }

        setProphecy(prophecyData.prophecy);

        setProphecies(
          Array.isArray(propheciesData.prophecies)
            ? propheciesData.prophecies
            : []
        );
      } catch (err) {
        console.error(
          "Load Prophecy detail error:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load this prophecy study."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProphecy();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const navigation = useMemo(() => {
    if (!prophecy || prophecies.length === 0) {
      return {
        previous: null,
        next: null,
      };
    }

    const currentIndex =
      prophecies.findIndex(
        (item) => item.slug === prophecy.slug
      );

    if (currentIndex === -1) {
      return {
        previous: null,
        next: null,
      };
    }

    return {
      previous:
        currentIndex < prophecies.length - 1
          ? prophecies[currentIndex + 1]
          : null,

      next:
        currentIndex > 0
          ? prophecies[currentIndex - 1]
          : null,
    };
  }, [prophecy, prophecies]);

  if (loading) {
    return (
      <div className="inner-page prophecy-detail-page">
        <Navbar />

        <main>
          <section className="prophecy-detail-loading">
            <div className="container">
              <div className="prophecy-detail-loading-icon">
                <Flame size={30} />
              </div>

              <span className="section-label">
                BIBLICAL PROPHECY
              </span>

              <h1>Loading Prophecy Study</h1>

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

  if (error || !prophecy) {
    return (
      <div className="inner-page prophecy-detail-page">
        <Navbar />

        <main>
          <section className="prophecy-detail-error">
            <div className="container">
              <div className="prophecy-detail-error-icon">
                <Flame size={30} />
              </div>

              <span className="section-label">
                BIBLICAL PROPHECY
              </span>

              <h1>
                Prophecy study not available.
              </h1>

              <p>
                {error ||
                  "The prophecy study you are looking for could not be found."}
              </p>

              <Link
                to="/prophecy"
                className="btn btn-primary"
              >
                <ArrowLeft size={16} />
                Back to Prophecy
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const paragraphs = String(
    prophecy.content || ""
  )
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="inner-page prophecy-detail-page">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="prophecy-detail-hero">
          <div className="container">
            <Link
              to="/prophecy"
              className="prophecy-detail-back"
            >
              <ArrowLeft size={16} />
              Back to Prophecy
            </Link>

            <div className="prophecy-detail-hero-content">
              <div className="prophecy-detail-category">
                <Flame size={15} />

                <span>
                  {prophecy.category ||
                    "BIBLICAL PROPHECY"}
                </span>
              </div>

              <h1>{prophecy.title}</h1>

              {prophecy.description && (
                <p className="prophecy-detail-description">
                  {prophecy.description}
                </p>
              )}

              <div className="prophecy-detail-meta">
                {prophecy.scripture_reference && (
                  <span>
                    <BookOpen size={15} />
                    {prophecy.scripture_reference}
                  </span>
                )}

                <span>
                  <Clock3 size={15} />
                  {getReadingTime(prophecy.content)}
                </span>

                {prophecy.published_at && (
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(prophecy.published_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* READING */}
        <section className="section prophecy-reading-section">
          <div className="container prophecy-reading-layout">
            <article className="prophecy-reading-content">
              {prophecy.scripture_reference && (
                <div className="prophecy-scripture-card">
                  <div className="prophecy-scripture-icon">
                    <BookOpen size={20} />
                  </div>

                  <div>
                    <span>
                      SCRIPTURE REFERENCE
                    </span>

                    <strong>
                      {prophecy.scripture_reference}
                    </strong>
                  </div>
                </div>
              )}

              <div className="prophecy-content">
                {paragraphs.length > 0 ? (
                  paragraphs.map(
                    (paragraph, index) => (
                      <p key={index}>
                        {paragraph}
                      </p>
                    )
                  )
                ) : (
                  <p>
                    This prophecy study does not
                    have published content yet.
                  </p>
                )}
              </div>

              {prophecy.author && (
                <div className="prophecy-author">
                  <div className="prophecy-author-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>Written by</span>
                    <strong>
                      {prophecy.author}
                    </strong>
                  </div>
                </div>
              )}
            </article>

            <aside className="prophecy-reading-sidebar">
              <div className="prophecy-sidebar-card">
                <div className="prophecy-sidebar-icon">
                  <Flame size={20} />
                </div>

                <span className="section-label">
                  KEEP SEARCHING
                </span>

                <h3>
                  Continue your prophecy study.
                </h3>

                <p>
                  Explore more biblical prophecy
                  studies and discover connections
                  throughout Scripture.
                </p>

                <Link
                  to="/prophecy"
                  className="prophecy-sidebar-link"
                >
                  View all prophecy studies
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* PREVIOUS / NEXT */}
        {(navigation.previous ||
          navigation.next) && (
          <section className="prophecy-navigation">
            <div className="container prophecy-navigation-grid">
              {navigation.previous ? (
                <Link
                  to={`/prophecy/${navigation.previous.slug}`}
                  className="prophecy-nav-card"
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
                  to={`/prophecy/${navigation.next.slug}`}
                  className="prophecy-nav-card prophecy-nav-card-next"
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

export default ProphecyDetail;