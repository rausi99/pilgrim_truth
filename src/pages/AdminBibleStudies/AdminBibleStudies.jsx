import { useEffect, useMemo, useState } from "react";
import {
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

import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminBibleStudy,
  getAdminBibleStudies,
} from "../../services/admin";

import "./AdminBibleStudies.css";

function AdminBibleStudies() {
  const { token } = useAuth();

  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deletingStudy, setDeletingStudy] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadStudies = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const data = await getAdminBibleStudies(token);

        setStudies(data.studies || []);
      } catch (err) {
        console.error("Load Bible Studies error:", err);

        setError(
          err.message || "Unable to load Bible Studies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudies();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        studies
          .map((study) => study.category)
          .filter(Boolean)
      ),
    ];
  }, [studies]);

  const filteredStudies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return studies.filter((study) => {
      const matchesSearch =
        !normalizedSearch ||
        study.title?.toLowerCase().includes(normalizedSearch) ||
        study.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        study.scripture_reference
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        study.author?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        study.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        study.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    studies,
    search,
    statusFilter,
    categoryFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const handleDeleteStudy = async () => {
    if (!deletingStudy || !token) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminBibleStudy(
        token,
        deletingStudy.id
      );

      setStudies((previous) =>
        previous.filter(
          (study) =>
            study.id !== deletingStudy.id
        )
      );

      setDeletingStudy(null);
    } catch (err) {
      console.error(
        "Delete Bible Study error:",
        err
      );

      setDeleteError(
        err.message ||
          "Unable to delete Bible Study."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    return new Date(
      dateValue
    ).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bible-studies-page">

      {/* PAGE HEADER */}
      <header className="bible-studies-header">
        <div className="bible-studies-header-content">
          <span className="bible-studies-label">
            Content Management
          </span>

          <h1>Bible Studies</h1>

          <p>
            Create, manage, and publish Bible study
            content for Pilgrim Truth.
          </p>
        </div>

        <Link
          to="/admin/bible-studies/new"
          className="bible-studies-new-button"
        >
          <Plus size={18} />
          <span>New Bible Study</span>
        </Link>
      </header>

      {/* FILTERS */}
      <section className="bible-studies-toolbar">
        <div className="bible-studies-search">
          <Search size={18} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search Bible Studies..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="bible-studies-filter"
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
          className="bible-studies-filter"
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

        {(search ||
          statusFilter !== "all" ||
          categoryFilter !== "all") && (
          <button
            type="button"
            className="bible-studies-clear"
            onClick={clearFilters}
          >
            <X size={15} />
            Clear
          </button>
        )}
      </section>

      {/* RESULT COUNT */}
      <div className="bible-studies-result">
        <span>
          {filteredStudies.length}{" "}
          {filteredStudies.length === 1
            ? "Bible Study"
            : "Bible Studies"}
        </span>
      </div>

      {/* LOADING */}
      {loading && (
        <section className="bible-studies-state">
          <div className="bible-studies-state-icon">
            <FileText size={25} />
          </div>

          <h3>Loading Bible Studies</h3>

          <p>
            Please wait while your studies are
            loaded.
          </p>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="bible-studies-state">
          <div className="bible-studies-state-icon error">
            <FileText size={25} />
          </div>

          <h3>
            Unable to load Bible Studies
          </h3>

          <p>{error}</p>
        </section>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        filteredStudies.length === 0 && (
          <section className="bible-studies-state">
            <div className="bible-studies-state-icon">
              <FileText size={28} />
            </div>

            <h3>
              {studies.length === 0
                ? "No Bible Studies yet"
                : "No Bible Studies found"}
            </h3>

            <p>
              {studies.length === 0
                ? "Create your first Bible Study to get started."
                : "Try changing your search or filters."}
            </p>

            {studies.length === 0 && (
              <Link
                to="/admin/bible-studies/new"
                className="bible-studies-new-button"
              >
                <Plus size={18} />
                Create Bible Study
              </Link>
            )}
          </section>
        )}

      {/* TABLE */}
      {!loading &&
        !error &&
        filteredStudies.length > 0 && (
          <section className="bible-studies-table-card">
            <div className="bible-studies-table-scroll">
              <table className="bible-studies-table">
                <thead>
                  <tr>
                    <th>Study</th>
                    <th>Category</th>
                    <th>Scripture</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th className="actions-column">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudies.map(
                    (study) => (
                      <tr key={study.id}>

                        <td>
                          <div className="study-primary">
                            <strong>
                              {study.title}
                            </strong>

                            {study.is_featured && (
                              <span className="study-featured">
                                <Star size={12} />
                                Featured
                              </span>
                            )}

                            {study.description && (
                              <span className="study-description">
                                {study.description}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="study-category">
                            {study.category ||
                              "Uncategorized"}
                          </span>
                        </td>

                        <td>
                          <span className="study-scripture">
                            {study.scripture_reference ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <span className="study-author">
                            {study.author ||
                              "Unknown"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`study-status ${study.status}`}
                          >
                            {study.status}
                          </span>
                        </td>

                        <td>
                          <div className="study-date">
                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              study.updated_at
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="study-actions">

                            <Link
                              to={`/admin/bible-studies/${study.id}/edit`}
                              className="study-action edit"
                              title="Edit Bible Study"
                            >
                              <Edit3 size={15} />
                            </Link>

                            <button
                              type="button"
                              className="study-action delete"
                              title="Delete Bible Study"
                              onClick={() => {
                                setDeleteError("");
                                setDeletingStudy(
                                  study
                                );
                              }}
                            >
                              <Trash2 size={15} />
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {/* DELETE MODAL */}
      {deletingStudy && (
        <div className="bible-studies-modal-backdrop">
          <div className="bible-studies-delete-modal">

            <button
              type="button"
              className="bible-studies-modal-close"
              onClick={() => {
                setDeletingStudy(null);
                setDeleteError("");
              }}
              disabled={deleteLoading}
            >
              <X size={18} />
            </button>

            <div className="delete-modal-icon">
              <Trash2 size={21} />
            </div>

            <h3>
              Delete Bible Study?
            </h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deletingStudy.title}
              </strong>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="delete-modal-error">
                {deleteError}
              </div>
            )}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel"
                onClick={() => {
                  setDeletingStudy(null);
                  setDeleteError("");
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm"
                onClick={handleDeleteStudy}
                disabled={deleteLoading}
              >
                <Trash2 size={15} />

                {deleteLoading
                  ? "Deleting..."
                  : "Delete Bible Study"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBibleStudies;
