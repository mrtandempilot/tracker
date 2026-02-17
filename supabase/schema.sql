-- Create family_members table
CREATE TABLE family_members (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  family_id UUID NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create locations table
CREATE TABLE locations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES family_members(user_id) ON DELETE CASCADE,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  battery_level INT,
  accuracy FLOAT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Policies for family_members
CREATE POLICY "Users can view their family members" ON family_members
  FOR SELECT USING (
    family_id IN (
      SELECT family_id FROM family_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON family_members
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for locations
CREATE POLICY "Users can view their family locations" ON locations
  FOR SELECT USING (
    user_id IN (
      SELECT user_id FROM family_members WHERE family_id IN (
        SELECT family_id FROM family_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert their own location" ON locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.family_members (user_id, display_name, family_id, color)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', gen_random_uuid(), '#3b82f6');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
-- Note: You might need to adjust this depending on how you want to handle family IDs
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
