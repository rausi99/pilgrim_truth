import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Edit3,
  FileText,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./AdminDailyInspirations.css"

import { useAuth } from "../../context/AuthContext";
import {deleteAdminDailyInspiration,getAdminDailyInspirations,} from "../../services/admin";

function AdminDailyInspirations() {
  const { token } = useAuth();

  const [inspirations, setInspirations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [deletingInspiration, setDeletingInspiration] =
    useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadInspirations = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminDailyInspirations(token);

        setInspirations(data.inspirations || []);
      } catch (err) {
        console.error(
          "Load Daily Inspirations error:",
          err
        );

        setError(
          err.message ||
            "Unable to load Daily Inspirations."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInspirations();
  }, [token]);

  const filteredInspirations = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return inspirations.filter((inspiration) => {
      const matchesSearch =
        !search ||
        inspiration.title
          ?.toLowerCase()
          .includes(search) ||
        inspiration.scripture_reference
          ?.toLowerCase()
          .includes(search) ||
        inspiration.author
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        inspiration.status === statusFilter;

      const matchesDate =
        !dateFilter ||
        inspiration.inspiration_date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [
    inspirations,
    searchTerm,
    statusFilter,
    dateFilter,
  ]);

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(
      `${value}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(date);
  };

  const getStatusLabel = (status) => {
    if (status === "published") {
      return "Published";
    }

    if (status === "scheduled") {
      return "Scheduled";
    }

    return "Draft";
  };

  const handleDelete = async () => {
    if (!deletingInspiration || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminDailyInspiration(
        token,
        deletingInspiration.id
      );

      setInspirations((previous) =>
        previous.filter(
          (inspiration) =>
            inspiration.id !==
            deletingInspiration.id
        )
      );

      setDeletingInspiration(null);
    } catch (err) {
      console.error(
        "Delete Daily Inspiration error:",
        err
      );

      setDeleteError(
        err.message ||
          "Unable to delete Daily Inspiration."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  if (loading) {
    return (
      <div className="admin-form-loading">
        <CalendarDays
          size={34}
          className="admin-loading-spinner"
        />

        <h2>
          Loading Daily Inspirations
        </h2>

        <p>
          Please wait while your
          inspirations are loaded.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            Content
          </span>

          <h1>Daily Inspirations</h1>

          <p>
            Manage daily Scripture,
            reflections, applications,
            and prayer prompts.
          </p>
        </div>

        <Link
          to="/admin/daily-inspirations/new"
          className="admin-primary-button"
        >
          <Plus size={17} />
          New Inspiration
        </Link>
      </div>

      {error && (
        <div className="admin-form-alert error">
          {error}
        </div>
      )}

      <div className="admin-content-card">
        <div className="admin-filter-bar">
          <div className="admin-search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search title, Scripture or author..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="admin-filter-select"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="published">
              Published
            </option>

            <option value="scheduled">
              Scheduled
            </option>

            <option value="draft">
              Draft
            </option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value
              )
            }
            className="admin-filter-date"
          />

          {(searchTerm ||
            statusFilter !== "all" ||
            dateFilter) && (
            <button
              type="button"
              className="admin-clear-filter"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        <div className="admin-results-summary">
          <span>
            {filteredInspirations.length}{" "}
            inspiration
            {filteredInspirations.length !==
            1
              ? "s"
              : ""}
          </span>

          <span>
            {inspirations.length} total
          </span>
        </div>

        {filteredInspirations.length ===
        0 ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">
              <FileText size={28} />
            </div>

            <h2>
              No Daily Inspirations
            </h2>

            <p>
              {inspirations.length === 0
                ? "Create your first Daily Inspiration to begin building your archive."
                : "No inspirations match your current filters."}
            </p>

            {inspirations.length === 0 ? (
              <Link
                to="/admin/daily-inspirations/new"
                className="admin-primary-button"
              >
                <Plus size={17} />
                Create Inspiration
              </Link>
            ) : (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Daily Inspiration</th>
                  <th>Scripture</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th className="admin-actions-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredInspirations.map(
                  (inspiration) => (
                    <tr
                      key={
                        inspiration.id
                      }
                    >
                      <td>
                        <div className="admin-date-cell">
                          <CalendarDays
                            size={15}
                          />

                          <span>
                            {formatDate(
                              inspiration.inspiration_date
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-inspiration-title">
                          <div>
                            {inspiration.title}
                          </div>

                          {inspiration.status === "published" && (
                           <Star size={14} />
                          )}
                        </div>
                      </td>

                      <td>
                        <span className="admin-scripture-cell">
                          {
                            inspiration.scripture_reference
                          }
                        </span>
                      </td>

                      <td>
                        <span className="admin-author-cell">
                          {inspiration.author ||
                            "Unknown"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${inspiration.status}`}
                        >
                          {getStatusLabel(
                            inspiration.status
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/daily-inspirations/${inspiration.id}/edit`}
                            className="admin-icon-button"
                            title="Edit inspiration"
                          >
                            <Edit3
                              size={16}
                            />
                          </Link>

                          <button
                            type="button"
                            className="admin-icon-button danger"
                            title="Delete inspiration"
                            onClick={() => {
                              setDeleteError(
                                ""
                              );
                              setDeletingInspiration(
                                inspiration
                              );
                            }}
                          >
                            <Trash2
                              size={16}
                            />
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
      </div>

      {deletingInspiration && (
        <div className="admin-modal-backdrop">
          <div
            className="admin-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-inspiration-title"
          >
            <button
              type="button"
              className="admin-delete-modal-close"
              onClick={() =>
                setDeletingInspiration(
                  null
                )
              }
              disabled={deleteLoading}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="admin-delete-icon">
              <AlertTriangle
                size={25}
              />
            </div>

            <span className="admin-eyebrow">
              Delete Daily Inspiration
            </span>

            <h2 id="delete-inspiration-title">
              Are you sure?
            </h2>

            <p>
              This will permanently remove
              this Daily Inspiration from
              the database.
            </p>

            <span className="admin-delete-title">
              {deletingInspiration.title}
            </span>

            {deleteError && (
              <div className="admin-form-alert error">
                {deleteError}
              </div>
            )}

            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-cancel-button"
                onClick={() =>
                  setDeletingInspiration(
                    null
                  )
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-delete-confirm"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                <Trash2 size={15} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Inspiration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDailyInspirations;