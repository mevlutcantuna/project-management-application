-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, 
  profile_picture TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace members junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  role user_role NOT NULL DEFAULT 'Member',
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
  name VARCHAR(100) NOT NULL,
  identifier VARCHAR(50) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team members junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'Member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);


-- Workspace statuses (predefined statuses)
CREATE TABLE IF NOT EXISTS workspace_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, name)
);

-- Workspace labels
CREATE TABLE IF NOT EXISTS workspace_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, name)
);

-- Workspace issues table
CREATE TABLE IF NOT EXISTS issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status_id UUID NOT NULL REFERENCES workspace_statuses(id),
  label_id UUID REFERENCES workspace_labels(id) ON DELETE SET NULL,
  priority issue_priority_type DEFAULT 'medium',
  parent_issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Issue subscribers junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS issue_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(issue_id, user_id)
);

-- Issue assignees junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS issue_assignees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(issue_id, user_id)
);

-- Issue activities log
CREATE TABLE IF NOT EXISTS issue_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type issue_activity_type NOT NULL,
  field_name VARCHAR(50),
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