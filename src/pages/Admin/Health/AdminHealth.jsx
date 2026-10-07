import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Plus,
  Search,
  Stethoscope,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import {
  deleteAdminHealth,
  getAdminHealth,
} from "../../../services/admin";
import "./AdminHealth.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_URL.replace("/api", "")}${image}`;
  }

  return image;
}

export default function AdminHealth() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const [deletingStudy, setDeletingStudy] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadHealth() {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminHealth(token);

        setStudies(data.studies || []);
      } catch (err) {
        setError(err.message || "Unable to load Health content.");
      } finally {
        setLoading(false);
      }
    }

    loadHealth();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        studies
          .map((study) => study.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return studies.filter((study) => {
      const matchesSearch =
        !query ||
        study.title?.toLowerCase().includes(query) ||
        study.category?.toLowerCase().includes(query) ||
        study.description?.toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || study.category === category;

      const matchesStatus =
        status === "all" || study.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [studies, search, category, status]);

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusClass(studyStatus) {
    return `ah-status ah-status-${studyStatus}`;
  }

  async function handleDelete() {
    if (!deletingStudy) return;

    try {
      setDeleting(true);
      setError("");

      await deleteAdminHealth(token, deletingStudy.id);

      setStudies((current) =>
        current.filter(
          (study) => study.id !== deletingStudy.id
        )
      );

      setDeletingStudy(null);
    } catch (err) {
      setError(
        err.message || "Unable to delete Health content."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-health">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="ah-header">
        <div className="ah-title-row">
          <div className="ah-icon">
            <Stethoscope size={22} />
          </div>

          <div>
            <h1>Health</h1>

            <p>
              Manage health, wellness, and
              Scripture-centered lifestyle content.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ah-primary-btn"
          onClick={() => navigate("/admin/health/new")}
        >
          <Plus size={17} />
          New Health Content
        </button>
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="ah-error">
          {error}
        </div>
      )}

      {/* =====================================================
          FILTER TOOLBAR
          ===================================================== */}

      <div className="ah-toolbar">
        <div className="ah-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search health content..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          aria-label="Filter by category"
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          aria-label="Filter by status"
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
      </div>

      {/* =====================================================
          RESULTS
          ===================================================== */}

      <div className="ah-results">
        Showing{" "}
        <strong>{filteredStudies.length}</strong>{" "}
        of <strong>{studies.length}</strong> items
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      {loading ? (
        <div className="ah-empty">
          Loading Health content...
        </div>
      ) : filteredStudies.length === 0 ? (
        <div className="ah-empty">
          <Stethoscope size={27} />

          <h3>
            {studies.length === 0
              ? "No Health content yet"
              : "No matching content"}
          </h3>

          <p>
            {studies.length === 0
              ? "Create your first Health article to get started."
              : "Try changing your search or filters."}
          </p>

          {studies.length === 0 && (
            <button
              type="button"
              className="ah-primary-btn"
              onClick={() =>
                navigate("/admin/health/new")
              }
            >
              <Plus size={17} />
              Create Health Content
            </button>
          )}
        </div>
      ) : (
        <div className="ah-table-card">
          <div className="ah-table-wrapper">
            <table className="ah-table">
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Published</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>

              <tbody>
                {filteredStudies.map((study) => {
                  const imageUrl = getImageUrl(
                    study.featured_image
                  );

                  return (
                    <tr key={study.id}>
                      {/* CONTENT */}

                      <td>
                        <div className="ah-content">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt=""
                              className="ah-content-image"
                            />
                          ) : (
                            <div className="ah-content-placeholder">
                              <Stethoscope size={20} />
                            </div>
                          )}

                          <div>
                            <strong>
                              {study.title}
                            </strong>

                            {study.description && (
                              <span>
                                {study.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {study.category || "—"}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={getStatusClass(
                            study.status
                          )}
                        >
                          {study.status}
                        </span>
                      </td>

                      {/* FEATURED */}

                      <td>
                        {study.is_featured ? (
                          <span className="ah-featured">
                            <Star size={14} />
                            Featured
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* PUBLISHED */}

                      <td>
                        {formatDate(
                          study.published_at
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="ah-actions">
                          <button
                            type="button"
                            title="Edit"
                            aria-label={`Edit ${study.title}`}
                            onClick={() =>
                              navigate(
                                `/admin/health/edit/${study.id}`
                              )
                            }
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            className="danger"
                            title="Delete"
                            aria-label={`Delete ${study.title}`}
                            onClick={() =>
                              setDeletingStudy(study)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
          ===================================================== */}

      {deletingStudy && (
        <div
          className="ah-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deleting
            ) {
              setDeletingStudy(null);
            }
          }}
        >
          <div
            className="ah-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-health-title"
          >
            <button
              type="button"
              className="ah-modal-close"
              onClick={() =>
                !deleting &&
                setDeletingStudy(null)
              }
              aria-label="Close"
              disabled={deleting}
            >
              <X size={17} />
            </button>

            <div className="ah-modal-icon">
              <Trash2 size={20} />
            </div>

            <h2 id="delete-health-title">
              Delete Health Content?
            </h2>

            <p>
              This will permanently delete{" "}
              <strong>
                {deletingStudy.title}
              </strong>
              . This action cannot be undone.
            </p>

            <div className="ah-modal-actions">
              <button
                type="button"
                className="ah-cancel-btn"
                onClick={() =>
                  setDeletingStudy(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ah-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}