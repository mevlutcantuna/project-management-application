import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import WorkspaceProvider from "../providers/WorkspaceProvider";

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
        element: <WorkspaceProvider />,
        children: [
          {
            path: "/",
            element: <WorkspaceSelectionPage />,
          },
          {
            path: "/:workspaceId",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);
