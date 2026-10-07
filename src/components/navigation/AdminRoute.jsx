import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-auth-loading">
        <div className="admin-auth-spinner" />
        <p>Checking administrator access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;