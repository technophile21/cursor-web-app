-- Create the api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create an index on the name column for faster lookups when checking uniqueness
CREATE INDEX api_keys_name_idx ON api_keys(name);

-- Create a function to update last_used timestamp
CREATE OR REPLACE FUNCTION update_last_used()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update last_used when a key is updated
CREATE TRIGGER update_api_key_last_used
BEFORE UPDATE ON api_keys
FOR EACH ROW
WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active)
EXECUTE FUNCTION update_last_used();

-- Disable Row Level Security for now (until we implement authentication)
ALTER TABLE api_keys DISABLE ROW LEVEL SECURITY; 