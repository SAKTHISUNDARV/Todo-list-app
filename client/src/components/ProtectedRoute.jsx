import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Check if user exists and token is valid
  const isAuthenticated = () => {
    if (!token || !user) {
      return false;
    }
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        // Clean up expired session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
      }
      return true;
    } catch (error) {
      // If token is invalid, clean up
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

export default ProtectedRoute;