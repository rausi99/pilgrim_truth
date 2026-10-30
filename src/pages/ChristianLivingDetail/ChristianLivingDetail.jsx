
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

import "./ChristianLivingDetail.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

function getImageUrl(image) {
  if (!image) return "";

  const value = String(image).trim();

  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${BACKEND_URL}${value}`;
  }

  return value;
}

function getReadingTime(content = "") {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getContentParagraphs(content = "") {
  return String(content || "")
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function ChristianLivingDetail() {
  const { slug } = useParams();

  const [study, setStudy] = useState(null);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudy() {
      try {
        setLoading(true);
        setError("");

        const [studyResponse, studiesResponse] = await Promise.all([
          fetch(
            `${API_URL}/content/public/christian-living/${encodeURIComponent(slug)}`,
            { signal: controller.signal }
          ),
          fetch(
            `${API_URL}/content/public/christian-living`,
            { signal: controller.signal }
          ),
        ]);

        const studyData = await studyResponse.json();
        const studiesData = await studiesResponse.json();

        if (!studyResponse.ok) {
          throw new Error(
            studyData?.message || "Unable to load this Christian Living study."
          );
        }

        if (!studiesResponse.ok) {
          throw new Error(
            studiesData?.message || "Unable to load other studies."
          );
        }

        const loadedStudy = studyData?.study || studyData;

        const loadedStudies = Array.isArray(studiesData)
          ? studiesData
          : Array.isArray(studiesData?.studies)
            ? studiesData.studies
            : [];

        if (
          !loadedStudy ||
          typeof loadedStudy !== "object" ||
          Array.isArray(loadedStudy)
        ) {
          throw new Error("The requested study could not be found.");
        }

        if (!controller.signal.aborted) {
          setStudy(loadedStudy);
          setStudies(loadedStudies);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Christian Living detail error:", err);

        setStudy(null);
        setStudies([]);
        setError(
          err.message || "Unable to load this Christian Living study."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      loadStudy();
    } else {
      setError("The requested study could not be identified.");
      setLoading(false);
    }

    return () => controller.abort();
  }, [slug]);

  const navigation = useMemo(() => {
    if (!study || studies.length === 0) {
      return { previous: null, next: null };
    }

    const index = studies.findIndex(
      (item) =>
        (item.id && study.id && Number(item.id) === Number(study.id)) ||
        (item.slug && study.slug && item.slug === study.slug)
    );

    if (index === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: index < studies.length - 1 ? studies[index + 1] : null,
      next: index > 0 ? studies[index - 1] : null,
    };
  }, [study, studies]);

  const paragraphs = useMemo(
    () => getContentParagraphs(study?.content),
    [study?.content]
  );

  const image = getImageUrl(
    study?.featured_image || study?.image
  );

  if (loading) {
    return (
      <div className="inner-page">
        <Navbar />

        <main className="christian-detail-page">
          <div className="christian-detail-state" role="status">
            <BookOpen size={34} />
            <h2>Loading Christian Living Study</h2>
            <p>Preparing the study for you.</p>
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

        <main className="christian-detail-page">
          <section className="christian-detail-error">
            <BookOpen size={36} />

            <span className="section-label">CHRISTIAN LIVING</span>

            <h1>Study not available</h1>

            <p>
              {error || "The study you are looking for could not be found."}
            </p>

            <Link to="/christian-living" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to Christian Living
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const title = study.title || "Christian Living";
  const description = study.description || study.excerpt || "";

  return (
    <div className="inner-page">
      <Navbar />

      <main className="christian-detail-page">
        <section className="christian-detail-hero">
          <div className="container">
            <Link
              to="/christian-living"
              className="christian-detail-back"
            >
              <ArrowLeft size={16} />
              Back to Christian Living
            </Link>

            <div className="christian-detail-hero-content">
              <span className="section-label">
                {study.category || "CHRISTIAN LIVING"}
              </span>

              <h1>{title}</h1>

              {description && (
                <p className="christian-detail-description">
                  {description}
                </p>
              )}

              <div className="christian-detail-meta">
                {study.scripture_reference && (
                  <span>
                    <BookOpen size={15} />
                    {study.scripture_reference}
                  </span>
                )}

                <span>
                  <Clock3 size={15} />
                  {getReadingTime(study.content)}
                </span>

                {study.published_at && (
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(study.published_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section christian-detail-reading">
          <div className="container christian-detail-layout">
            <article className="christian-detail-article">
              {image && (
                <div className="christian-detail-image">
                  <img
                    src={image}
                    alt={title}
                    onError={(event) => {
                      event.currentTarget.parentElement.style.display = "none";
                    }}
                  />
                </div>
              )}

              {study.scripture_reference && (
                <div className="christian-detail-scripture">
                  <span>SCRIPTURE REFERENCE</span>
                  <strong>{study.scripture_reference}</strong>
                </div>
              )}

              <div className="christian-detail-content">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>This study does not have published content yet.</p>
                )}
              </div>

              {(study.author_name || study.author) && (
                <div className="christian-detail-author">
                  <div className="christian-detail-author-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>Written by</span>
                    <strong>{study.author_name || study.author}</strong>
                  </div>
                </div>
              )}
            </article>

            <aside className="christian-detail-sidebar">
              <div className="christian-detail-sidebar-card">
                <span className="section-label">KEEP GROWING</span>

                <h3>Let faith shape everyday life.</h3>

                <p>
                  Explore more Scripture-centered studies and practical
                  Christian guidance.
                </p>

                <Link
                  to="/christian-living"
                  className="christian-detail-sidebar-link"
                >
                  View all studies
                  <ArrowRight size={15} />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {(navigation.previous || navigation.next) && (
          <section className="christian-detail-navigation">
            <div className="container christian-detail-navigation-grid">
              {navigation.previous ? (
                <Link
                  to={`/christian-living/${navigation.previous.slug || navigation.previous.id}`}
                  className="christian-detail-nav-card"
                >
                  <span>
                    <ArrowLeft size={15} />
                    Previous study
                  </span>

                  <strong>{navigation.previous.title}</strong>
                </Link>
              ) : (
                <div />
              )}

              {navigation.next ? (
                <Link
                  to={`/christian-living/${navigation.next.slug || navigation.next.id}`}
                  className="christian-detail-nav-card next"
                >
                  <span>
                    Next study
                    <ArrowRight size={15} />
                  </span>

                  <strong>{navigation.next.title}</strong>
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
