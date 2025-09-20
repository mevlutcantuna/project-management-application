
-- Trigger to run after workspace creation
DROP TRIGGER IF EXISTS create_default_teams_trigger ON workspaces;
CREATE TRIGGER create_default_teams_trigger
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION create_default_teams();

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

