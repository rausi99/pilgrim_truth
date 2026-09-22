import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Clock3, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import articles from "../../data/articles";

function ArticleDetail() {
  const { slug } = useParams();

  const articleIndex = articles.findIndex(
    (article) => article.slug === slug
  );

  const article = articles[articleIndex];

  const relatedArticles = useMemo(() => {
    if (!article) return [];

    return articles
      .filter(
        (item) =>
          item.slug !== article.slug &&
          item.category === article.category
      )
      .slice(0, 3);
  }, [article]);

  if (!article) {
    return (
      <div className="inner-page">
        <Navbar />

        <main className="article-not-found">
          <div className="container">
            <span className="section-label">ARTICLE NOT FOUND</span>

            <h1>We couldn't find that article.</h1>

            <p>
              The article may have been moved or the link may be incorrect.
            </p>

            <Link to="/articles" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to Articles
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const previousArticle =
    articleIndex > 0 ? articles[articleIndex - 1] : null;

  const nextArticle =
    articleIndex < articles.length - 1
      ? articles[articleIndex + 1]
      : null;

  return (
    <div className="inner-page article-detail-page">
      <Navbar />

      <main>
        <section className="article-detail-hero">
          <div className="container">
            <Link to="/articles" className="article-back-link">
              <ArrowLeft size={16} />
              Back to Articles
            </Link>

            <div className="article-detail-category">
              <Tag size={15} />
              {article.category}
            </div>

            <h1>{article.title}</h1>

            <p className="article-detail-description">
              {article.description}
            </p>

            <div className="article-detail-meta">
              <span>
                <Clock3 size={15} />
                {article.duration}
              </span>

              <span>{article.date}</span>

              <span>By {article.author}</span>
            </div>
          </div>
        </section>

        <section className="section article-detail-content-section">
          <div className="container article-detail-layout">
            <article className="article-detail-content">
              <img
                src={article.image}
                alt={article.title}
                className="article-detail-image"
              />

              <div className="article-body">
                {article.content.map((block, index) => {
                  if (block.type === "heading") {
                    return (
                      <h2 key={index}>
                        {block.text}
                      </h2>
                    );
                  }

                  return (
                    <p key={index}>
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </article>

            <aside className="article-detail-sidebar">
              <div className="article-sidebar-card">
                <span className="section-label">
                  ABOUT THIS ARTICLE
                </span>

                <h3>Keep exploring.</h3>

                <p>
                  Continue studying Scripture and exploring thoughtful
                  perspectives through Pilgrim Truth.
                </p>

                <Link to="/articles" className="sidebar-link">
                  Browse all articles
                  <ArrowRight size={15} />
                </Link>
              </div>

              {relatedArticles.length > 0 && (
                <div className="article-sidebar-card">
                  <span className="section-label">
                    RELATED ARTICLES
                  </span>

                  <div className="related-article-list">
                    {relatedArticles.map((related) => (
                      <Link
                        to={`/articles/${related.slug}`}
                        className="related-article"
                        key={related.slug}
                      >
                        <span>{related.category}</span>

                        <strong>{related.title}</strong>

                        <ArrowRight size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="article-navigation-section">
          <div className="container article-navigation">
            {previousArticle ? (
              <Link
                to={`/articles/${previousArticle.slug}`}
                className="article-nav-card"
              >
                <span>
                  <ArrowLeft size={15} />
                  Previous Article
                </span>

                <strong>{previousArticle.title}</strong>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle && (
              <Link
                to={`/articles/${nextArticle.slug}`}
                className="article-nav-card article-nav-next"
              >
                <span>
                  Next Article
                  <ArrowRight size={15} />
                </span>

                <strong>{nextArticle.title}</strong>
              </Link>
            )}
          </div>
        </section>

        <section className="section article-detail-cta">
          <div className="container">
            <span className="section-label">
              KEEP EXPLORING
            </span>

            <h2>
              Keep seeking truth.
              <em>Keep studying Scripture.</em>
            </h2>

            <Link to="/articles" className="btn btn-primary">
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