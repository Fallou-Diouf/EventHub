import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
