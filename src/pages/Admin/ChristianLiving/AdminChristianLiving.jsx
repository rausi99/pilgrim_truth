import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Edit3,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  getAdminChristianLiving,
  deleteAdminChristianLiving,
} from "../../../services/admin";
import "./AdminChristianLiving.css";

function AdminChristianLiving() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [deleteStudy, setDeleteStudy] = useState(null);

  const loadStudies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminChristianLiving(token);
      setStudies(data.studies || []);
    } catch (err) {
      setError(err.message || "Unable to load Christian Living studies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStudies();
    }
  }, [token]);

  const categories = useMemo(() => {
    return [...new Set(studies.map((study) => study.category).filter(Boolean))];
  }, [studies]);

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const matchesSearch =
        !search ||
        study.title?.toLowerCase().includes(search.toLowerCase()) ||
        study.description?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || study.category === category;

      const matchesStatus =
        status === "all" || study.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [studies, search, category, status]);

  const handleDelete = async () => {
    if (!deleteStudy) return;

    try {
      await deleteAdminChristianLiving(token, deleteStudy.id);
      setDeleteStudy(null);
      await loadStudies();
    } catch (err) {
      setError(err.message || "Unable to delete study.");
    }
  };

  return (
    <div className="admin-christian-living">
      <div className="acl-header">
        <div>
          <div className="acl-title-row">
            <div className="acl-icon">
              <BookOpen size={22} />
            </div>

            <div>
              <h1>Christian Living</h1>
              <p>
                Manage Christian Living studies, practical guidance and
                spiritual growth content.
              </p>
            </div>
          </div>
        </div>

        <button
          className="acl-primary-btn"
          onClick={() => navigate("/admin/christian-living/new")}
        >
          <Plus size={18} />
          New Study
        </button>
      </div>

      {error && <div className="acl-error">{error}</div>}

      <div className="acl-toolbar">
        <div className="acl-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search Christian Living..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="acl-results">
        {filteredStudies.length}{" "}
        {filteredStudies.length === 1 ? "study" : "studies"}
      </div>

      {loading ? (
        <div className="acl-empty">Loading Christian Living studies...</div>
      ) : filteredStudies.length === 0 ? (
        <div className="acl-empty">
          <BookOpen size={38} />
          <h3>No studies found</h3>
          <p>Create your first Christian Living study.</p>

          <button
            className="acl-primary-btn"
            onClick={() => navigate("/admin/christian-living/new")}
          >
            <Plus size={18} />
            Create Study
          </button>
        </div>
      ) : (
        <div className="acl-table-card">
          <div className="acl-table-wrapper">
            <table className="acl-table">
              <thead>
                <tr>
                  <th>Study</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Published</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredStudies.map((study) => (
                  <tr key={study.id}>
                    <td>
                      <div className="acl-study-name">
                        {study.featured_image ? (
                          <img
                            src={study.featured_image}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="acl-study-placeholder">
                            <BookOpen size={18} />
                          </div>
                        )}

                        <div>
                          <strong>{study.title}</strong>
                          <span>{study.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td>{study.category || "—"}</td>

                    <td>
                      <span
                        className={`acl-status acl-status-${study.status}`}
                      >
                        {study.status}
                      </span>
                    </td>

                    <td>
                      {study.is_featured ? (
                        <span className="acl-featured">
                          <Star size={15} fill="currentColor" />
                          Featured
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {study.published_at
                        ? new Date(study.published_at).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <div className="acl-actions">
                        <button
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/admin/christian-living/edit/${study.id}`
                            )
                          }
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          className="danger"
                          title="Delete"
                          onClick={() => setDeleteStudy(study)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteStudy && (
        <div className="acl-modal-backdrop">
          <div className="acl-modal">
            <button
              className="acl-modal-close"
              onClick={() => setDeleteStudy(null)}
            >
              <X size={20} />
            </button>

            <div className="acl-modal-icon">
              <Trash2 size={22} />
            </div>

            <h2>Delete study?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteStudy.title}</strong>? This action cannot be
              undone.
            </p>

            <div className="acl-modal-actions">
              <button
                className="acl-cancel-btn"
                onClick={() => setDeleteStudy(null)}
              >
                Cancel
              </button>

              <button
                className="acl-delete-btn"
                onClick={handleDelete}
              >
                Delete Study
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminChristianLiving;