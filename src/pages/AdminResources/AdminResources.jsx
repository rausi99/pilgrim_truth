import { useEffect, useMemo, useState } from "react";
import {
  Download,
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
import {
  deleteAdminResource,
  getAdminResources,
} from "../../services/admin";

import "./AdminResources.css";

function AdminResources() {
  const { token } = useAuth();

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [deletingResource, setDeletingResource] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  useEffect(() => {
    const loadResources = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getAdminResources(token);

        setResources(data.resources || []);
      } catch (err) {
        console.error(
          "Resources loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        resources
          .map(
            (resource) =>
              resource.category
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return resources.filter(
      (resource) => {
        const matchesSearch =
          !query ||
          resource.title
            ?.toLowerCase()
            .includes(query) ||
          resource.description
            ?.toLowerCase()
            .includes(query) ||
          resource.category
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          resource.status ===
            statusFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          resource.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    resources,
    searchQuery,
    statusFilter,
    categoryFilter,
  ]);

  const hasFilters =
    Boolean(searchQuery.trim()) ||
    statusFilter !== "all" ||
    categoryFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatDownloads = (count) => {
    const value = Number(count || 0);

    return value.toLocaleString("en-US");
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Draft";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const openDeleteModal = (resource) => {
    setDeleteError("");
    setDeletingResource(resource);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeletingResource(null);
    setDeleteError("");
  };

  const handleDeleteResource = async () => {
    if (!deletingResource || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminResource(
        token,
        deletingResource.id
      );

      setResources((previous) =>
        previous.filter(
          (resource) =>
            Number(resource.id) !==
            Number(deletingResource.id)
        )
      );

      setDeletingResource(null);
    } catch (err) {
      console.error(
        "Delete resource error:",
        err
      );

      setDeleteError(
        err.message ||
          "Unable to delete resource."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-resources">
      {/* PAGE HEADER */}
      <div className="ar-header">
        <div className="ar-title-row">
          <div className="ar-icon">
            <FileText size={21} />
          </div>

          <div>
            <div className="ar-eyebrow">
              Content Management
            </div>

            <h1>Resources</h1>

            <p>
              Manage downloadable study guides,
              Bible resources, and supporting
              materials.
            </p>
          </div>
        </div>

        <Link
          to="/admin/resources/new"
          className="ar-primary-btn"
        >
          <Plus size={17} />
          Add Resource
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="ar-error">
          <FileText size={17} />
          <span>{error}</span>
        </div>
      )}

      {/* FILTERS */}
      <div className="ar-toolbar">
        <div className="ar-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
          />
        </div>

        <select
          className="ar-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
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
          className="ar-filter"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
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

        {hasFilters && (
          <button
            type="button"
            className="ar-clear"
            onClick={clearFilters}
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* RESULTS */}
      <div className="ar-results">
        <span className="ar-results-dot" />

        Showing{" "}
        <strong>
          {filteredResources.length}
        </strong>{" "}
        of{" "}
        <strong>
          {resources.length}
        </strong>{" "}
        resources
      </div>

      {/* LOADING */}
      {loading && (
        <div className="ar-empty">
          <div className="ar-empty-icon">
            <FileText size={25} />
          </div>

          <h3>Loading resources...</h3>

          <p>
            Please wait while your resource
            library is loaded.
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="ar-empty ar-error-empty">
          <div className="ar-empty-icon">
            <FileText size={25} />
          </div>

          <h3>
            Unable to load resources
          </h3>

          <p>{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        filteredResources.length === 0 && (
          <div className="ar-empty">
            <div className="ar-empty-icon">
              <FileText size={28} />
            </div>

            <h3>
              {resources.length === 0
                ? "No resources yet"
                : "No resources found"}
            </h3>

            <p>
              {resources.length === 0
                ? "Add your first resource to start building the Pilgrim Truth library."
                : "Try changing your search or filters."}
            </p>

            {resources.length === 0 && (
              <Link
                to="/admin/resources/new"
                className="ar-primary-btn"
              >
                <Plus size={16} />
                Add First Resource
              </Link>
            )}
          </div>
        )}

      {/* TABLE */}
      {!loading &&
        !error &&
        filteredResources.length > 0 && (
          <div className="ar-table-card">
            <div className="ar-table-header">
              <div>
                <div className="ar-table-title">
                  Resource Library
                </div>

                <div className="ar-table-description">
                  Manage downloadable resources
                  and study materials.
                </div>
              </div>

              <div className="ar-count">
                {resources.length}{" "}
                {resources.length === 1
                  ? "resource"
                  : "resources"}
              </div>
            </div>

            <div className="ar-table-wrapper">
              <table className="ar-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Category</th>
                    <th>File</th>
                    <th>Downloads</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResources.map(
                    (resource) => (
                      <tr
                        key={resource.id}
                      >
                        {/* RESOURCE */}
                        <td>
                          <div className="ar-resource-cell">
                            <div className="ar-resource-thumb">
                              {resource.thumbnail_url ? (
                                <img
                                  src={
                                    resource.thumbnail_url
                                  }
                                  alt=""
                                />
                              ) : (
                                <FileText
                                  size={23}
                                />
                              )}
                            </div>

                            <div className="ar-resource-info">
                              <div className="ar-resource-title">
                                <span>
                                  {
                                    resource.title
                                  }
                                </span>

                                {resource.is_featured && (
                                  <span
                                    className="ar-featured"
                                    title="Featured resource"
                                  >
                                    <Star
                                      size={12}
                                      fill="currentColor"
                                    />
                                  </span>
                                )}
                              </div>

                              {resource.description && (
                                <div className="ar-resource-description">
                                  {
                                    resource.description
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td>
                          <span className="ar-category">
                            {
                              resource.category ||
                              "Uncategorized"
                            }
                          </span>
                        </td>

                        {/* FILE */}
                        <td>
                          <div className="ar-file">
                            <strong>
                              {
                                resource.file_type ||
                                "PDF"
                              }
                            </strong>

                            <span>
                              {
                                resource.file_size ||
                                "Size unavailable"
                              }
                            </span>
                          </div>
                        </td>

                        {/* DOWNLOADS */}
                        <td>
                          <div className="ar-downloads">
                            <Download
                              size={14}
                            />

                            <span>
                              {formatDownloads(
                                resource.download_count
                              )}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`ar-status ar-status-${resource.status || "draft"}`}
                          >
                            <span className="ar-status-dot" />

                            {formatStatus(
                              resource.status
                            )}
                          </span>
                        </td>

                        {/* UPDATED */}
                        <td>
                          <span className="ar-date">
                            {formatDate(
                              resource.updated_at
                            )}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td>
                          <div className="ar-actions">
                            <Link
                              to={`/admin/resources/${resource.id}/edit`}
                              className="ar-action edit"
                              title="Edit resource"
                              aria-label="Edit resource"
                            >
                              <Edit3
                                size={15}
                              />
                            </Link>

                            <button
                              type="button"
                              className="ar-action delete"
                              title="Delete resource"
                              aria-label="Delete resource"
                              onClick={() =>
                                openDeleteModal(
                                  resource
                                )
                              }
                            >
                              <Trash2
                                size={15}
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
          </div>
        )}

      {/* DELETE MODAL */}
      {deletingResource && (
        <div
          className="ar-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div
            className="ar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-resource-title"
          >
            <button
              type="button"
              className="ar-modal-close"
              onClick={
                closeDeleteModal
              }
              disabled={deleteLoading}
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="ar-modal-icon">
              <Trash2 size={21} />
            </div>

            <h2 id="delete-resource-title">
              Delete resource?
            </h2>

            <p>
              Are you sure you want to
              delete{" "}
              <strong>
                {deletingResource.title}
              </strong>
              ?
            </p>

            <div className="ar-modal-warning">
              This action cannot be undone.
            </div>

            {deleteError && (
              <div className="ar-modal-error">
                {deleteError}
              </div>
            )}

            <div className="ar-modal-actions">
              <button
                type="button"
                className="ar-cancel-btn"
                onClick={
                  closeDeleteModal
                }
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ar-delete-btn"
                onClick={
                  handleDeleteResource
                }
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Resource"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResources;