import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import LoadingScreen from "@/components/LoadingScreen";
import { useGetMeQuery } from "@/features/auth/api/queries";

const ProtectedRoute = () => {
  const { user, setUser } = useAuthStore();
  const { data, isPending } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }
  }, [data, setUser]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
