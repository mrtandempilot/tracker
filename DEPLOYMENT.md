# Deploying to Vercel

Follow these steps to deploy your Family Tracker to Vercel:

## 1. Push to GitHub
I have already initialized a git repository for you. Now you need to link it to your GitHub repository and push the code:

```powershell
# Change directory to the project
cd C:\Users\mrtan\.gemini\antigravity\scratch\family-tracker

# Add the remote repository
git remote add origin https://github.com/mrtandempilot/tracker.git

# Stage all files
git add .

# Commit changes
git commit -m "Initial commit: Family Tracker Dashboard"

# Push to main branch
git push -u origin main
```

## 2. Connect to Vercel
1. Go to [Vercel](https://vercel.com/new).
2. Import your `tracker` repository from GitHub.
3. **CRITICAL**: Configure the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://vcqpqhyawcemtstdaysa.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Click **Deploy**.

## 3. Enable Public Access (Supabase SQL)
Since we disabled the login screen, you must run this SQL in your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) to allow devices to be seen without logging in:

```sql
-- Allow anyone to see family members and locations
CREATE POLICY "Allow public read" ON family_members FOR SELECT USING (true);
CREATE POLICY "Allow public read locations" ON locations FOR SELECT USING (true);

-- Allow devices to send locations without login
CREATE POLICY "Allow public insert locations" ON locations FOR INSERT WITH CHECK (true);
```

## 4. Post-Deployment
Once deployed, Vercel will provide you with a production URL. Your dashboard will be live and open to everyone!
