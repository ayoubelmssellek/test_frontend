import { useQuery } from "@tanstack/react-query";
import { fetchingUser } from "./Api/fetchingData/FetchUserData";
import ProtectedRoute from "./Helper/ProtectedRoute";
import ClientRoutes from "./Client/ClientRoutes";
import AdminRoutes from "./Admin/AdminRoutes";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "./Helper/Loading/Loading";

function AppRoutes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchingUser,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
      retry: 1,
    
  });

 useEffect(() => {
  if (isError && (window.location.pathname.startsWith("/admin") || window.location.pathname === "/")){
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  }
}, [isError, error, navigate]);

  const isAdmin =
    userData?.role_name === "admin" || userData?.role_name === "manager";

  if (token && isLoading) return <Loading/>;

  return (
    <Routes>
      <Route
        path="/Dashboard/*"
        element={
          <ProtectedRoute isAllowed={token && isAdmin}>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={<ClientRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
