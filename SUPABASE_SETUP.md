# Supabase Setup Guide for API Keys Management

This guide walks you through setting up Supabase for the API Keys Management dashboard.

## 1. Create a Supabase Project

1. Sign up or sign in at [supabase.com](https://supabase.com)
2. Create a new project and note down the project URL and anon key
3. Add these credentials to your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 2. Create the API Keys Table

In the Supabase dashboard, navigate to the SQL Editor and run the following SQL (also available in `supabase/schema.sql`):

```sql
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
```

## 3. Naming Conventions - Important!

This project follows standard conventions:
- **Database**: Uses `snake_case` for column names (e.g., `created_at`, `is_active`)
- **TypeScript**: Uses `camelCase` for property names (e.g., `createdAt`, `isActive`)

The application includes automatic mapping between these conventions. The mapping happens in the `supabaseApiKeyService.ts` file, which handles:
- Converting TypeScript camelCase properties to snake_case for database operations
- Converting database snake_case fields back to camelCase for the application

If you see errors like: `Could not find the 'createdAt' column of 'api_keys'`, it means the mapping is not working correctly. Ensure you're using the helper functions provided in the service.

## 4. Configure API Access

1. Navigate to Project Settings > API in the Supabase dashboard
2. Under "JWT Settings", you may need to increase the JWT expiry time for longer sessions
3. Under "API Settings", ensure that "Row Level Security (RLS)" is disabled for now

## 5. Install Dependencies

Run the setup script to install all necessary dependencies:

```bash
# Make the script executable
chmod +x setup-supabase.sh

# Run the setup script
./setup-supabase.sh
```

Alternatively, install the dependencies manually:

```bash
npm install @supabase/supabase-js uuid
npm install --save-dev @types/uuid
```

## 6. Testing the Setup

After completing the setup:

1. Start your application with `npm run dev`
2. Navigate to the API Keys dashboard
3. Try creating, viewing, and managing API keys
4. Check the Supabase dashboard to confirm data is being stored correctly
   - Browse the Table Editor to see your API keys

## 7. Advanced: Adding Authentication (Optional)

If you want to implement user-specific API keys later:

1. Enable authentication in Supabase: Authentication > Settings
2. Update the schema to include user_id and enable RLS:

```sql
-- Alter the api_keys table to add user_id column
ALTER TABLE api_keys 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API keys"
  ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE USING (auth.uid() = user_id);
```

## Troubleshooting

- If you encounter CORS issues, check your Supabase project's API settings
- Ensure your environment variables are correctly set in `.env.local`
- Check browser console for any errors
- Use the Supabase dashboard's SQL Editor to run queries directly to debug data issues
- Check the "Logs" section in the Supabase dashboard for error messages 

### Common Errors

1. **"Could not find the 'createdAt' column of 'api_keys' in the schema cache"**
   - This is a naming convention issue. The database uses snake_case (`created_at`), but the code is using camelCase (`createdAt`).
   - The solution is implemented in `supabaseApiKeyService.ts` which provides automatic conversion between these formats.
   - Make sure you're using the transformation functions in the service. 