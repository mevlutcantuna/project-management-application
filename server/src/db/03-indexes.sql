
-- Users 
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email); 

-- Workspaces 
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id); 

-- Workspace members 
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id); 
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id); 
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_user ON workspace_members(workspace_id, user_id); 

-- Workspace invitations 
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_workspace_id ON workspace_invitations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_email ON workspace_invitations(email);

-- Teams 
CREATE INDEX IF NOT EXISTS idx_teams_workspace_id ON teams(workspace_id);

-- Team members 
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);

-- Issue labels 
CREATE INDEX IF NOT EXISTS idx_issue_labels_workspace_id ON issue_labels(workspace_id);

-- Issues 
CREATE INDEX IF NOT EXISTS idx_issues_workspace_id ON issues(workspace_id);
CREATE INDEX IF NOT EXISTS idx_issues_team_id ON issues(team_id);
CREATE INDEX IF NOT EXISTS idx_issues_created_by_id ON issues(created_by_id);
CREATE INDEX IF NOT EXISTS idx_issues_status_id ON issues(status_id);
CREATE INDEX IF NOT EXISTS idx_issues_label_id ON issues(label_id);
CREATE INDEX IF NOT EXISTS idx_issues_parent_issue_id ON issues(parent_issue_id);

-- Issue subscribers 
CREATE INDEX IF NOT EXISTS idx_issue_subscribers_issue_id ON issue_subscribers(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_subscribers_user_id ON issue_subscribers(user_id);

-- Issue assignees 
CREATE INDEX IF NOT EXISTS idx_issue_assignees_issue_id ON issue_assignees(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_assignees_user_id ON issue_assignees(user_id);

-- Sub issues 
CREATE INDEX IF NOT EXISTS idx_sub_issues_issue_id ON sub_issues(issue_id);
CREATE INDEX IF NOT EXISTS idx_sub_issues_sub_issue_id ON sub_issues(sub_issue_id);

-- Issue activities 
CREATE INDEX IF NOT EXISTS idx_issue_activities_issue_id ON issue_activities(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_activities_user_id ON issue_activities(user_id);

-- Issue comments 
CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_user_id ON issue_comments(user_id);
