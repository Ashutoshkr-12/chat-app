import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  // otherwise render the route's children
  return <Outlet />;
};

export default ProtectedRoute;
