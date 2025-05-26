import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
