import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Edit3,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./AdminProphecies.css";

import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminProphecy,
  getAdminProphecies,
} from "../../services/admin";

function AdminProphecies() {
  const { token } = useAuth();

  const [prophecies, setProphecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deletingProphecy, setDeletingProphecy] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  useEffect(() => {
    const loadProphecies = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminProphecies(token);

        setProphecies(data.prophecies || []);
      } catch (error) {
        console.error(
          "Prophecies loading error:",
          error
        );

        setError(
          error.message ||
          "Unable to load prophecies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProphecies();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        prophecies
          .map((prophecy) => prophecy.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [prophecies]);

  const filteredProphecies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return prophecies.filter((prophecy) => {
      const matchesSearch =
        query === "" ||
        prophecy.title
          ?.toLowerCase()
          .includes(query) ||
        prophecy.category
          ?.toLowerCase()
          .includes(query) ||
        prophecy.scripture_reference
          ?.toLowerCase()
          .includes(query) ||
        prophecy.author
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        prophecy.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        prophecy.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    prophecies,
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

  const handleDeleteProphecy = async () => {
    if (!deletingProphecy || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminProphecy(
        token,
        deletingProphecy.id
      );

      setProphecies((previous) =>
        previous.filter(
          (prophecy) =>
            prophecy.id !== deletingProphecy.id
        )
      );

      setDeletingProphecy(null);
    } catch (error) {
      console.error(
        "Delete prophecy error:",
        error
      );

      setDeleteError(
        error.message ||
        "Unable to delete prophecy."
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

          <h1>Prophecy</h1>

          <p>
            Create, manage, publish, and organize
            Pilgrim Truth prophecy content.
          </p>
        </div>

        <Link
          to="/admin/prophecy/new"
          className="admin-primary-button"
        >
          <Plus size={16} />
          New Prophecy
        </Link>

      </section>

      <section className="admin-content-toolbar">

        <div className="admin-search-box">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search prophecies..."
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

          <option value="scheduled">
            Scheduled
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          className="admin-filter-select"
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

      {error && (
        <div className="admin-stats-error">
          {error}
        </div>
      )}

      <section className="admin-panel admin-articles-panel">

        {loading ? (
          <div className="admin-table-state">

            <Search size={28} />

            <h3>
              Loading prophecies...
            </h3>

            <p>
              Retrieving prophecy content from the database.
            </p>

          </div>
        ) : filteredProphecies.length === 0 ? (
          <div className="admin-table-state">

            <Search size={28} />

            <h3>
              No prophecies found
            </h3>

            <p>
              {prophecies.length === 0
                ? "Create your first Pilgrim Truth prophecy."
                : "Try changing your search or filters."}
            </p>

            {prophecies.length === 0 && (
              <Link
                to="/admin/prophecy/new"
                className="admin-primary-button"
              >
                <Plus size={16} />
                Create Prophecy
              </Link>
            )}

          </div>
        ) : (
          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Prophecy</th>
                  <th>Category</th>
                  <th>Scripture</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredProphecies.map(
                  (prophecy) => (
                    <tr key={prophecy.id}>

                      <td>
                        <div className="admin-article-title">

                          <div className="admin-article-icon">
                            <Star size={17} />
                          </div>

                          <div>
                            <strong>
                              {prophecy.title}
                            </strong>

                            <span>
                              /{prophecy.slug}
                            </span>

                            {prophecy.is_featured && (
                              <small>
                                <Star
                                  size={12}
                                  fill="currentColor"
                                />
                                Featured
                              </small>
                            )}
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="admin-category">
                          {prophecy.category}
                        </span>
                      </td>

                      <td>
                        <span className="admin-scripture-cell">
                          {prophecy.scripture_reference ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status ${prophecy.status}`}
                        >
                          {prophecy.status}
                        </span>
                      </td>

                      <td>
                        {prophecy.author || "Unknown"}
                      </td>

                      <td>
                        {formatDate(
                          prophecy.updated_at
                        )}
                      </td>

                      <td>
                        <div className="admin-table-actions">

                          <Link
                            to={`/admin/prophecy/${prophecy.id}/edit`}
                            className="admin-icon-button"
                            title="Edit prophecy"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            type="button"
                            className="admin-icon-button danger"
                            title="Delete prophecy"
                            onClick={() => {
                              setDeleteError("");
                              setDeletingProphecy(
                                prophecy
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

      {!loading && prophecies.length > 0 && (
        <div className="admin-results-summary">

          Showing{" "}

          <strong>
            {filteredProphecies.length}
          </strong>{" "}

          of{" "}

          <strong>
            {prophecies.length}
          </strong>{" "}

          prophecies

        </div>
      )}

      {deletingProphecy && (
        <div className="admin-modal-backdrop">

          <div className="admin-delete-modal">

            <button
              type="button"
              className="admin-delete-modal-close"
              onClick={() => {
                if (!deleteLoading) {
                  setDeletingProphecy(null);
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
              DELETE PROPHECY
            </span>

            <h2>
              Delete this prophecy?
            </h2>

            <p>
              You are about to permanently delete:
            </p>

            <strong className="admin-delete-title">
              {deletingProphecy.title}
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
                    setDeletingProphecy(null);
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
                onClick={handleDeleteProphecy}
                disabled={deleteLoading}
              >
                <Trash2 size={16} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Prophecy"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminProphecies;