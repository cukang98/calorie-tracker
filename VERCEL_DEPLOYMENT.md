# Vercel Deployment Guide

## Automatic Deployments

Vercel **automatically redeploys** when you push changes to your connected branch (usually `main` or `master`).

### How It Works:
1. Push to GitHub: `git push origin main`
2. Vercel detects the push automatically
3. Build starts within seconds
4. New deployment is live in 1-2 minutes

**You don't need to do anything!** Just push and wait.

---

## Manual Redeployment

If automatic deployment didn't trigger, or you want to redeploy:

### Method 1: Redeploy from Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to the **"Deployments"** tab
4. Find the deployment you want to redeploy
5. Click the **"..."** (three dots) menu
6. Click **"Redeploy"**
7. Confirm the redeployment

### Method 2: Trigger via GitHub

1. Make a small change (like adding a space in README.md)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Trigger redeploy"
   git push origin main
   ```
3. Vercel will automatically detect and redeploy

### Method 3: Use Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

---

## Check Deployment Status

### In Vercel Dashboard:
1. Go to your project dashboard
2. Click **"Deployments"** tab
3. You'll see:
   - ✅ **Building** - Currently building
   - ✅ **Ready** - Successfully deployed
   - ❌ **Error** - Build failed (click to see logs)
   - ⏳ **Queued** - Waiting to build

### View Build Logs:
1. Click on any deployment
2. Click **"Build Logs"** tab
3. See detailed build output and any errors

---

## Common Issues & Solutions

### Build Not Triggering Automatically

**Check:**
1. Is your GitHub repo connected to Vercel?
   - Go to Project Settings → Git
   - Verify repository is connected

2. Did you push to the correct branch?
   - Check which branch is connected (usually `main`)
   - Push to that branch: `git push origin main`

3. Check Vercel webhook:
   - Project Settings → Git → GitHub
   - Verify webhook is installed

### Build Failing

**Check build logs:**
1. Go to Deployments tab
2. Click on failed deployment
3. Check "Build Logs" for errors

**Common fixes:**
- Environment variables missing? Add them in Project Settings → Environment Variables
- Build command wrong? Check Project Settings → General → Build Command
- Dependencies issue? Check `package.json` and `package-lock.json` are committed

### Environment Variables Not Updating

1. Go to Project Settings → Environment Variables
2. Update/add variables
3. **Important:** Redeploy after changing environment variables
   - Go to Deployments → Click "..." → "Redeploy"

---

## Deployment Best Practices

### 1. Check Build Locally First
```bash
npm run build
```
If this fails locally, it will fail on Vercel too.

### 2. Test Production Build
```bash
npm run build
npm run preview
```
Test the production build before pushing.

### 3. Use Preview Deployments
- Every pull request gets a preview URL
- Test before merging to main
- Share preview URLs with team

### 4. Monitor Deployments
- Check deployment status after pushing
- Review build logs if something fails
- Set up deployment notifications (optional)

---

## Quick Commands

```bash
# Check current branch
git branch

# Push changes (triggers auto-deploy)
git add .
git commit -m "Your commit message"
git push origin main

# Check deployment status (via CLI)
vercel ls

# View deployment logs (via CLI)
vercel logs [deployment-url]
```

---

## Need Help?

- **Build failing?** Check build logs in Vercel dashboard
- **Not deploying?** Verify GitHub connection in Project Settings
- **Environment variables?** Add them in Project Settings → Environment Variables
- **Still stuck?** Check Vercel documentation or support

---

**Remember:** Just push to GitHub and Vercel handles the rest! 🚀
