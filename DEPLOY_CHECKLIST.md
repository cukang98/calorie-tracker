# Pre-Deployment Checklist

Use this checklist before deploying your app to ensure everything is ready.

## ✅ Pre-Deployment Steps

### 1. Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm run build` without errors
- [ ] Test `npm run preview` to verify production build works
- [ ] Test all features locally:
  - [ ] User registration
  - [ ] User login
  - [ ] Goal setup
  - [ ] Food entry creation
  - [ ] Image upload
  - [ ] Calendar navigation

### 2. Code Preparation
- [ ] Remove any console.log statements (or keep only essential ones)
- [ ] Remove any test/example data
- [ ] Ensure `.env` is in `.gitignore` (should not be committed)
- [ ] Commit all changes to git

### 3. Supabase Setup
- [ ] Database tables created (run `supabase-schema.sql`)
- [ ] Storage bucket `food-images` exists and is public
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Test database operations work correctly

### 4. Environment Variables Ready
Have these values ready to add to your hosting platform:
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- [ ] `VITE_HF_API_TOKEN` - (Optional) Hugging Face token

### 5. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or you have access to connect it to hosting platform

## 🚀 Deployment Steps (Vercel - Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Calorie Tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_HF_API_TOKEN` (optional)
6. Click "Deploy"
7. Wait 1-2 minutes for deployment

### Step 3: Update Supabase CORS
1. Go to Supabase Dashboard → Settings → API
2. Add to CORS:
   - `https://your-project.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

### Step 4: Test Deployment
- [ ] Visit your deployed URL
- [ ] Test registration
- [ ] Test login
- [ ] Test all features
- [ ] Check browser console for errors
- [ ] Test on mobile device

## 📝 Post-Deployment

- [ ] Share your deployed URL
- [ ] Monitor for any errors
- [ ] Set up custom domain (optional)
- [ ] Configure automatic deployments (usually automatic)

## 🐛 Common Issues

### Build Fails
- Check build logs in hosting platform
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names are exact (case-sensitive)

### CORS Errors
- Add deployment URL to Supabase CORS settings
- Include both production and preview URLs

### 404 on Page Refresh
- Verify redirect rules are configured
- Check `vercel.json` or `netlify.toml` exists

---

**Ready to deploy?** Follow the steps in [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions!
