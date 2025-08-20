import AuthLayout from "@/features/auth/components/Layout";
import LoginForm from "@/features/auth/components/LoginForm";

const LoginPage = () => {
  return (
    <AuthLayout title="Log in to your account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
