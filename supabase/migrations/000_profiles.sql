-- User profiles table (role: admin | staff | patient)
-- Run BEFORE other migrations.

CREATE TABLE IF NOT EXISTS profiles (
  id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email    TEXT,
  role     TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('admin','staff','patient')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "profiles_own_read"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_own_update"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_admin_read"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'admin'
  ));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'patient')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- To make a user admin, run in Supabase SQL editor:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
