import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage";
import Dashboard from "@/pages/Dashboard";

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
    element: <div>Protected</div>,
    children: [
      {
        path: "/workspace-selection",
        element: <WorkspaceSelectionPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
    ],
  },
]);
