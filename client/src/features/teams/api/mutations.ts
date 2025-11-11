import { api } from "@/shared/lib/api";
import type {
  AddUserToTeamInput,
  CreateTeamInput,
  LeaveTeamInput,
  RemoveUserFromTeamInput,
  Team,
  TeamMember,
  UpdateTeamInput,
} from "@/shared/types/team";
import { useMutation } from "@tanstack/react-query";

export const useCreateTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<Team, Error, CreateTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<Team, Error, CreateTeamInput>({
    mutationFn: async (team: CreateTeamInput) => {
      const response = await api.post(
        `workspaces/${team.workspaceId}/teams`,
        team
      );
      return response.data;
    },
    ...options,
  });
};

export const useUpdateTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<Team, Error, UpdateTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<Team, Error, UpdateTeamInput>({
    mutationFn: async (team: UpdateTeamInput) => {
      const response = await api.put(
        `/workspaces/${team.workspaceId}/teams/${team.id}`,
        team
      );
      return response.data;
    },
    ...options,
  });
};

export const useRemoveUserFromTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<void, Error, RemoveUserFromTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<void, Error, RemoveUserFromTeamInput>({
    mutationFn: async ({
      workspaceId,
      teamId,
      userId,
    }: RemoveUserFromTeamInput) => {
      const response = await api.delete(
        `/workspaces/${workspaceId}/teams/${teamId}/members/${userId}/remove`
      );
      return response.data;
    },
    ...options,
  });
};

export const useLeaveTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<void, Error, LeaveTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<void, Error, LeaveTeamInput>({
    mutationFn: async ({ workspaceId, teamId }: LeaveTeamInput) => {
      const response = await api.post(
        `/workspaces/${workspaceId}/teams/${teamId}/members/leave`
      );
      return response.data;
    },
    ...options,
  });
};

export const useAddUserToTeamMutation = (
  options?: Omit<
    Parameters<typeof useMutation<TeamMember, Error, AddUserToTeamInput>>[0],
    "mutationFn"
  >
) => {
  return useMutation<TeamMember, Error, AddUserToTeamInput>({
    mutationFn: async ({
      workspaceId,
      teamId,
      email,
      role,
    }: AddUserToTeamInput) => {
      const response = await api.post(
        `/workspaces/${workspaceId}/teams/${teamId}/members`,
        {
          email,
          role,
        }
      );
      return response.data;
    },
    ...options,
  });
};
