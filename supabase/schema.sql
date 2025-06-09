-- Create the api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index on the name column for faster lookups when checking uniqueness
CREATE INDEX api_keys_name_idx ON api_keys(name);

-- Create an index on the user_id column for faster lookups
CREATE INDEX api_keys_user_id_idx ON api_keys(user_id);

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

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own API keys
CREATE POLICY "Users can only see their own API keys"
ON api_keys FOR SELECT
USING (auth.uid() = user_id);

-- Create policy to allow users to only insert their own API keys
CREATE POLICY "Users can only insert their own API keys"
ON api_keys FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to only update their own API keys
CREATE POLICY "Users can only update their own API keys"
ON api_keys FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy to allow users to only delete their own API keys
CREATE POLICY "Users can only delete their own API keys"
ON api_keys FOR DELETE
USING (auth.uid() = user_id); 