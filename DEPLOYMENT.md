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
3. **CRITICAL**: Configure the Environment Variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://vcqpqhyawcemtstdaysa.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Copy the full key from your `.env.local`)
4. Click **Deploy**.

## 3. Post-Deployment
Once deployed, Vercel will provide you with a production URL. Your dashboard will be live and ready!
