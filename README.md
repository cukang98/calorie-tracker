# Calorie Tracker - Daily Nutrition Tracking App

A beautiful, responsive React application for tracking daily calories with AI-powered food recognition. Built with modern technologies and featuring smooth animations.

## Features

- 🔐 **Authentication** - Secure user registration and login using Supabase
- 📊 **Goal Setting** - Set personalized calorie goals based on weight, height, activity level, and target timeline
- 📅 **Calendar View** - Visual calendar to track daily intake across the month
- 🤖 **AI Food Recognition** - Upload or capture food photos for automatic nutrition analysis
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✨ **Smooth Animations** - Beautiful UI animations powered by Framer Motion
- 📈 **Progress Tracking** - Real-time tracking of calories consumed vs. daily goal
- 🍎 **Macro Tracking** - Track protein, carbs, and fat intake

## Tech Stack

- **React 18** - Modern React with TypeScript
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Supabase** - Backend (Auth + Database + Storage)
- **React Router** - Client-side routing
- **date-fns** - Date utility library
- **Lucide React** - Beautiful icon library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase (Free Database)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API and copy your:
   - Project URL
   - Anon/Public key

### 3. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  ideal_weight DECIMAL(5,2) NOT NULL,
  training_frequency TEXT NOT NULL CHECK (training_frequency IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  target_timeline_days INTEGER NOT NULL,
  daily_calorie_goal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create food_entries table
CREATE TABLE food_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  food_name TEXT NOT NULL,
  calories DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL,
  carbs DECIMAL(8,2) NOT NULL,
  fat DECIMAL(8,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for food images
INSERT INTO storage.buckets (id, name, public) VALUES ('food-images', 'food-images', true);

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Policies for food_entries
CREATE POLICY "Users can view own entries" ON food_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entries" ON food_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entries" ON food_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entries" ON food_entries FOR DELETE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Users can upload own images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_HF_API_TOKEN=your_huggingface_token (optional - for AI food recognition)
```

### 5. (Optional) Set Up AI Food Recognition

For AI-powered food recognition:

1. Go to [Hugging Face](https://huggingface.co) and create a free account
2. Go to Settings > Access Tokens and create a new token
3. Add the token to your `.env` file as `VITE_HF_API_TOKEN`

**Note:** The app will work without this token, but food recognition will use fallback values.

### 6. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Calendar.tsx     # Calendar view component
│   └── FoodEntryForm.tsx # Food entry form with image upload
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # External library configurations
│   └── supabase.ts      # Supabase client
├── pages/               # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── GoalSetup.tsx   # Goal setup page
│   ├── Login.tsx       # Login page
│   └── Register.tsx    # Registration page
├── services/            # Service functions
│   └── foodRecognition.ts # AI food recognition service
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared types
├── utils/               # Utility functions
│   └── calculations.ts  # Calorie calculation functions
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Set Goals**: Enter your current weight, height, ideal weight, and target timeline
3. **Track Meals**: Click the + button to add food entries
4. **Use AI**: Take a photo or upload an image of your food for automatic analysis
5. **Monitor Progress**: View your daily progress and remaining calories on the dashboard
6. **Calendar View**: Navigate through the calendar to see your intake history

## Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Deployment

This app can be deployed to various hosting platforms. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

### Quick Deploy Options:

1. **Vercel** (Recommended) - [vercel.com](https://vercel.com)
   - Free hosting with automatic deployments
   - Connect your GitHub repo and deploy in minutes
   - Configuration file included: `vercel.json`

2. **Netlify** - [netlify.com](https://netlify.com)
   - Free hosting with GitHub integration
   - Configuration file included: `netlify.toml`

3. **Railway** - [railway.app](https://railway.app)
   - Easy deployment with automatic HTTPS

4. **Render** - [render.com](https://render.com)
   - Free tier available for static sites

**Important**: After deploying, make sure to:
- Add environment variables in your hosting platform
- Update Supabase CORS settings to include your deployment URL
- Test all features after deployment

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
