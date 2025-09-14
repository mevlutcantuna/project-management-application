import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default LoadingScreen;
