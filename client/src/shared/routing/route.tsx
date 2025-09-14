import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/login-page";
import SignupPage from "@/pages/signup-page";
import WorkspaceSelectionPage from "@/pages/workspace-selection-page";
import Dashboard from "@/pages/dashboard";
import ProtectedRoute from "./protected-route";
import WorkspaceCreationPage from "@/pages/workspace-creation-page";
import WorkspaceRoute from "./workspace-route";
import WorkspaceInvitePage from "@/pages/workspace-invite-page";
import LoadingScreen from "@/components/common/loading/loading-screen";

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
