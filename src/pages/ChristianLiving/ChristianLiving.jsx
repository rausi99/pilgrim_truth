import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Lightbulb,
  ShieldCheck,
  Users,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./ChristianLiving.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const categoryIcons = {
  "Faith & Character": Heart,
  Relationships: Users,
  "Wisdom for Life": Lightbulb,
  "Faith Under Pressure": ShieldCheck,
};

const categoryDescription = {
  "Faith & Character":
    "Explore the foundations of Christian character, faith, integrity, and spiritual maturity.",
  Relationships:
    "Discover biblical wisdom for friendships, family, marriage, community, and healthy relationships.",
  "Wisdom for Life":
    "Apply biblical principles to everyday decisions, work, purpose, habits, and personal growth.",
  "Faith Under Pressure":
    "Learn how Scripture speaks to trials, temptation, uncertainty, suffering, and perseverance.",
};

function getImageUrl(image) {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const backendUrl = API_URL.replace("/api", "");

  if (image.startsWith("/")) {
    return `${backendUrl}${image}`;
  }

  return `${backendUrl}/${image.replace(/^\/+/, "")}`;
}

function getExcerpt(text, length = 150) {
  if (!text) return "";

  const cleanText = text.replace(/<[^>]*>/g, "").trim();

  if (cleanText.length <= length) {
    return cleanText;
  }

  return `${cleanText.substring(0, length).trim()}...`;
}

