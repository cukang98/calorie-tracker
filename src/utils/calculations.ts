export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  return bmr * (multipliers[activityLevel] || 1.2)
}

export function calculateDailyCalorieGoal(
  currentWeight: number,
  idealWeight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: string,
  targetDays: number
): number {
  const weightDiff = idealWeight - currentWeight
  const weeklyWeightChange = weightDiff / (targetDays / 7)
  
  // Safe weight loss/gain: ~0.5-1 kg per week
  // 1 kg = ~7700 calories
  const weeklyCalorieAdjustment = weeklyWeightChange * 7700
  const dailyCalorieAdjustment = weeklyCalorieAdjustment / 7
  
  const bmr = calculateBMR(currentWeight, height, age, gender)
  const tdee = calculateTDEE(bmr, activityLevel)
  
  return Math.round(tdee + dailyCalorieAdjustment)
}
