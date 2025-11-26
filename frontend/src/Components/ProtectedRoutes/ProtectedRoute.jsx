import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    if (user && user.role === "admin") {
      setIsAdmin(true);
      return;
    }

    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Role:", decoded.role);

        if (decoded.role === "admin") {
          setIsAdmin(true);
          return;
        }
      } catch (error) {
        console.log("Token invalid:", error);
      }
    }

    
    setIsAdmin(false);
  }, []);

  
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Checking admin access...
      </div>
    );
  }

  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }


  return children;
};

export default ProtectedRoute;
