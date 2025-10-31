import AuthLayout from "@/features/auth/components/layout";
import LoginForm from "@/features/auth/components/login-form";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Log in to your account">
      <LoginForm
        onSuccess={() => {
          navigate("/");
        }}
      />
    </AuthLayout>
  );
};
