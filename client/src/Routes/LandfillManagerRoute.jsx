import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import ErrorLoading from "../pages/Error/ErrorLoading";

const LandfillManagerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading || !user) {
    return <ErrorLoading></ErrorLoading>;
  }
  if (user && user.role === "landmanager") {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default LandfillManagerRoute;
