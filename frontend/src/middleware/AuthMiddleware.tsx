import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks";

export default function AuthMiddleware() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();

  // If user has no token and is not on login/register → redirect
  if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
    return <Navigate to="/login" replace />;
  }

  // If user has token and tries to access login/register → redirect home
  if (token && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, continue to route
  return <Outlet />;
}
