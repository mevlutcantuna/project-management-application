import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage, SignupPage } from "@/features/auth/pages";
import {
  WorkspaceSelectionPage,
  WorkspaceCreationPage,
  WorkspaceInvitationPage,
} from "@/features/workspace/pages";
import {
  TeamCreationPage,
  TeamDetailsPage,
  TeamMembersPage,
} from "@/features/teams/pages";
import { PreferencesPage } from "@/features/settings/pages";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "./protected-route";
import WorkspaceRoute from "./workspace-route";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SettingsLayout from "@/components/layout/settings-layout";

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
            path: "/create",
            element: <WorkspaceCreationPage />,
          },
          {
            path: "/:workspaceUrl/invite",
            element: <WorkspaceInvitationPage />,
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
                path: "team/:identifier",
                element: <TeamDetailsPage />,
              },
              {
                path: "team/:identifier/members",
                element: <TeamMembersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
