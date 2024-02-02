import React from "react";
import { Navigate } from "react-router-dom";
import * as auth from "../../services/authService";

const RequireAuth = ({ children, redirectTo, from }) => {
  const user = auth.getCurrentUser();
  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ from: from }} replace />
  );
};

export default RequireAuth;
