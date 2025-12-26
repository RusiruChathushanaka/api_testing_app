# 🔧 Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the project details and create

## 2. Create the Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Create the api_executions table
CREATE TABLE api_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')),
  url TEXT NOT NULL,
  headers JSONB DEFAULT '[]'::jsonb,
  params JSONB DEFAULT '[]'::jsonb,
  request_body TEXT,
  response_status INTEGER,
  response_status_text TEXT,
  response_headers JSONB DEFAULT '{}'::jsonb,
  response_body TEXT,
  response_time INTEGER,
  response_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX idx_api_executions_created_at ON api_executions(created_at DESC);

-- Create an index on method for filtering
CREATE INDEX idx_api_executions_method ON api_executions(method);

-- Create a trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_executions_updated_at
  BEFORE UPDATE ON api_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE api_executions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (modify later with auth)
CREATE POLICY "Allow all operations for now" ON api_executions
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" to execute the query

## 3. Get Your API Keys

1. In your Supabase project, go to **Settings** > **API**
2. Find the following values:
   - **Project URL** (under Project URL)
   - **anon public** key (under Project API keys)

## 4. Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase URL and anon key.

## 5. Restart Your Development Server

```bash
npm run dev
```

## 🎉 Done!

You can now save API executions to your Supabase database by clicking the "Save" button in the app header!

---

## Optional: View Your Data

To view saved executions in Supabase:

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `api_executions` table
3. You'll see all your saved API executions

## Optional: Add Authentication (Future Enhancement)

If you want to add user authentication later, you can:

1. Enable authentication in Supabase
2. Modify the RLS policies to filter by `auth.uid()`
3. Add a `user_id` column to the `api_executions` table
