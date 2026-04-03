import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // pas connecté
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // rôle non autorisé
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;