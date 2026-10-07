import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileWarning,
  MessageCircle,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  deleteReportedContent,
  getAdminReport,
  getAdminReports,
  updateAdminReportStatus,
} from "../../services/admin";

import "./AdminReports.css";

function AdminReports() {
  const { token } = useAuth();

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] =
    useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminReports(token);

      setReports(data.reports || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadReports();
    }
  }, [token]);

  const filteredReports = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return reports.filter((report) => {
      const type = report.reply_id
        ? "reply"
        : "discussion";

      const matchesSearch =
        !query ||
        report.reason
          ?.toLowerCase()
          .includes(query) ||
        report.reporter_name
          ?.toLowerCase()
          .includes(query) ||
        report.reporter_email
          ?.toLowerCase()
          .includes(query) ||
        report.discussion_title
          ?.toLowerCase()
          .includes(query) ||
        report.discussion_content
          ?.toLowerCase()
          .includes(query) ||
        report.reply_content
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    reports,
    search,
    statusFilter,
    typeFilter,
  ]);

  const openReport = async (reportId) => {
    try {
      setViewLoading(true);
      setError("");

      const data = await getAdminReport(
        token,
        reportId
      );

      setSelectedReport(data.report);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to load report."
      );
    } finally {
      setViewLoading(false);
    }
  };

  const changeStatus = async (
    report,
    status
  ) => {
    try {
      setActionLoading(
        `status-${report.id}`
      );

      const data =
        await updateAdminReportStatus(
          token,
          report.id,
          status
        );

      setReports((current) =>
        current.map((item) =>
          item.id === report.id
            ? {
                ...item,
                status: data.report.status,
              }
            : item
        )
      );

      if (
        selectedReport?.id === report.id
      ) {
        setSelectedReport((current) => ({
          ...current,
          status: data.report.status,
        }));
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to update report."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDeleteContent = async () => {
    if (!deleteTarget) return;

    try {
      setActionLoading(
        `delete-${deleteTarget.id}`
      );

      await deleteReportedContent(
        token,
        deleteTarget.id
      );

      setReports((current) =>
        current.filter(
          (item) =>
            item.id !== deleteTarget.id
        )
      );

      if (
        selectedReport?.id ===
        deleteTarget.id
      ) {
        setSelectedReport(null);
      }

      setDeleteTarget(null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to remove reported content."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getReportType = (report) =>
    report.reply_id
      ? "Reply"
      : "Discussion";

  const getReportedContent = (report) => {
    if (report.reply_id) {
      return (
        report.reply_content ||
        "Reply content unavailable."
      );
    }

    return (
      report.discussion_content ||
      "Discussion content unavailable."
    );
  };

  return (
    <div className="admin-reports-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            COMMUNITY
          </span>

          <h1>Reports</h1>

          <p>
            Review and moderate reported
            community content.
          </p>
        </div>

        <div className="admin-report-count">
          <FileWarning size={18} />

          <span>
            {reports.filter(
              (item) =>
                item.status === "pending"
            ).length}{" "}
            pending reports
          </span>
        </div>
      </div>

      {error && (
        <div className="admin-error-banner">
          <AlertTriangle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-reports-toolbar">
        <div className="admin-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search reports, reporters or content..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="admin-filter-box">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="resolved">
              Resolved
            </option>

            <option value="dismissed">
              Dismissed
            </option>
          </select>
        </div>

        <div className="admin-filter-box">
          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All content
            </option>

            <option value="discussion">
              Discussions
            </option>

            <option value="reply">
              Replies
            </option>
          </select>
        </div>

        {(search ||
          statusFilter !== "all" ||
          typeFilter !== "all") && (
          <button
            type="button"
            className="admin-clear-filter"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>

      <div className="admin-reports-summary">
        Showing{" "}
        <strong>
          {filteredReports.length}
        </strong>{" "}
        of{" "}
        <strong>{reports.length}</strong>{" "}
        reports
      </div>

      <div className="admin-reports-table-card">
        {loading ? (
          <div className="admin-report-state">
            <div className="admin-loading-spinner" />

            <p>
              Loading reports...
            </p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="admin-report-state">
            <CheckCircle2 size={42} />

            <h3>No reports found</h3>

            <p>
              There are no reports matching
              the current filters.
            </p>
          </div>
        ) : (
          <div className="admin-reports-table-wrap">
            <table className="admin-reports-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Content</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Controls</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map(
                  (report) => (
                    <tr key={report.id}>
                      <td>
                        <div className="admin-report-type">
                          {report.reply_id ? (
                            <MessageCircle
                              size={16}
                            />
                          ) : (
                            <FileWarning
                              size={16}
                            />
                          )}

                          <div>
                            <strong>
                              {getReportType(
                                report
                              )}
                            </strong>

                            <span>
                              Report #{report.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="admin-reported-content">
                          <strong>
                            {report.reply_id
                              ? "Reply"
                              : report.discussion_title ||
                                "Discussion"}
                          </strong>

                          <p>
                            {getReportedContent(
                              report
                            )}
                          </p>
                        </div>
                      </td>

                      <td>
                        <div className="admin-reporter">
                          <div className="admin-reporter-avatar">
                            <User size={15} />
                          </div>

                          <div>
                            <strong>
                              {
                                report.reporter_name
                              }
                            </strong>

                            <span>
                              {
                                report.reporter_email
                              }
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <select
                          className={`admin-report-status-select admin-report-status-${report.status}`}
                          value={report.status}
                          disabled={
                            actionLoading ===
                            `status-${report.id}`
                          }
                          onChange={(event) =>
                            changeStatus(
                              report,
                              event.target.value
                            )
                          }
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="resolved">
                            Resolved
                          </option>

                          <option value="dismissed">
                            Dismissed
                          </option>
                        </select>
                      </td>

                      <td>
                        <span className="admin-report-date">
                          {formatDate(
                            report.created_at
                          )}
                        </span>
                      </td>

                      <td>
                        <div className="admin-report-actions">
                          <button
                            type="button"
                            title="View report"
                            onClick={() =>
                              openReport(
                                report.id
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Remove reported content"
                            className="admin-danger-action"
                            onClick={() =>
                              setDeleteTarget(
                                report
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

      {selectedReport && (
        <div className="admin-modal-overlay">
          <div className="admin-report-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  MODERATION REPORT
                </span>

                <h2>
                  Report #{selectedReport.id}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                <X size={20} />
              </button>
            </div>

            {viewLoading ? (
              <div className="admin-report-state">
                <div className="admin-loading-spinner" />
                <p>
                  Loading report...
                </p>
              </div>
            ) : (
              <div className="admin-report-modal-body">
                <div className="admin-report-detail-grid">
                  <div>
                    <span>Type</span>

                    <strong>
                      {getReportType(
                        selectedReport
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>

                    <strong>
                      {selectedReport.status}
                    </strong>
                  </div>

                  <div>
                    <span>Reported by</span>

                    <strong>
                      {
                        selectedReport.reporter_name
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>
                      {formatDate(
                        selectedReport.created_at
                      )}
                    </strong>
                  </div>
                </div>

                <div className="admin-report-section">
                  <span>
                    Report reason
                  </span>

                  <div className="admin-report-reason">
                    {selectedReport.reason}
                  </div>
                </div>

                <div className="admin-report-section">
                  <span>
                    Reported content
                  </span>

                  <div className="admin-reported-content-large">
                    {selectedReport.reply_id && (
                      <h3>
                        Reply to:{" "}
                        {
                          selectedReport.discussion_title
                        }
                      </h3>
                    )}

                    {!selectedReport.reply_id && (
                      <h3>
                        {
                          selectedReport.discussion_title
                        }
                      </h3>
                    )}

                    <p>
                      {getReportedContent(
                        selectedReport
                      )}
                    </p>
                  </div>
                </div>

                <div className="admin-report-section">
                  <span>
                    Moderation status
                  </span>

                  <select
                    className="admin-report-modal-status"
                    value={
                      selectedReport.status
                    }
                    onChange={(event) =>
                      changeStatus(
                        selectedReport,
                        event.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="resolved">
                      Resolved
                    </option>

                    <option value="dismissed">
                      Dismissed
                    </option>
                  </select>
                </div>

                <div className="admin-report-modal-actions">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedReport(null)
                    }
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className="admin-danger-button"
                    onClick={() => {
                      setDeleteTarget(
                        selectedReport
                      );
                      setSelectedReport(null);
                    }}
                  >
                    <Trash2 size={16} />
                    Remove Content
                  </button>
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
              Remove reported content?
            </h3>

            <p>
              This will permanently remove the
              reported{" "}
              {deleteTarget.reply_id
                ? "reply"
                : "discussion"}{" "}
              from the community.
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
                  confirmDeleteContent
                }
              >
                Remove Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;