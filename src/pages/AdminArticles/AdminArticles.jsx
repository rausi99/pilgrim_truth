import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  FileText,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { deleteAdminArticle, getAdminArticles, } from "../../services/admin";
import "./AdminArticles.css";

function AdminArticles() {

  const { token } = useAuth();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingArticle, setDeletingArticle] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  useEffect(() => {
    const loadArticles = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminArticles(token);

        setArticles(data.articles || []);
      } catch (error) {
        console.error("Articles loading error:", error);

        setError(
          error.message ||
          "Unable to load articles."
        );
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [token]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesSearch =
        query === "" ||
        article.title
          ?.toLowerCase()
          .includes(query) ||
        article.category
          ?.toLowerCase()
          .includes(query) ||
        article.author
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        article.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [articles, searchQuery, statusFilter]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-KE",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const handleDeleteArticle = async () => {
    if (!deletingArticle || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminArticle(
        token,
        deletingArticle.id
      );

      setArticles((previous) =>
        previous.filter(
          (article) =>
            article.id !==
            deletingArticle.id
        )
      );

      setDeletingArticle(null);
    } catch (error) {
      console.error(
        "Delete article error:",
        error
      );

      setDeleteError(
        error.message ||
        "Unable to delete article."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-page">

      <section className="admin-page-heading">

        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>Articles</h1>

          <p>
            Create, manage, publish, and organize
            Pilgrim Truth articles.
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="admin-primary-button"
        >
          <Plus size={16} />
          New Article
        </Link>

      </section>

      <section className="admin-content-toolbar">

        <div className="admin-search-box">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="admin-filter-select"
        >
          <option value="all">
            All Statuses
          </option>

          <option value="published">
            Published
          </option>

          <option value="draft">
            Draft
          </option>
        </select>

      </section>

      {error && (
        <div className="admin-stats-error">
          {error}
        </div>
      )}

      <section className="admin-panel admin-articles-panel">

        {loading ? (
          <div className="admin-table-state">
            <FileText size={28} />

            <h3>
              Loading articles...
            </h3>

            <p>
              Retrieving articles from the database.
            </p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="admin-table-state">
            <FileText size={28} />

            <h3>
              No articles found
            </h3>

            <p>
              {articles.length === 0
                ? "Create your first Pilgrim Truth article."
                : "Try changing your search or filter."}
            </p>

            {articles.length === 0 && (
              <Link
                to="/admin/articles/new"
                className="admin-primary-button"
              >
                <Plus size={16} />
                Create Article
              </Link>
            )}
          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredArticles.map((article) => (
                  <tr key={article.id}>

                    <td>
                      <div className="admin-article-title">

                        <div className="admin-article-icon">
                          <FileText size={17} />
                        </div>

                        <div>
                          <strong>
                            {article.title}
                          </strong>

                          <span>
                            /{article.slug}
                          </span>

                          {article.is_featured && (
                            <small>
                              <Star size={12} />
                              Featured
                            </small>
                          )}
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="admin-category">
                        {article.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-status ${article.status}`}
                      >
                        {article.status}
                      </span>
                    </td>

                    <td>
                      {article.author || "Unknown"}
                    </td>

                    <td>
                      {formatDate(
                        article.updated_at
                      )}
                    </td>

                    <td>
                      <div className="admin-table-actions">

                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          className="admin-icon-button"
                          title="Edit article"
                        >
                          <Edit3 size={16} />
                        </Link>

                        <button
                          type="button"
                          className="admin-icon-button danger"
                          title="Delete article"
                          onClick={() => {
                            setDeleteError("");
                            setDeletingArticle(article);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {!loading && articles.length > 0 && (
        <div className="admin-results-summary">
          Showing{" "}
          <strong>
            {filteredArticles.length}
          </strong>{" "}
          of{" "}
          <strong>
            {articles.length}
          </strong>{" "}
          articles
        </div>
      )}

      {deletingArticle && (
        <div className="admin-modal-backdrop">

          <div className="admin-delete-modal">

            <button
              type="button"
              className="admin-delete-modal-close"
              onClick={() => {
                if (!deleteLoading) {
                  setDeletingArticle(null);
                  setDeleteError("");
                }
              }}
              aria-label="Close delete dialog"
            >
              <X size={18} />
            </button>

            <div className="admin-delete-icon">
              <AlertTriangle size={24} />
            </div>

            <span className="admin-eyebrow">
              DELETE ARTICLE
            </span>

            <h2>
              Delete this article?
            </h2>

            <p>
              You are about to permanently delete:
            </p>

            <strong className="admin-delete-title">
              {deletingArticle.title}
            </strong>

            <p>
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="admin-form-alert error">
                {deleteError}
              </div>
            )}

            <div className="admin-delete-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={() => {
                  if (!deleteLoading) {
                    setDeletingArticle(null);
                    setDeleteError("");
                  }
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-delete-confirm"
                onClick={handleDeleteArticle}
                disabled={deleteLoading}
              >
                <Trash2 size={16} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Article"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminArticles;