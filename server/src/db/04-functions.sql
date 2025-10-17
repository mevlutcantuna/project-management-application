
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
  
  INSERT INTO teams (workspace_id, name, description, icon_name, color) VALUES
    (NEW.id, 'Engineering', 'Software development and technical tasks' , 'Briefcase', 'lch(70.313 19.321 31.72)'),
    (NEW.id, 'Design', 'UI/UX design and creative work' , 'Palette', 'lch(70.313 62.082 61.651)'),
    (NEW.id, 'Marketing', 'Marketing campaigns and content creation' , 'BarChart', 'lch(48 59.31 288.43)'),
    (NEW.id, 'General', 'General workspace discussions and tasks' , 'Building', 'lch(70.313 3.577 260.65)');
  
  RAISE NOTICE 'Teams created for workspace: %', NEW.id;
  
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'Admin');
  
  RAISE NOTICE 'Workspace member added for workspace: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;