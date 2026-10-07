import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Film,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminVideo,
  getAdminVideos,
} from "../../services/admin";

import "./AdminVideos.css";

function AdminVideos() {
  const { token } = useAuth();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [deletingVideo, setDeletingVideo] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminVideos(token);

        setVideos(data.videos || []);
      } catch (error) {
        console.error("Videos loading error:", error);

        setError(
          error.message || "Unable to load videos."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        videos
          .map((video) => video.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [videos]);

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesSearch =
        !query ||
        video.title?.toLowerCase().includes(query) ||
        video.category?.toLowerCase().includes(query) ||
        video.author?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        video.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        video.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    videos,
    searchQuery,
    statusFilter,
    categoryFilter,
  ]);

  const hasFilters =
    searchQuery.trim() ||
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

  const openDeleteModal = (video) => {
    setDeleteError("");
    setDeletingVideo(video);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeletingVideo(null);
    setDeleteError("");
  };

  const handleDeleteVideo = async () => {
    if (!deletingVideo || !token) {
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAdminVideo(
        token,
        deletingVideo.id
      );

      setVideos((previous) =>
        previous.filter(
          (video) =>
            Number(video.id) !==
            Number(deletingVideo.id)
        )
      );

      setDeletingVideo(null);
      setDeleteError("");
    } catch (error) {
      console.error(
        "Delete video error:",
        error
      );

      setDeleteError(
        error.message ||
          "Unable to delete video."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-videos">
      {/* PAGE HEADER */}
      <div className="av-header">
        <div className="av-title-row">
          <div className="av-icon">
            <Film size={20} />
          </div>

          <div>
            <div className="av-eyebrow">
              Content Management
            </div>

            <h1>Videos</h1>

            <p>
              Manage YouTube videos, featured content,
              and publication status.
            </p>
          </div>
        </div>

        <Link
          to="/admin/videos/new"
          className="av-primary-btn"
        >
          <Plus size={17} />
          Add Video
        </Link>
      </div>

      {/* ERROR */}
      {error && (
        <div className="av-error">
          <Film size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* FILTERS */}
      <div className="av-toolbar">
        <div className="av-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />
        </div>

        <select
          className="av-filter"
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
          className="av-filter"
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

        {hasFilters && (
          <button
            type="button"
            className="av-clear"
            onClick={clearFilters}
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>

      {/* RESULTS */}
      <div className="av-results">
        <span className="av-results-dot" />

        Showing{" "}
        <strong>
          {filteredVideos.length}
        </strong>{" "}
        of{" "}
        <strong>
          {videos.length}
        </strong>{" "}
        videos
      </div>

      {/* LOADING */}
      {loading && (
        <div className="av-empty">
          <div className="av-empty-icon">
            <Film size={30} />
          </div>

          <h3>Loading videos...</h3>

          <p>
            Please wait while your videos are loaded.
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="av-empty av-error-empty">
          <div className="av-empty-icon">
            <Film size={30} />
          </div>

          <h3>Unable to load videos</h3>

          <p>{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        !error &&
        filteredVideos.length === 0 && (
          <div className="av-empty">
            <div className="av-empty-icon">
              <Film size={34} />
            </div>

            <h3>
              {videos.length === 0
                ? "No videos yet"
                : "No videos found"}
            </h3>

            <p>
              {videos.length === 0
                ? "Add your first video to start building the Pilgrim Truth video library."
                : "Try changing your search or filters."}
            </p>

            {videos.length === 0 && (
              <Link
                to="/admin/videos/new"
                className="av-primary-btn"
              >
                <Plus size={17} />
                Add First Video
              </Link>
            )}
          </div>
        )}

      {/* VIDEO TABLE */}
      {!loading &&
        !error &&
        filteredVideos.length > 0 && (
          <div className="av-table-card">
            <div className="av-table-header">
              <div>
                <div className="av-table-title">
                  Video Library
                </div>

                <div className="av-table-description">
                  Manage your published and draft videos.
                </div>
              </div>

              <div className="av-count">
                {videos.length}{" "}
                {videos.length === 1
                  ? "video"
                  : "videos"}
              </div>
            </div>

            <div className="av-table-wrapper">
              <table className="av-table">
                <thead>
                  <tr>
                    <th>Video</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVideos.map((video) => (
                    <tr key={video.id}>
                      {/* VIDEO */}
                      <td>
                        <div className="av-video-cell">
                          <div className="av-video-thumb">
                            {video.thumbnail_url ? (
                              <img
                                src={
                                  video.thumbnail_url
                                }
                                alt=""
                              />
                            ) : (
                              <Film size={22} />
                            )}

                            {video.youtube_id && (
                              <div className="av-play">
                                <Play size={16} />
                              </div>
                            )}
                          </div>

                          <div className="av-video-info">
                            <div className="av-video-title">
                              <span>
                                {video.title}
                              </span>

                              {video.is_featured && (
                                <span
                                  className="av-featured"
                                  title="Featured video"
                                >
                                  <Star
                                    size={13}
                                    fill="currentColor"
                                  />
                                </span>
                              )}
                            </div>

                            {video.youtube_id && (
                              <div className="av-youtube">
                                YouTube video
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td>
                        <span className="av-category">
                          {video.category || "—"}
                        </span>
                      </td>

                      {/* DURATION */}
                      <td>
                        <span className="av-date">
                          {video.duration || "—"}
                        </span>
                      </td>

                      {/* AUTHOR */}
                      <td>
                        <span className="av-author">
                          {video.author || "—"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`av-status av-status-${video.status}`}
                        >
                          <span className="av-status-dot" />
                          {video.status}
                        </span>
                      </td>

                      {/* UPDATED */}
                      <td>
                        <span className="av-date">
                          {formatDate(
                            video.updated_at
                          )}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="av-actions">
                          <Link
                            to={`/admin/videos/${video.id}/edit`}
                            className="av-action edit"
                            title="Edit video"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            type="button"
                            className="av-action delete"
                            title="Delete video"
                            onClick={() =>
                              openDeleteModal(video)
                            }
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
          </div>
        )}

      {/* DELETE MODAL */}
      {deletingVideo && (
        <div
          className="av-modal-backdrop"
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
            className="av-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-video-title"
          >
            <button
              type="button"
              className="av-modal-close"
              onClick={closeDeleteModal}
              disabled={deleteLoading}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="av-modal-icon">
              <Trash2 size={22} />
            </div>

            <h2 id="delete-video-title">
              Delete video?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deletingVideo.title}
              </strong>
              ?
            </p>

            <p className="av-modal-warning">
              This action cannot be undone.
            </p>

            {deleteError && (
              <div className="av-modal-error">
                {deleteError}
              </div>
            )}

            <div className="av-modal-actions">
              <button
                type="button"
                className="av-cancel-btn"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="av-delete-btn"
                onClick={handleDeleteVideo}
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVideos;