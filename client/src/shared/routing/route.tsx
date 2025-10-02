import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/pages/login-page";
import SignupPage from "@/pages/signup-page";
import WorkspaceSelectionPage from "@/pages/workspace-selection-page";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "./protected-route";
import WorkspaceCreationPage from "@/pages/workspace-creation-page";
import WorkspaceRoute from "./workspace-route";
import WorkspaceInvitePage from "@/pages/workspace-invite-page";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SettingsLayout from "@/components/layout/settings-layout";
import TeamCreationPage from "@/pages/team-creation-page";
import PreferencesPage from "@/pages/preferences-page";
import TeamDetailsPage from "@/pages/team-details-page";

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
            path: "/:workspaceUrl/invite",
            element: <WorkspaceInvitePage />,
          },
          {
            path: "/:workspaceUrl",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <div>Dashboard Home</div>,
              },
            ],
          },
          {
            path: "/:workspaceUrl/settings",
            element: <SettingsLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="preferences" />,
              },
              {
                path: "preferences",
                element: <PreferencesPage />,
              },
              {
                path: "team",
                element: <Navigate to="team/create" />,
              },
              {
                path: "team/create",
                element: <TeamCreationPage />,
              },
              {
                path: "team/:teamId",
                element: <TeamDetailsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
