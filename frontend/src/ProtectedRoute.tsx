import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "loginToContinue";
    if (!user) {
      if (!toast.isActive(toastId)) {
        toast.warn("Login to continue", { toastId });
      }
      navigate("/login");
    }
  }, [user, history]);

  return <>{children}</>;
};

export default ProtectedRoute;
