
-- Function for updating updated_at field
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS 
$$
BEGIN
  IF TG_OP = 'UPDATE' AND (NEW IS DISTINCT FROM OLD) THEN
    NEW.updated_at := clock_timestamp();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create default teams when workspace is created
CREATE OR REPLACE FUNCTION create_default_teams()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Trigger fired for workspace: %', NEW.id;
  
  INSERT INTO teams (workspace_id, name, identifier, icon_name, color, created_by_id) VALUES
    (NEW.id, 'General', 'GEN' , 'Building', 'lch(70.313 3.577 260.65)', NEW.owner_id),
    (NEW.id, 'Engineering', 'ENG' , 'Briefcase', 'lch(70.313 19.321 31.72)', NEW.owner_id),
    (NEW.id, 'Marketing', 'MKT' , 'BarChart', 'lch(48 59.31 288.43)', NEW.owner_id),
    (NEW.id, 'Design', 'DES' , 'Palette', 'lch(70.313 62.082 61.651)', NEW.owner_id);
  
  RAISE NOTICE 'Teams created for workspace: %', NEW.id;
  
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'Admin');
  
  RAISE NOTICE 'Workspace member added for workspace: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to add team creator to team_members
CREATE OR REPLACE FUNCTION add_team_creator_to_team_members()
RETURNS TRIGGER AS $$
BEGIN
RAISE NOTICE 'Trigger fired for team: %', NEW;
  IF NEW.created_by_id IS NOT NULL THEN
    INSERT INTO team_members (team_id, user_id, role)
    VALUES (NEW.id, NEW.created_by_id, 'Admin');
  END IF;

  RAISE NOTICE 'Team creator added to team_members: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;