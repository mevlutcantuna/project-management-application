import AuthLayout from "@/features/auth/components/Layout";
import LoginForm from "@/features/auth/components/LoginForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
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

export default LoginPage;
