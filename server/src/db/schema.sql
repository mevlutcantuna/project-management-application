-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, 
  profile_picture TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace members junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Workspace invitations (pending users)
CREATE TABLE IF NOT EXISTS workspace_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email VARCHAR(320) NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  UNIQUE(workspace_id, email)
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Issue statuses (predefined statuses)
CREATE TABLE IF NOT EXISTS issue_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  icon_name VARCHAR(50),
  color VARCHAR(7), -- Hex color code like #FF0000
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Issue labels
CREATE TABLE IF NOT EXISTS issue_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  color VARCHAR(7) NOT NULL, -- Hex color code
  is_frequently_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status_id UUID NOT NULL REFERENCES issue_statuses(id),
  label_id UUID REFERENCES issue_labels(id) ON DELETE SET NULL,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  parent_issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(issue_id, user_id)
);

CREATE TABLE IF NOT EXISTS issue_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(issue_id, user_id)
);

CREATE TABLE IF NOT EXISTS sub_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  sub_issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  UNIQUE(issue_id, sub_issue_id)
);

-- Issue activities
CREATE TABLE IF NOT EXISTS issue_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'assigned', 'status_changed', etc.
  field_name VARCHAR(50), -- Which field was changed
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Issue comments
CREATE TABLE IF NOT EXISTS issue_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_workspace ON issues(workspace_id);
CREATE INDEX IF NOT EXISTS idx_issues_assignee ON issues(assignee_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status_id);
CREATE INDEX IF NOT EXISTS idx_issues_parent ON issues(parent_issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_activities_issue ON issue_activities(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_issue ON issue_comments(issue_id);

-- Function for updating updated_at field
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (NEW IS DISTINCT FROM OLD) THEN
    NEW.updated_at := clock_timestamp();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users trigger
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Workspaces trigger
DROP TRIGGER IF EXISTS set_updated_at_workspaces ON workspaces;
CREATE TRIGGER set_updated_at_workspaces
BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Teams trigger
DROP TRIGGER IF EXISTS set_updated_at_teams ON teams;
CREATE TRIGGER set_updated_at_teams
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Issues trigger
DROP TRIGGER IF EXISTS set_updated_at_issues ON issues;
CREATE TRIGGER set_updated_at_issues
BEFORE UPDATE ON issues
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Issue comments trigger
DROP TRIGGER IF EXISTS set_updated_at_issue_comments ON issue_comments;
CREATE TRIGGER set_updated_at_issue_comments
BEFORE UPDATE ON issue_comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

