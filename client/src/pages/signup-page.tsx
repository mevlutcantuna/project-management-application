import AuthLayout from "@/features/auth/components/layout";
import SignupForm from "@/features/auth/components/signup-form";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Create your account">
      <SignupForm
        onSuccess={() => {
          navigate("/login");
        }}
      />
    </AuthLayout>
  );
};

export default SignupPage;
