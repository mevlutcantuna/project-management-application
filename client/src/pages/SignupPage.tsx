import AuthLayout from "@/features/auth/components/Layout";
import SignupForm from "@/features/auth/components/SignupForm";

const SignupPage = () => {
  return (
    <AuthLayout title="Create your account">
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
