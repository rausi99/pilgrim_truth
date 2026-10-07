import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Tag,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./ArticleDetail.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function ArticleDetail() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const [articleResponse, articlesResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/content/public/articles/${encodeURIComponent(
                slug
              )}`,
              {
                signal: controller.signal,
              }
            ),
            fetch(
              `${API_URL}/content/public/articles`,
              {
                signal: controller.signal,
              }
            ),
          ]);

        const articleData =
          await articleResponse.json();

        if (!articleResponse.ok) {
          throw new Error(
            articleData.message ||
              "Unable to load article."
          );
        }

        setArticle(articleData.article);

        if (articlesResponse.ok) {
          const articlesData =
            await articlesResponse.json();

          setArticles(
            articlesData.articles || []
          );
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error(
          "Load article error:",
          err
        );

        setError(
          err.message ||
            "Unable to load this article."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadArticle();
    }

    return () => controller.abort();
  }, [slug]);

  const articleIndex = useMemo(() => {
    if (!article) return -1;

    return articles.findIndex(
      (item) => item.slug === article.slug
    );
  }, [articles, article]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];

    return articles
      .filter(
        (item) =>
          item.slug !== article.slug &&
          item.category === article.category
      )
      .slice(0, 3);
  }, [articles, article]);

  const previousArticle =
    articleIndex > 0
      ? articles[articleIndex - 1]
      : null;

  const nextArticle =
    articleIndex >= 0 &&
    articleIndex < articles.length - 1
      ? articles[articleIndex + 1]
      : null;

  const getDuration = (content) => {
    if (!content) return "1 min read";

    let text = "";

    if (typeof content === "string") {
      text = content.replace(
        /<[^>]*>/g,
        " "
      );
    } else if (Array.isArray(content)) {
      text = content
        .map((block) => block?.text || "")
        .join(" ");
    }

    const words = text
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return `${Math.max(
      1,
      Math.ceil(words / 200)
    )} min read`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const getImageUrl = (image) => {
    if (!image) return null;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_URL.replace(
        /\/api$/,
        ""
      )}${image}`;
    }

    return `${API_URL.replace(
      /\/api$/,
      ""
    )}/${image}`;
  };

  const contentBlocks = useMemo(() => {
    if (!article) return [];

    if (Array.isArray(article.content)) {
      return article.content;
    }

    if (article.content) {
      return [
        {
          type: "paragraph",
          text: article.content,
        },
      ];
    }

    return [];
  }, [article]);

  if (loading) {
    return (
      <div className="inner-page article-detail-page">
        <Navbar />

        <main className="article-detail-status">
          <div className="container">
            <div className="article-status-icon">
              <BookOpen size={22} />
            </div>

            <span className="section-label">
              LOADING ARTICLE
            </span>

            <h1>Loading article...</h1>

            <p>
              Please wait while we prepare this
              article for you.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="inner-page article-detail-page">
        <Navbar />

        <main className="article-detail-status">
          <div className="container">
            <div className="article-status-icon">
              <BookOpen size={22} />
            </div>

            <span className="section-label">
              ARTICLE NOT FOUND
            </span>

            <h1>
              We couldn't find that article.
            </h1>

            <p>
              {error ||
                "The article may have been moved or the link may be incorrect."}
            </p>

            <Link
              to="/articles"
              className="article-detail-button"
            >
              <ArrowLeft size={16} />
              Back to Articles
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const publishedDate =
    article.published_at ||
    article.created_at;

  const featuredImage = getImageUrl(
    article.featured_image
  );

  return (
    <div className="inner-page article-detail-page">
      <Navbar />

      <main>
        {/* HERO */}

        <section className="article-detail-hero">
          <div className="container">
            <Link
              to="/articles"
              className="article-back-link"
            >
              <ArrowLeft size={15} />
              <span>Back to Articles</span>
            </Link>

            <div className="article-detail-header">
              <div className="article-detail-category">
                <Tag size={14} />
                <span>
                  {article.category ||
                    "Article"}
                </span>
              </div>

              <h1>{article.title}</h1>

              {article.description && (
                <p className="article-detail-description">
                  {article.description}
                </p>
              )}

              <div className="article-detail-meta">
                <span>
                  <Clock3 size={15} />
                  {getDuration(
                    article.content
                  )}
                </span>

                {publishedDate && (
                  <>
                    <span className="article-meta-divider">
                      •
                    </span>

                    <span>
                      {formatDate(
                        publishedDate
                      )}
                    </span>
                  </>
                )}

                <span className="article-meta-divider">
                  •
                </span>

                <span>
                  By{" "}
                  {article.author ||
                    "Pilgrim Truth"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <section className="section article-detail-content-section">
          <div className="container article-detail-layout">
            <article className="article-detail-content">
              {featuredImage && (
                <figure className="article-detail-image-wrapper">
                  <img
                    src={featuredImage}
                    alt={article.title}
                    className="article-detail-image"
                  />

                  <figcaption>
                    {article.title}
                  </figcaption>
                </figure>
              )}

              <div className="article-body">
                {contentBlocks.map(
                  (block, index) => {
                    if (!block?.text) {
                      return null;
                    }

                    const key =
                      `${block.type || "text"}-${index}`;

                    if (
                      block.type ===
                      "heading"
                    ) {
                      return (
                        <h2 key={key}>
                          {block.text}
                        </h2>
                      );
                    }

                    if (
                      block.type ===
                      "subheading"
                    ) {
                      return (
                        <h3 key={key}>
                          {block.text}
                        </h3>
                      );
                    }

                    if (
                      block.type ===
                      "quote"
                    ) {
                      return (
                        <blockquote
                          key={key}
                        >
                          {block.text}
                        </blockquote>
                      );
                    }

                    return (
                      <p key={key}>
                        {block.text}
                      </p>
                    );
                  }
                )}
              </div>
            </article>

            {/* SIDEBAR */}

            <aside className="article-detail-sidebar">
              <div className="article-sidebar-card">
                <span className="section-label">
                  ABOUT THIS ARTICLE
                </span>

                <div className="sidebar-icon">
                  <BookOpen size={18} />
                </div>

                <h3>
                  Keep exploring.
                </h3>

                <p>
                  Continue studying Scripture
                  and exploring thoughtful
                  perspectives through Pilgrim
                  Truth.
                </p>

                <Link
                  to="/articles"
                  className="sidebar-link"
                >
                  <span>
                    Browse all articles
                  </span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {relatedArticles.length >
                0 && (
                <div className="article-sidebar-card">
                  <span className="section-label">
                    RELATED ARTICLES
                  </span>

                  <div className="related-article-list">
                    {relatedArticles.map(
                      (related) => (
                        <Link
                          key={
                            related.slug
                          }
                          to={`/articles/${related.slug}`}
                          className="related-article"
                        >
                          <div>
                            <span>
                              {related.category ||
                                "Article"}
                            </span>

                            <strong>
                              {
                                related.title
                              }
                            </strong>
                          </div>

                          <ArrowRight
                            size={15}
                          />
                        </Link>
                      )
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* PREVIOUS / NEXT */}

        {(previousArticle ||
          nextArticle) && (
          <section className="article-navigation-section">
            <div className="container">
              <div className="article-navigation-heading">
                <span className="section-label">
                  CONTINUE READING
                </span>

                <h2>
                  Explore another article.
                </h2>
              </div>

              <div className="article-navigation">
                {previousArticle ? (
                  <Link
                    to={`/articles/${previousArticle.slug}`}
                    className="article-nav-card"
                  >
                    <span>
                      <ArrowLeft
                        size={15}
                      />
                      Previous Article
                    </span>

                    <strong>
                      {
                        previousArticle.title
                      }
                    </strong>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    to={`/articles/${nextArticle.slug}`}
                    className="article-nav-card article-nav-next"
                  >
                    <span>
                      Next Article
                      <ArrowRight
                        size={15}
                      />
                    </span>

                    <strong>
                      {nextArticle.title}
                    </strong>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}

        <section className="section article-detail-cta">
          <div className="container">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Keep seeking truth.
              <em>
                Keep studying Scripture.
              </em>
            </h2>

            <p>
              Discover more articles,
              historical studies and thoughtful
              perspectives through Pilgrim
              Truth.
            </p>

            <Link
              to="/articles"
              className="article-detail-button"
            >
              Explore More Articles
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ArticleDetail;