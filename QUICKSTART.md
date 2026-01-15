# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account
2. Click "New Project"
3. Fill in your project details (name, database password, region)
4. Wait for the project to be created (takes ~2 minutes)

## Step 3: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 5: Set Up Storage Bucket (Optional but Recommended)

The SQL script should create the storage bucket automatically, but if it doesn't:

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name it: `food-images`
4. Make it **Public**
5. Click **Create bucket**

## Step 6: Create Environment File

1. Create a file named `.env` in the root directory
2. Add the following content:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 3.

## Step 7: (Optional) Set Up AI Food Recognition

For AI-powered food recognition:

1. Go to [https://huggingface.co](https://huggingface.co) and create a free account
2. Go to **Settings** → **Access Tokens**
3. Click **New token**
4. Name it (e.g., "calorie-tracker")
5. Select **Read** permission
6. Copy the token
7. Add it to your `.env` file:

```env
VITE_HF_API_TOKEN=your_token_here
```

**Note:** The app works without this token, but food recognition will use estimated values.

## Step 8: Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Step 9: Test the Application

1. Click **Sign Up** to create a new account
2. After registration, you'll be redirected to set up your goals
3. Fill in your information (weight, height, etc.)
4. Click **Save Goals**
5. You'll be taken to the dashboard
6. Click the **+** button to add your first meal
7. Try uploading a food photo!

## Troubleshooting

### "Cannot find module" errors
- Make sure you ran `npm install`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Database errors
- Make sure you ran the SQL schema script in Supabase
- Check that your `.env` file has the correct credentials
- Verify your Supabase project is active

### Image upload not working
- Make sure the `food-images` storage bucket exists in Supabase
- Check that the bucket is set to **Public**
- Verify storage policies are set correctly (should be done by the SQL script)

### AI recognition not working
- The app works without AI - it will use fallback values
- If you want AI, make sure you added the Hugging Face token to `.env`
- The free tier has rate limits, so it may occasionally fail

## Next Steps

- Customize the UI colors in `tailwind.config.js`
- Add more food recognition models
- Implement meal planning features
- Add social sharing capabilities

Enjoy tracking your calories! 🎉