export default function ChristianLiving() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/content/public/christian-living`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load Christian Living studies."
          );
        }

        setStudies(data.studies || []);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Christian Living error:", err);

        setError(
          err.message ||
            "Unable to load Christian Living studies."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudies();

    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    return [
      ...new Set(
        studies
          .map((study) => study.category)
          .filter(Boolean)
      ),
    ];
  }, [studies]);

  const featuredStudy = useMemo(() => {
    return (
      studies.find((study) => study.is_featured) ||
      studies[0] ||
      null
    );
  }, [studies]);

  const filteredStudies = useMemo(() => {
    if (activeCategory === "All") {
      return studies;
    }

    return studies.filter(
      (study) => study.category === activeCategory
    );
  }, [studies, activeCategory]);

  const displayCategories =
    categories.length > 0
      ? categories
      : Object.keys(categoryIcons);

  return (
    <>
      <Navbar />

      <main className="christian-living-page">
        {/* HERO */}
        <section className="christian-living-hero">
          <div className="christian-living-hero-inner">
            <span className="section-label">
              CHRISTIAN LIVING
            </span>

            <h1>
              Faith that shapes
              <br />
              everyday life.
            </h1>

            <p>
              Practical, Scripture-centered guidance
              for following Christ in character,
              relationships, work, decisions, and
              everyday life.
            </p>
          </div>
        </section>

        {/* INTRO */}
        <section className="christian-living-intro">
          <div className="christian-living-intro-inner">
            <div>
              <span className="section-label">
                LIVING THE FAITH
              </span>

              <h2>
                Christianity is more than what we
                believe.
              </h2>
            </div>

            <p>
              Scripture speaks not only to what we
              believe, but also to how we live. These
              studies explore practical questions of
              Christian character, relationships,
              purpose, wisdom, temptation, and
              spiritual growth.
            </p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="christian-living-categories">
          <div className="christian-living-container">
            <div className="section-heading">
              <span className="section-label">
                EXPLORE TOPICS
              </span>

              <h2>Areas of Christian Living</h2>
            </div>

            <div className="christian-living-category-grid">
              <button
                type="button"
                className={`christian-living-category ${
                  activeCategory === "All" ? "active" : ""
                }`}
                onClick={() => setActiveCategory("All")}
              >
                <BookOpen size={22} />

                <span>All Studies</span>

                <small>
                  Explore all available Christian
                  Living studies and practical
                  Scripture-centered guidance.
                </small>
              </button>

              {displayCategories.map((category) => {
                const Icon =
                  categoryIcons[category] || BookOpen;

                return (
                  <button
                    type="button"
                    key={category}
                    className={`christian-living-category ${
                      activeCategory === category
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveCategory(category)
                    }
                  >
                    <Icon size={22} />

                    <span>{category}</span>

                    <small>
                      {categoryDescription[category] ||
                        "Explore Scripture-centered guidance for everyday Christian life."}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED STUDY */}
        {featuredStudy && (
          <section className="christian-living-featured">
            <div className="christian-living-container">
              <div className="christian-living-featured-card">
                {getImageUrl(
                  featuredStudy.featured_image
                ) && (
                  <div className="christian-living-featured-image">
                    <img
                      src={getImageUrl(
                        featuredStudy.featured_image
                      )}
                      alt={featuredStudy.title}
                    />
                  </div>
                )}

                <div className="christian-living-featured-content">
                  <span className="section-label">
                    FEATURED STUDY
                  </span>

                  <h2>{featuredStudy.title}</h2>

                  {featuredStudy.scripture_reference && (
                    <div className="christian-living-scripture">
                      <BookOpen size={16} />

                      <span>
                        {featuredStudy.scripture_reference}
                      </span>
                    </div>
                  )}

                  <p>
                    {getExcerpt(
                      featuredStudy.description ||
                        featuredStudy.content,
                      220
                    )}
                  </p>

                  <Link
                    to={`/christian-living/${featuredStudy.slug}`}
                    className="btn btn-primary"
                  >
                    Read the study
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STUDIES */}
        <section className="christian-living-studies">
          <div className="christian-living-container">
            <div className="section-heading">
              <span className="section-label">
                STUDIES
              </span>

              <h2>Practical Christian Living</h2>

              <p>
                Explore studies designed to connect
                biblical truth with everyday life.
              </p>
            </div>

            {loading ? (
              <div className="christian-living-state">
                <div className="christian-living-spinner" />

                <p>Loading studies...</p>
              </div>
            ) : error ? (
              <div className="christian-living-state error">
                <BookOpen size={30} />

                <h3>Unable to load studies</h3>

                <p>{error}</p>
              </div>
            ) : filteredStudies.length === 0 ? (
              <div className="christian-living-state">
                <BookOpen size={30} />

                <h3>No studies available yet</h3>

                <p>
                  Christian Living studies will appear
                  here as they are published.
                </p>
              </div>
            ) : (
              <div className="christian-living-study-grid">
                {filteredStudies.map((study) => (
                  <article
                    className="christian-living-study-card"
                    key={study.id}
                  >
                    {getImageUrl(
                      study.featured_image
                    ) && (
                      <div className="christian-living-study-image">
                        <img
                          src={getImageUrl(
                            study.featured_image
                          )}
                          alt={study.title}
                        />
                      </div>
                    )}

                    <div className="christian-living-study-body">
                      <span className="study-category">
                        {study.category ||
                          "Christian Living"}
                      </span>

                      <h3>{study.title}</h3>

                      <p>
                        {getExcerpt(
                          study.description ||
                            study.content,
                          150
                        )}
                      </p>

                      {study.scripture_reference && (
                        <div className="study-scripture">
                          <BookOpen size={15} />

                          <span>
                            {study.scripture_reference}
                          </span>
                        </div>
                      )}

                      <Link
                        to={`/christian-living/${study.slug}`}
                        className="study-read-link"
                      >
                        Read study
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SCRIPTURE */}
        <section className="christian-living-quote">
          <div className="christian-living-container">
            <blockquote>
              “Whatever you do, do it all for the
              glory of God.”
            </blockquote>

            <span>1 Corinthians 10:31</span>
          </div>
        </section>

        {/* CTA */}
        <section className="christian-living-cta">
          <div className="christian-living-container">
            <span className="section-label">
              KEEP GROWING
            </span>

            <h2>
              Let biblical truth shape everyday life.
            </h2>

            <p>
              Continue exploring Scripture,
              Christian history, prophecy, and
              practical faith.
            </p>

            <Link
              to="/bible-studies"
              className="btn btn-primary"
            >
              Explore Bible Studies
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
