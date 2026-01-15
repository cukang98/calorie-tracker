import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Plus, LogOut, Target, Flame, TrendingUp, TrendingDown } from 'lucide-react'
import Calendar from '@/components/Calendar'
import FoodEntryForm from '@/components/FoodEntryForm'
import { UserProfile, FoodEntry, DailyIntake } from '@/types'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showFoodForm, setShowFoodForm] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [dailyIntakes, setDailyIntakes] = useState<Record<string, DailyIntake>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadFoodEntries()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadFoodEntries()
    }
  }, [selectedDate, user])

  const loadUserProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading profile:', error)
    } else if (data) {
      setUserProfile(data)
    } else {
      // No profile found, redirect to goal setup
      window.location.href = '/goal-setup'
    }
    setLoading(false)
  }

  const loadFoodEntries = async () => {
    if (!user) return

    const startDate = format(selectedDate, 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', startDate)

    if (error) {
      console.error('Error loading food entries:', error)
      return
    }

    // Group entries by date
    const intakes: Record<string, DailyIntake> = {}
    
    if (data && data.length > 0) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const entries = data as FoodEntry[]
      intakes[dateKey] = {
        date: dateKey,
        total_calories: entries.reduce((sum, e) => sum + e.calories, 0),
        total_protein: entries.reduce((sum, e) => sum + e.protein, 0),
        total_carbs: entries.reduce((sum, e) => sum + e.carbs, 0),
        total_fat: entries.reduce((sum, e) => sum + e.fat, 0),
        entries,
      }
    }

    setDailyIntakes(intakes)
  }

  const handleSaveFoodEntry = async (foodData: {
    foodName: string
    calories: number
    protein: number
    carbs: number
    fat: number
    imageFile?: File
  }) => {
    if (!user) return

    let imageUrl = null
    if (foodData.imageFile) {
      // Upload image to Supabase storage
      const fileExt = foodData.imageFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, foodData.imageFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('food-images').getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }
    }

    const entry = {
      user_id: user.id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      food_name: foodData.foodName,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      image_url: imageUrl,
    }

    const { error } = await supabase.from('food_entries').insert([entry])

    if (error) {
      console.error('Error saving food entry:', error)
      alert('Error saving entry. Please try again.')
    } else {
      setShowFoodForm(false)
      loadFoodEntries()
    }
  }

  const todayIntake = dailyIntakes[format(selectedDate, 'yyyy-MM-dd')]
  const dailyGoal = userProfile?.daily_calorie_goal || 2000
  const remainingCalories = dailyGoal - (todayIntake?.total_calories || 0)
  const progressPercentage = Math.min(((todayIntake?.total_calories || 0) / dailyGoal) * 100, 100)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calorie Tracker</h1>
            <p className="text-gray-600">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Daily Goal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm text-gray-600">Daily Goal</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{dailyGoal}</p>
            <p className="text-sm text-gray-600 mt-1">calories</p>
          </motion.div>

          {/* Consumed Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Consumed</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {todayIntake?.total_calories || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">calories</p>
          </motion.div>

          {/* Remaining Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`card ${remainingCalories < 0 ? 'bg-red-50' : remainingCalories < 200 ? 'bg-yellow-50' : 'bg-green-50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${remainingCalories < 0 ? 'bg-red-100' : remainingCalories < 200 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                {remainingCalories < 0 ? (
                  <TrendingUp className={`w-6 h-6 ${remainingCalories < 0 ? 'text-red-600' : 'text-green-600'}`} />
                ) : (
                  <TrendingDown className="w-6 h-6 text-green-600" />
                )}
              </div>
              <span className="text-sm text-gray-600">Remaining</span>
            </div>
            <p className={`text-3xl font-bold ${remainingCalories < 0 ? 'text-red-600' : remainingCalories < 200 ? 'text-yellow-600' : 'text-green-600'}`}>
              {remainingCalories}
            </p>
            <p className="text-sm text-gray-600 mt-1">calories</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                progressPercentage >= 100
                  ? 'bg-red-500'
                  : progressPercentage >= 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              dailyIntakes={dailyIntakes}
            />
          </div>

          {/* Food Entries List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Today's Meals</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFoodForm(true)}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {todayIntake && todayIntake.entries.length > 0 ? (
              <div className="space-y-3">
                {todayIntake.entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{entry.food_name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.calories} cal • P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                        </p>
                      </div>
                      {entry.image_url && (
                        <img
                          src={entry.image_url}
                          alt={entry.food_name}
                          className="w-12 h-12 object-cover rounded-lg ml-2"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No meals logged yet</p>
                <p className="text-sm mt-2">Click the + button to add your first meal</p>
              </div>
            )}

            {/* Macros Summary */}
            {todayIntake && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Macros</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-semibold">{todayIntake.total_protein.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-semibold">{todayIntake.total_carbs.toFixed(1)}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-semibold">{todayIntake.total_fat.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFoodForm && (
        <FoodEntryForm
          onSave={handleSaveFoodEntry}
          onCancel={() => setShowFoodForm(false)}
        />
      )}
    </div>
  )
}
