import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (token) {
    return role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/author-page" replace />
    );
  }
  return children;
};

export default AuthRoute;
