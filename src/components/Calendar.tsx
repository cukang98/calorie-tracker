import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DailyIntake } from '@/types'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  dailyIntakes: Record<string, DailyIntake>
}

export default function Calendar({ selectedDate, onDateSelect, dailyIntakes }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDayIntake = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return dailyIntakes[dateKey]
  }

  const getDayStatus = (date: Date) => {
    const intake = getDayIntake(date)
    if (!intake) return 'empty'
    
    // This would need user's daily goal - simplified for now
    const goal = 2000 // Default goal
    const percentage = (intake.total_calories / goal) * 100
    
    if (percentage >= 100) return 'over'
    if (percentage >= 80) return 'good'
    return 'low'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => {
          const intake = getDayIntake(day)
          const status = getDayStatus(day)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <motion.button
              key={day.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateSelect(day)}
              className={`
                aspect-square p-2 rounded-lg transition-all
                ${isSelected ? 'bg-primary-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}
                ${isCurrentDay && !isSelected ? 'ring-2 ring-primary-400' : ''}
                ${status === 'over' ? 'border-2 border-red-400' : ''}
                ${status === 'good' ? 'border-2 border-green-400' : ''}
              `}
            >
              <div className="text-sm font-semibold">{format(day, 'd')}</div>
              {intake && (
                <div className="text-xs mt-1 opacity-75">
                  {intake.total_calories} cal
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
