import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Filter,
  Lock,
  MessageCircle,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import {
  deleteAdminDiscussion,
  deleteAdminReply,
  getAdminDiscussion,
  getAdminDiscussions,
  toggleAdminDiscussionFeatured,
  toggleAdminDiscussionLocked,
  updateAdminDiscussionStatus,
} from "../../services/admin";

import "./AdminDiscussions.css";

function AdminDiscussions() {
  const { token } = useAuth();

  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteReplyTarget, setDeleteReplyTarget] =
    useState(null);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDiscussions(token);

      setDiscussions(data.discussions || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load discussions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDiscussions();
    }
  }, [token]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        discussions
          .map((discussion) => discussion.category)
          .filter(Boolean)
      ),
    ].sort();
  }, [discussions]);

  const filteredDiscussions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return discussions.filter((discussion) => {
      const matchesSearch =
        !query ||
        discussion.title
          ?.toLowerCase()
          .includes(query) ||
        discussion.content
          ?.toLowerCase()
          .includes(query) ||
        discussion.author
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        discussion.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        discussion.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    discussions,
    search,
    categoryFilter,
    statusFilter,
  ]);

  const openDiscussion = async (discussionId) => {
    try {
      setViewLoading(true);
      setError("");

      const data = await getAdminDiscussion(
        token,
        discussionId
      );

      setSelectedDiscussion(data);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to load discussion."
      );
    } finally {
      setViewLoading(false);
    }
  };

  const handleFeature = async (discussion) => {
    try {
      setActionLoading(
        `feature-${discussion.id}`
      );

      const data =
        await toggleAdminDiscussionFeatured(
          token,
          discussion.id
        );

      setDiscussions((current) =>
        current.map((item) =>
          item.id === discussion.id
            ? {
                ...item,
                is_featured:
                  data.discussion.is_featured,
              }
            : item
        )
      );

      if (
        selectedDiscussion?.discussion?.id ===
        discussion.id
      ) {
        setSelectedDiscussion((current) => ({
          ...current,
          discussion: {
            ...current.discussion,
            is_featured:
              data.discussion.is_featured,
          },
        }));
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to update featured status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleLock = async (discussion) => {
    try {
      setActionLoading(`lock-${discussion.id}`);

      const data =
        await toggleAdminDiscussionLocked(
          token,
          discussion.id
        );

      setDiscussions((current) =>
        current.map((item) =>
          item.id === discussion.id
            ? {
                ...item,
                is_locked:
                  data.discussion.is_locked,
              }
            : item
        )
      );

      if (
        selectedDiscussion?.discussion?.id ===
        discussion.id
      ) {
        setSelectedDiscussion((current) => ({
          ...current,
          discussion: {
            ...current.discussion,
            is_locked:
              data.discussion.is_locked,
          },
        }));
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to update lock status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (
    discussion,
    status
  ) => {
    try {
      setActionLoading(`status-${discussion.id}`);

      const data =
        await updateAdminDiscussionStatus(
          token,
          discussion.id,
          status
        );

      setDiscussions((current) =>
        current.map((item) =>
          item.id === discussion.id
            ? {
                ...item,
                status: data.discussion.status,
              }
            : item
        )
      );

      if (
        selectedDiscussion?.discussion?.id ===
        discussion.id
      ) {
        setSelectedDiscussion((current) => ({
          ...current,
          discussion: {
            ...current.discussion,
            status: data.discussion.status,
          },
        }));
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to update discussion status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteDiscussion = async () => {
    if (!deleteTarget) return;

    try {
      setActionLoading(
        `delete-${deleteTarget.id}`
      );

      await deleteAdminDiscussion(
        token,
        deleteTarget.id
      );

      setDiscussions((current) =>
        current.filter(
          (item) =>
            item.id !== deleteTarget.id
        )
      );

      if (
        selectedDiscussion?.discussion?.id ===
        deleteTarget.id
      ) {
        setSelectedDiscussion(null);
      }

      setDeleteTarget(null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete discussion."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteReply = async () => {
    if (!deleteReplyTarget) return;

    try {
      setActionLoading(
        `reply-delete-${deleteReplyTarget.id}`
      );

      await deleteAdminReply(
        token,
        deleteReplyTarget.discussionId,
        deleteReplyTarget.id
      );

      setSelectedDiscussion((current) => ({
        ...current,
        replies: current.replies.filter(
          (reply) =>
            reply.id !== deleteReplyTarget.id
        ),
      }));

      setDiscussions((current) =>
        current.map((discussion) =>
          discussion.id ===
          deleteReplyTarget.discussionId
            ? {
                ...discussion,
                replies: Math.max(
                  0,
                  Number(discussion.replies || 0) -
                    1
                ),
              }
            : discussion
        )
      );

      setDeleteReplyTarget(null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete reply."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const getStatusClass = (status) => {
    if (status === "published") {
      return "admin-status-badge admin-status-published";
    }

    if (status === "draft") {
      return "admin-status-badge admin-status-draft";
    }

    return "admin-status-badge admin-status-hidden";
  };

  return (
    <div className="admin-discussions-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            COMMUNITY
          </span>

          <h1>Discussions</h1>

          <p>
            Manage community discussions,
            conversations and replies.
          </p>
        </div>

        <div className="admin-discussion-count">
          <MessageCircle size={18} />
          <span>
            {discussions.length} discussions
          </span>
        </div>
      </div>

      {error && (
        <div className="admin-error-banner">
          <ShieldAlert size={18} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-discussion-toolbar">
        <div className="admin-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="admin-filter-box">
          <Filter size={17} />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="all">
              All categories
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
        </div>

        <div className="admin-filter-box">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="all">
              All statuses
            </option>
            <option value="published">
              Published
            </option>
            <option value="draft">
              Draft
            </option>
            <option value="hidden">
              Hidden
            </option>
          </select>
        </div>

        {(search ||
          categoryFilter !== "all" ||
          statusFilter !== "all") && (
          <button
            type="button"
            className="admin-clear-filter"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>

      <div className="admin-discussion-summary">
        <span>
          Showing{" "}
          <strong>
            {filteredDiscussions.length}
          </strong>{" "}
          of{" "}
          <strong>
            {discussions.length}
          </strong>{" "}
          discussions
        </span>
      </div>

      <div className="admin-discussion-table-card">
        {loading ? (
          <div className="admin-discussion-state">
            <div className="admin-loading-spinner" />
            <p>Loading discussions...</p>
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="admin-discussion-state">
            <MessageCircle size={42} />
            <h3>No discussions found</h3>
            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="admin-discussion-table-wrap">
            <table className="admin-discussion-table">
              <thead>
                <tr>
                  <th>Discussion</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Replies</th>
                  <th>Status</th>
                  <th>Controls</th>
                </tr>
              </thead>

              <tbody>
                {filteredDiscussions.map(
                  (discussion) => (
                    <tr key={discussion.id}>
                      <td>
                        <div className="admin-discussion-info">
                          <div className="admin-discussion-title-row">
                            <button
                              type="button"
                              className="admin-discussion-title"
                              onClick={() =>
                                openDiscussion(
                                  discussion.id
                                )
                              }
                            >
                              {discussion.title}
                            </button>

                            {discussion.is_featured && (
                              <Star
                                size={15}
                                className="admin-featured-icon"
                                fill="currentColor"
                              />
                            )}

                            {discussion.is_locked && (
                              <Lock
                                size={15}
                                className="admin-locked-icon"
                              />
                            )}
                          </div>

                          <p>
                            {discussion.content
                              ?.slice(0, 100)}
                            {discussion.content
                              ?.length > 100
                              ? "..."
                              : ""}
                          </p>
                        </div>
                      </td>

                      <td>
                        <div className="admin-author-info">
                          <strong>
                            {discussion.author}
                          </strong>
                          <span>
                            {discussion.author_email}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="admin-category-badge">
                          {discussion.category}
                        </span>
                      </td>

                      <td>
                        <span className="admin-reply-count">
                          <MessageCircle
                            size={15}
                          />
                          {discussion.replies}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            discussion.status
                          )}
                        >
                          {discussion.status}
                        </span>
                      </td>

                      <td>
                        <div className="admin-discussion-actions">
                          <button
                            type="button"
                            title="View discussion"
                            onClick={() =>
                              openDiscussion(
                                discussion.id
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title={
                              discussion.is_featured
                                ? "Unfeature"
                                : "Feature"
                            }
                            className={
                              discussion.is_featured
                                ? "is-active"
                                : ""
                            }
                            disabled={
                              actionLoading ===
                              `feature-${discussion.id}`
                            }
                            onClick={() =>
                              handleFeature(
                                discussion
                              )
                            }
                          >
                            <Star
                              size={16}
                              fill={
                                discussion.is_featured
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            title={
                              discussion.is_locked
                                ? "Unlock"
                                : "Lock"
                            }
                            className={
                              discussion.is_locked
                                ? "is-active"
                                : ""
                            }
                            disabled={
                              actionLoading ===
                              `lock-${discussion.id}`
                            }
                            onClick={() =>
                              handleLock(
                                discussion
                              )
                            }
                          >
                            {discussion.is_locked ? (
                              <Unlock size={16} />
                            ) : (
                              <Lock size={16} />
                            )}
                          </button>

                          <button
                            type="button"
                            title="Delete discussion"
                            className="admin-danger-action"
                            onClick={() =>
                              setDeleteTarget(
                                discussion
                              )
                            }
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
      </div>

      {selectedDiscussion && (
        <div className="admin-modal-overlay">
          <div className="admin-discussion-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  DISCUSSION
                </span>

                <h2>
                  {
                    selectedDiscussion.discussion
                      .title
                  }
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedDiscussion(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            {viewLoading ? (
              <div className="admin-discussion-state">
                <div className="admin-loading-spinner" />
                <p>
                  Loading discussion...
                </p>
              </div>
            ) : (
              <div className="admin-discussion-modal-body">
                <div className="admin-discussion-meta">
                  <span>
                    <strong>Author:</strong>{" "}
                    {
                      selectedDiscussion.discussion
                        .author
                    }
                  </span>

                  <span>
                    <strong>Category:</strong>{" "}
                    {
                      selectedDiscussion.discussion
                        .category
                    }
                  </span>

                  <span>
                    <strong>Status:</strong>{" "}
                    <span
                      className={getStatusClass(
                        selectedDiscussion.discussion
                          .status
                      )}
                    >
                      {
                        selectedDiscussion.discussion
                          .status
                      }
                    </span>
                  </span>
                </div>

                <div className="admin-discussion-content">
                  {
                    selectedDiscussion.discussion
                      .content
                  }
                </div>

                <div className="admin-discussion-controls">
                  <button
                    type="button"
                    onClick={() =>
                      handleFeature(
                        selectedDiscussion.discussion
                      )
                    }
                  >
                    <Star size={16} />
                    {selectedDiscussion.discussion
                      .is_featured
                      ? "Unfeature"
                      : "Feature"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleLock(
                        selectedDiscussion.discussion
                      )
                    }
                  >
                    {selectedDiscussion.discussion
                      .is_locked ? (
                      <Unlock size={16} />
                    ) : (
                      <Lock size={16} />
                    )}

                    {selectedDiscussion.discussion
                      .is_locked
                      ? "Unlock"
                      : "Lock"}
                  </button>

                  <select
                    value={
                      selectedDiscussion.discussion
                        .status
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        selectedDiscussion.discussion,
                        event.target.value
                      )
                    }
                  >
                    <option value="published">
                      Published
                    </option>
                    <option value="draft">
                      Draft
                    </option>
                    <option value="hidden">
                      Hidden
                    </option>
                  </select>
                </div>

                <div className="admin-replies-section">
                  <div className="admin-replies-heading">
                    <div>
                      <span className="admin-eyebrow">
                        COMMUNITY
                      </span>
                      <h3>
                        Replies (
                        {
                          selectedDiscussion.replies
                            .length
                        }
                        )
                      </h3>
                    </div>
                  </div>

                  {selectedDiscussion.replies
                    .length === 0 ? (
                    <div className="admin-empty-replies">
                      <MessageCircle size={30} />
                      <p>
                        No replies yet.
                      </p>
                    </div>
                  ) : (
                    <div className="admin-replies-list">
                      {selectedDiscussion.replies.map(
                        (reply) => (
                          <div
                            className="admin-reply-card"
                            key={reply.id}
                          >
                            <div className="admin-reply-header">
                              <div>
                                <strong>
                                  {
                                    reply.author
                                  }
                                </strong>
                                <span>
                                  {
                                    reply.author_email
                                  }
                                </span>
                              </div>

                              <button
                                type="button"
                                className="admin-reply-delete"
                                title="Delete reply"
                                onClick={() =>
                                  setDeleteReplyTarget(
                                    {
                                      id: reply.id,
                                      discussionId:
                                        selectedDiscussion
                                          .discussion
                                          .id,
                                    }
                                  )
                                }
                              >
                                <Trash2
                                  size={15}
                                />
                              </button>
                            </div>

                            <p>
                              {reply.content}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm-modal">
            <div className="admin-confirm-icon">
              <Trash2 size={22} />
            </div>

            <h3>
              Delete this discussion?
            </h3>

            <p>
              This will permanently delete the
              discussion and all of its replies.
            </p>

            <div className="admin-confirm-actions">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-danger-button"
                disabled={
                  actionLoading ===
                  `delete-${deleteTarget.id}`
                }
                onClick={
                  confirmDeleteDiscussion
                }
              >
                Delete Discussion
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteReplyTarget && (
        <div className="admin-modal-overlay">
          <div className="admin-confirm-modal">
            <div className="admin-confirm-icon">
              <Trash2 size={22} />
            </div>

            <h3>Delete this reply?</h3>

            <p>
              This reply will be permanently
              removed from the discussion.
            </p>

            <div className="admin-confirm-actions">
              <button
                type="button"
                onClick={() =>
                  setDeleteReplyTarget(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-danger-button"
                disabled={
                  actionLoading ===
                  `reply-delete-${deleteReplyTarget.id}`
                }
                onClick={
                  confirmDeleteReply
                }
              >
                Delete Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDiscussions;