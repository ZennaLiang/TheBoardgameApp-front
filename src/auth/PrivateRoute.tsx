import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./index";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? (
    <>{children}</>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;
