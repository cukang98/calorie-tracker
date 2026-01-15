// Using Hugging Face's free inference API for food recognition
// You can get a free API token at https://huggingface.co/settings/tokens
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/detr-resnet-50'
const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || ''

// Fallback nutrition data for common foods
const FOOD_DATABASE: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  'chicken breast': { calories: 231, protein: 43, carbs: 0, fat: 5 },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  'salmon': { calories: 206, protein: 22, carbs: 0, fat: 12 },
  'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  'egg': { calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  'bread': { calories: 79, protein: 3, carbs: 15, fat: 1 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
  'pizza': { calories: 266, protein: 11, carbs: 33, fat: 10 },
}

export async function analyzeFoodImage(imageFile: File): Promise<{
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
}> {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile)
    
    // Try to use Hugging Face API if token is available
    if (HF_API_TOKEN) {
      try {
        const response = await fetch(HF_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: base64Image }),
        })
        
        if (response.ok) {
          const data = await response.json()
          // Process the response to extract food items
          // This is a simplified version - in production, you'd use a food-specific model
          const detectedFood = extractFoodFromDetection(data)
          if (detectedFood) {
            return getNutritionData(detectedFood)
          }
        }
      } catch (error) {
        console.warn('HF API error, using fallback:', error)
      }
    }
    
    // Fallback: Use a simple image analysis or return default values
    // In a real app, you might use a different free API or ML model
    return {
      foodName: 'Detected Food',
      calories: 250,
      protein: 15,
      carbs: 30,
      fat: 8,
    }
  } catch (error) {
    console.error('Error analyzing food image:', error)
    throw error
  }
}

function extractFoodFromDetection(data: any): string | null {
    console.log(data);
  // Simplified extraction - in production, use a food recognition model
  // For now, return a placeholder
  return 'Detected Food'
}

function getNutritionData(foodName: string): {
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
} {
  const normalizedName = foodName.toLowerCase()
  
  // Try to find exact match
  for (const [key, value] of Object.entries(FOOD_DATABASE)) {
    if (normalizedName.includes(key)) {
      return { foodName: key, ...value }
    }
  }
  
  // Return average values if not found
  return {
    foodName,
    calories: 250,
    protein: 15,
    carbs: 30,
    fat: 8,
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = (error) => reject(error)
  })
}
