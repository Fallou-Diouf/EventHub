import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // pas de token → redirige vers login
    return <Navigate to="/" />;
  }

  // connecté → affiche le composant
  return children;
}

export default ProtectedRoute;