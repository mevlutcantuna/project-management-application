import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import LoadingScreen from "@/components/LoadingScreen";
import { useGetMeQuery } from "@/features/auth/api/queries";

const ProtectedRoute = () => {
  const { setUser, logout } = useAuthStore();
  const { data, isPending, isFetched, isError } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout, setUser]);

  if (isPending || !isFetched) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
