-- Teams with members view
CREATE OR REPLACE VIEW teams_with_members AS
SELECT 
  t.id,
  t.name,
  t.identifier,
  t.workspace_id,
  t.icon_name,
  t.color,
  t.created_at,
  t.updated_at,
  COALESCE(
    json_agg(
      CASE 
        WHEN u.id IS NOT NULL THEN
          json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'email', u.email,
            'profile_picture', u.profile_picture
          )
        ELSE NULL
      END
    ) FILTER (WHERE u.id IS NOT NULL), 
    '[]'::json
  ) as users
FROM teams t
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN users u ON tm.user_id = u.id
GROUP BY t.id, t.name, t.identifier, t.workspace_id, t.icon_name, t.color, t.created_at, t.updated_at;
