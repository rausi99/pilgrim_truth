import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  deleteAdminUser,
  getAdminUser,
  getAdminUsers,
  toggleAdminUserStatus,
  updateAdminUserRole,
} from "../../services/admin";

import "./AdminUsers.css";

function AdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [processingId, setProcessingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers(token);

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const isActive =
        user.is_active === true ||
        user.is_active === "true";

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  const handleViewUser = async (userId) => {
    try {
      setLoadingUser(true);
      setError("");

      const data = await getAdminUser(token, userId);

      setSelectedUser(data.user);
    } catch (err) {
      setError(err.message || "Unable to load user.");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setProcessingId(user.id);
      setError("");

      await toggleAdminUserStatus(token, user.id);

      await loadUsers();

      if (selectedUser?.id === user.id) {
        const data = await getAdminUser(token, user.id);
        setSelectedUser(data.user);
      }
    } catch (err) {
      setError(err.message || "Unable to update user status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (user, role) => {
    if (role === user.role) return;

    try {
      setProcessingId(user.id);
      setError("");

      await updateAdminUserRole(token, user.id, role);

      await loadUsers();

      if (selectedUser?.id === user.id) {
        const data = await getAdminUser(token, user.id);
        setSelectedUser(data.user);
      }
    } catch (err) {
      setError(err.message || "Unable to update user role.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      setProcessingId(deleteTarget.id);
      setError("");

      await deleteAdminUser(token, deleteTarget.id);

      setDeleteTarget(null);

      if (selectedUser?.id === deleteTarget.id) {
        setSelectedUser(null);
      }

      await loadUsers();
    } catch (err) {
      setError(err.message || "Unable to delete user.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const isActiveUser = (user) =>
    user.is_active === true || user.is_active === "true";

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <div>
          <p className="admin-users-eyebrow">Community / Users</p>

          <h1>Users</h1>

          <p>
            Manage registered users, roles, account access and community
            participation.
          </p>
        </div>

        <div className="admin-users-count">
          <strong>{users.length}</strong>
          <span>Registered users</span>
        </div>
      </div>

      {error && (
        <div className="admin-users-alert">
          {error}
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-users-toolbar">
        <div className="admin-users-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
        >
          <option value="all">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Administrators</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          className="admin-users-clear"
          onClick={clearFilters}
        >
          Clear
        </button>
      </div>

      <div className="admin-users-summary">
        Showing <strong>{filteredUsers.length}</strong> of{" "}
        <strong>{users.length}</strong> users
      </div>

      {loading ? (
        <div className="admin-users-state">
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-users-state">
          <UserCheck size={32} />
          <h3>No users found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Controls</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const active = isActiveUser(user);
                const processing = processingId === user.id;

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                            />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>

                        <div>
                          <strong>{user.name}</strong>

                          {user.bio && (
                            <small>{user.bio}</small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <div className="admin-role-control">
                        <Shield size={14} />

                        <select
                          value={user.role}
                          disabled={processing}
                          onChange={(event) =>
                            handleRoleChange(
                              user,
                              event.target.value
                            )
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-user-status ${
                          active ? "active" : "inactive"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>{formatDate(user.created_at)}</td>

                    <td>
                      <div className="admin-user-actions">
                        <button
                          title="View user"
                          onClick={() =>
                            handleViewUser(user.id)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          title={
                            active
                              ? "Deactivate user"
                              : "Activate user"
                          }
                          disabled={processing}
                          onClick={() =>
                            handleToggleStatus(user)
                          }
                        >
                          {active ? (
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
                        </button>

                        <button
                          className="danger"
                          title="Delete user"
                          disabled={processing}
                          onClick={() =>
                            setDeleteTarget(user)
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
      )}

      {loadingUser && (
        <div className="admin-users-modal-overlay">
          <div className="admin-users-modal loading-modal">
            Loading user...
          </div>
        </div>
      )}

      {selectedUser && !loadingUser && (
        <div
          className="admin-users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <div className="admin-users-modal">
            <div className="admin-users-modal-header">
              <div>
                <p>User profile</p>
                <h2>{selectedUser.name}</h2>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-user-profile">
              <div className="admin-user-profile-avatar">
                {selectedUser.avatar_url ? (
                  <img
                    src={selectedUser.avatar_url}
                    alt={selectedUser.name}
                  />
                ) : (
                  getInitials(selectedUser.name)
                )}
              </div>

              <div>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
              </div>
            </div>

            <div className="admin-user-details">
              <div>
                <span>Role</span>
                <strong>{selectedUser.role}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {isActiveUser(selectedUser)
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(selectedUser.created_at)}
                </strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>#{selectedUser.id}</strong>
              </div>
            </div>

            {selectedUser.bio && (
              <div className="admin-user-bio">
                <span>Bio</span>
                <p>{selectedUser.bio}</p>
              </div>
            )}

            <div className="admin-user-modal-actions">
              <button
                onClick={() =>
                  handleToggleStatus(selectedUser)
                }
                disabled={processingId === selectedUser.id}
              >
                {isActiveUser(selectedUser)
                  ? "Deactivate account"
                  : "Activate account"}
              </button>

              <button
                className="danger"
                onClick={() => {
                  setDeleteTarget(selectedUser);
                  setSelectedUser(null);
                }}
              >
                <Trash2 size={16} />
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="admin-users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div className="admin-users-delete-modal">
            <div className="delete-icon">
              <Trash2 size={22} />
            </div>

            <h2>Delete user?</h2>

            <p>
              You are about to permanently delete{" "}
              <strong>{deleteTarget.name}</strong>.
            </p>

            <p className="delete-warning">
              This action cannot be undone.
            </p>

            <div className="delete-actions">
              <button
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                className="danger"
                disabled={processingId === deleteTarget.id}
                onClick={handleDeleteUser}
              >
                {processingId === deleteTarget.id
                  ? "Deleting..."
                  : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;