export interface User {
  id: string
  email: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  current_weight: number
  height: number
  ideal_weight: number
  training_frequency: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  target_timeline_days: number
  daily_calorie_goal: number
  created_at: string
  updated_at: string
}

export interface FoodEntry {
  id: string
  user_id: string
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  food_name: string
  image_url?: string
  created_at: string
}

export interface DailyIntake {
  date: string
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
  entries: FoodEntry[]
}
