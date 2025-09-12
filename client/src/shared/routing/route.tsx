import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import WorkspaceCreationPage from "@/pages/WorkspaceCreationPage";
import WorkspaceRoute from "./WorkspaceRoute";
import WorkspaceInvitePage from "@/pages/WorkspaceInvitePage";
import LoadingScreen from "@/components/LoadingScreen";

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
        element: <WorkspaceRoute />,
        children: [
          {
            path: "/",
            element: <LoadingScreen />,
          },
          {
            path: "/workspaces",
            element: <WorkspaceSelectionPage />,
          },
          {
            path: "/join",
            element: <WorkspaceCreationPage />,
          },
          {
            path: "/:workspaceUrl",
            element: <Dashboard />,
          },
          {
            path: "/:workspaceUrl/invite",
            element: <WorkspaceInvitePage />,
          },
        ],
      },
    ],
  },
]);
