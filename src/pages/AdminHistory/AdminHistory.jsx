import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Edit3,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminHistory,
  getAdminHistories,
} from "../../services/admin";

import "./AdminHistory.css";

function AdminHistories() {
  const { token } = useAuth();

  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deletingHistory, setDeletingHistory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadHistories = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminHistories(token);

        setHistories(data.histories || []);
      } catch (error) {
        console.error("Histories loading error:", error);

        setError(
          error.message ||
            "Unable to load history studies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistories();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        histories
          .map((history) => history.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [histories]);

  const filteredHistories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return histories.filter((history) => {
      const matchesSearch =
        query === "" ||
        history.title
          ?.toLowerCase()
          .includes(query) ||
        history.category
          ?.toLowerCase()
          .includes(query) ||
        history.scripture_reference
          ?.toLowerCase()
          .includes(query) ||
        history.author
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        history.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        history.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    histories,
    searchQuery,
    statusFilter,
    categoryFilter,
  ]);

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

  const handleDeleteHistory = async () => {
    if (!deletingHistory || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminHistory(
        token,
        deletingHistory.id
      );

      setHistories((previous) =>
        previous.filter(
          (history) =>
            history.id !== deletingHistory.id
        )
      );

      setDeletingHistory(null);
    } catch (error) {
      console.error(
        "Delete history error:",
        error
      );

      setDeleteError(
        error.message ||
          "Unable to delete history study."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-history">

      {/* HEADER */}

      <section className="ah-header">

        <div className="ah-title-row">

          <div className="ah-icon">
            <BookOpen size={22} />
          </div>

          <div>
            <span className="ah-eyebrow">
              CONTENT MANAGEMENT
            </span>

            <h1>History</h1>

            <p>
              Create, manage, publish, and organize
              Pilgrim Truth biblical history content.
            </p>
          </div>

        </div>

        <Link
          to="/admin/history/new"
          className="ah-primary-btn"
        >
          <Plus size={16} />
          New History
        </Link>

      </section>

      {/* ERROR */}

      {error && (
        <div className="ah-error">
          {error}
        </div>
      )}

      {/* TOOLBAR */}

      <section className="ah-toolbar">

        <div className="ah-search">

          <Search size={17} />

          <input
            type="search"
            placeholder="Search history studies..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

        <select
          className="ah-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
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

          <option value="scheduled">
            Scheduled
          </option>
        </select>

        <select
          className="ah-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

      </section>

      {/* RESULTS */}

      {!loading && histories.length > 0 && (
        <div className="ah-results">

          Showing{" "}
          <strong>
            {filteredHistories.length}
          </strong>{" "}
          of{" "}
          <strong>
            {histories.length}
          </strong>{" "}
          history studies

        </div>
      )}

      {/* TABLE */}

      <section className="ah-table-card">

        {loading ? (
          <div className="ah-empty">

            <div className="ah-empty-icon">
              <BookOpen size={25} />
            </div>

            <h3>
              Loading history studies...
            </h3>

            <p>
              Retrieving history content from
              the database.
            </p>

          </div>
        ) : filteredHistories.length === 0 ? (
          <div className="ah-empty">

            <div className="ah-empty-icon">
              <Search size={25} />
            </div>

            <h3>
              No history studies found
            </h3>

            <p>
              {histories.length === 0
                ? "Create your first Pilgrim Truth history study."
                : "Try changing your search or filters."}
            </p>

            {histories.length === 0 && (
              <Link
                to="/admin/history/new"
                className="ah-primary-btn"
              >
                <Plus size={16} />
                Create History
              </Link>
            )}

          </div>
        ) : (
          <div className="ah-table-wrapper">

            <table className="ah-table">

              <thead>
                <tr>
                  <th>History</th>
                  <th>Category</th>
                  <th>Scripture</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredHistories.map(
                  (history) => (
                    <tr key={history.id}>

                      <td>

                        <div className="ah-history">

                          <div className="ah-history-icon">
                            <BookOpen size={17} />
                          </div>

                          <div className="ah-history-info">

                            <strong>
                              {history.title}
                            </strong>

                            <span>
                              /{history.slug}
                            </span>

                            {history.is_featured && (
                              <small className="ah-featured">
                                <Star
                                  size={11}
                                  fill="currentColor"
                                />
                                Featured
                              </small>
                            )}

                          </div>

                        </div>

                      </td>

                      <td>
                        <span className="ah-category">
                          {history.category || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="ah-scripture">
                          {history.scripture_reference ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ah-status ah-status-${history.status}`}
                        >
                          {history.status}
                        </span>
                      </td>

                      <td>
                        <span className="ah-author">
                          {history.author || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span className="ah-date">
                          {formatDate(
                            history.updated_at
                          )}
                        </span>
                      </td>

                      <td>

                        <div className="ah-actions">

                          <Link
                            to={`/admin/history/${history.id}/edit`}
                            className="ah-action edit"
                            title="Edit history"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            type="button"
                            className="ah-action delete"
                            title="Delete history"
                            onClick={() => {
                              setDeleteError("");
                              setDeletingHistory(
                                history
                              );
                            }}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* DELETE MODAL */}

      {deletingHistory && (
        <div
          className="ah-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleteLoading
            ) {
              setDeletingHistory(null);
              setDeleteError("");
            }
          }}
        >

          <div
            className="ah-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-delete-title"
          >

            <button
              type="button"
              className="ah-modal-close"
              onClick={() => {
                if (!deleteLoading) {
                  setDeletingHistory(null);
                  setDeleteError("");
                }
              }}
              aria-label="Close delete dialog"
            >
              <X size={18} />
            </button>

            <div className="ah-modal-icon">
              <AlertTriangle size={23} />
            </div>

            <span className="ah-eyebrow">
              DELETE HISTORY
            </span>

            <h2 id="history-delete-title">
              Delete this history study?
            </h2>

            <p>
              You are about to permanently delete:
            </p>

            <strong className="ah-delete-title">
              {deletingHistory.title}
            </strong>

            <p>
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="ah-modal-error">
                {deleteError}
              </div>
            )}

            <div className="ah-modal-actions">

              <button
                type="button"
                className="ah-cancel-btn"
                onClick={() => {
                  if (!deleteLoading) {
                    setDeletingHistory(null);
                    setDeleteError("");
                  }
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ah-delete-btn"
                onClick={handleDeleteHistory}
                disabled={deleteLoading}
              >
                <Trash2 size={16} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete History"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminHistories;