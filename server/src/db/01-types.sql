-- Issue priority type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_priority_type') THEN
        CREATE TYPE issue_priority_type AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
END
$$;

-- Issue activity type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_activity_type') THEN
        CREATE TYPE issue_activity_type AS ENUM ('created', 'updated', 'assigned', 'status_changed', 'commented');
    END IF;
END
$$;

-- User role
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Manager', 'Member'); 
    END IF;
END
$$;