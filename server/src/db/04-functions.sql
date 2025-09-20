
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
  
  INSERT INTO teams (workspace_id, name, description) VALUES
    (NEW.id, 'Engineering', 'Software development and technical tasks'),
    (NEW.id, 'Design', 'UI/UX design and creative work'),
    (NEW.id, 'Marketing', 'Marketing campaigns and content creation'),
    (NEW.id, 'General', 'General workspace discussions and tasks');
  
  RAISE NOTICE 'Teams created for workspace: %', NEW.id;
  
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'Admin');
  
  RAISE NOTICE 'Workspace member added for workspace: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;