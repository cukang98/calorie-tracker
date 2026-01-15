import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Target, Weight, Ruler, Activity, Calendar, TrendingDown } from 'lucide-react'
import { calculateDailyCalorieGoal } from '@/utils/calculations'
import { UserProfile } from '@/types'

export default function GoalSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    currentWeight: '',
    height: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    idealWeight: '',
    trainingFrequency: 'moderate' as UserProfile['training_frequency'],
    targetTimelineDays: '',
  })

  const [calculatedGoal, setCalculatedGoal] = useState<number | null>(null)

  useEffect(() => {
    checkExistingProfile()
  }, [user])

  useEffect(() => {
    if (
      formData.currentWeight &&
      formData.height &&
      formData.age &&
      formData.idealWeight &&
      formData.targetTimelineDays
    ) {
      const goal = calculateDailyCalorieGoal(
        parseFloat(formData.currentWeight),
        parseFloat(formData.idealWeight),
        parseFloat(formData.height),
        parseInt(formData.age),
        formData.gender,
        formData.trainingFrequency,
        parseInt(formData.targetTimelineDays)
      )
      setCalculatedGoal(goal)
    }
  }, [formData])

  const checkExistingProfile = async () => {
    if (!user) return

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      navigate('/dashboard')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !calculatedGoal) return

    setLoading(true)

    const profileData = {
      user_id: user.id,
      current_weight: parseFloat(formData.currentWeight),
      height: parseFloat(formData.height),
      ideal_weight: parseFloat(formData.idealWeight),
      training_frequency: formData.trainingFrequency,
      target_timeline_days: parseInt(formData.targetTimelineDays),
      daily_calorie_goal: calculatedGoal,
    }

    const { error } = await supabase.from('user_profiles').insert([profileData])

    if (error) {
      console.error('Error creating profile:', error)
      alert('Error saving profile. Please try again.')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block p-3 bg-primary-100 rounded-full mb-4"
            >
              <Target className="w-8 h-8 text-primary-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Your Goals</h1>
            <p className="text-gray-600">Let's calculate your daily calorie target</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="inline w-4 h-4 mr-1" />
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => setFormData({ ...formData, currentWeight: e.target.value })}
                  className="input-field"
                  placeholder="70"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="inline w-4 h-4 mr-1" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="input-field"
                  placeholder="175"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="input-field"
                  placeholder="30"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="input-field"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingDown className="inline w-4 h-4 mr-1" />
                  Ideal Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.idealWeight}
                  onChange={(e) => setFormData({ ...formData, idealWeight: e.target.value })}
                  className="input-field"
                  placeholder="65"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Target Timeline (days)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.targetTimelineDays}
                  onChange={(e) => setFormData({ ...formData, targetTimelineDays: e.target.value })}
                  className="input-field"
                  placeholder="90"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="inline w-4 h-4 mr-1" />
                Training Frequency
              </label>
              <select
                value={formData.trainingFrequency}
                onChange={(e) => setFormData({ ...formData, trainingFrequency: e.target.value as UserProfile['training_frequency'] })}
                className="input-field"
                required
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
            </div>

            {calculatedGoal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-primary-50 border-2 border-primary-200 rounded-lg"
              >
                <p className="text-sm text-gray-600 mb-1">Your Daily Calorie Goal:</p>
                <p className="text-3xl font-bold text-primary-600">{calculatedGoal} calories</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !calculatedGoal}
              className="btn-primary w-full"
            >
              {loading ? 'Saving...' : 'Save Goals'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
