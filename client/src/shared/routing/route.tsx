import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/workspace-selection",
        element: <WorkspaceSelectionPage />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
]);
