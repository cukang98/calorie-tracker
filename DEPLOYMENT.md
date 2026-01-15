# Deployment Guide

This guide will help you deploy your Calorie Tracker app to various hosting platforms.

## Prerequisites

Before deploying, make sure:
1. ✅ Your Supabase project is set up and configured
2. ✅ Your `.env` file has the correct credentials (for local testing)
3. ✅ You've tested the app locally with `npm run dev`
4. ✅ The app builds successfully with `npm run build`

## Option 1: Vercel (Recommended - Easiest)

Vercel offers free hosting with automatic deployments from GitHub.

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
     - `VITE_HF_API_TOKEN` = your Hugging Face token (optional)

6. Click **"Deploy"**

7. Wait for deployment (usually 1-2 minutes)

8. Your app will be live at `https://your-project-name.vercel.app`

### Step 3: Update Supabase CORS Settings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Under **CORS**, add your Vercel domain:
   - `https://your-project-name.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

### Automatic Deployments

- Every push to `main` branch = production deployment
- Pull requests = preview deployments
- All deployments are automatic!

---

## Option 2: Netlify

Netlify also offers free hosting with GitHub integration.

### Step 1: Push to GitHub

Same as Vercel - make sure your code is on GitHub.

### Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `./` (leave empty)

5. **Add Environment Variables**:
   - Click **"Environment variables"** → **"Add variable"**
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
     - `VITE_HF_API_TOKEN` = your Hugging Face token (optional)

6. Click **"Deploy site"**

7. Your app will be live at `https://random-name.netlify.app`

### Step 3: Update Supabase CORS Settings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Under **CORS**, add your Netlify domain:
   - `https://your-site-name.netlify.app`
   - `https://*.netlify.app` (for branch deployments)

### Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow the instructions to configure DNS

---

## Option 3: GitHub Pages

GitHub Pages is free but requires a bit more setup.

### Step 1: Install gh-pages package

```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json

Add these scripts:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
}
```

### Step 3: Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/YOUR_REPO_NAME/', // Add this line
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 4: Deploy

```bash
npm run deploy
```

### Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select **gh-pages** branch
4. Your site will be at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

**Note**: GitHub Pages doesn't support environment variables easily. You'll need to use a different approach or consider using Vercel/Netlify instead.

---

## Option 4: Railway

Railway offers easy deployment with automatic HTTPS.

### Step 1: Push to GitHub

Make sure your code is on GitHub.

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect Vite
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_HF_API_TOKEN` (optional)
7. Railway will automatically deploy and give you a URL

---

## Option 5: Render

Render is another good option with free tier.

### Step 1: Push to GitHub

Make sure your code is on GitHub.

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: Your app name
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_HF_API_TOKEN` (optional)
6. Click **"Create Static Site"**

---

## Environment Variables Setup

For all platforms, you need to set these environment variables:

### Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Optional:
- `VITE_HF_API_TOKEN` - Hugging Face API token for AI food recognition

**Important**: These are `VITE_` prefixed variables, which means they're exposed to the client-side code. This is safe for Supabase anon keys (they're meant to be public) but be careful with other sensitive data.

---

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test goal setup
- [ ] Test food entry creation
- [ ] Test image upload
- [ ] Test calendar navigation
- [ ] Verify CORS settings in Supabase
- [ ] Test on mobile device
- [ ] Check console for errors

---

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`
- Check build logs in your hosting platform

### Environment Variables Not Working

- Make sure variables are prefixed with `VITE_`
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

### CORS Errors

- Add your deployment URL to Supabase CORS settings
- Include both `https://` and `http://` if testing locally
- Add wildcard domains for preview deployments

### Routing Issues (404 on refresh)

- Ensure redirect rules are configured (Vercel/Netlify configs included)
- For GitHub Pages, make sure base path is set correctly

### Images Not Uploading

- Verify storage bucket exists in Supabase
- Check storage policies are set correctly
- Ensure bucket is public or policies allow access

---

## Recommended: Vercel

**Why Vercel?**
- ✅ Easiest setup
- ✅ Automatic deployments
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Great performance
- ✅ Free tier is generous

---

## Need Help?

If you encounter issues:
1. Check the build logs in your hosting platform
2. Test locally first: `npm run build && npm run preview`
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Ensure Supabase CORS settings include your domain

Happy deploying! 🚀
