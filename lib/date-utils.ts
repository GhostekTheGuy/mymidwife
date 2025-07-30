// Utility functions for date handling
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  }

  return date.toLocaleDateString("pl-PL", { ...defaultOptions, ...options })
}

export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) {
    return "Teraz"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min temu`
  } else if (diffInHours < 24) {
    return `${diffInHours} godz. temu`
  } else if (diffInDays === 1) {
    return "Wczoraj"
  } else if (diffInDays < 7) {
    return `${diffInDays} dni temu`
  } else {
    return formatDate(date)
  }
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7)
}

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = addDays(new Date(), 1)
  return date.toDateString() === tomorrow.toDateString()
}

export const isThisWeek = (date: Date): boolean => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1) // Monday
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  endOfWeek.setHours(23, 59, 59, 999)

  return date >= startOfWeek && date <= endOfWeek
}

export const getWeekday = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", { weekday: "long" })
}

export const getAvailabilityText = (date: Date): string => {
  if (isToday(date)) {
    return "Dostępna dziś"
  } else if (isTomorrow(date)) {
    return "Dostępna jutro"
  } else if (isThisWeek(date)) {
    return "Dostępna w tym tygodniu"
  } else {
    const diffInDays = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diffInDays <= 7) {
      return `Dostępna za ${diffInDays} dni`
    } else {
      return `Dostępna ${formatDate(date, { day: "numeric", month: "short" })}`
    }
  }
}

export const generateUpcomingDates = (count = 7): Date[] => {
  const dates: Date[] = []
  const today = new Date()

  for (let i = 0; i < count; i++) {
    dates.push(addDays(today, i))
  }

  return dates
}

export const generateTimeSlots = (startHour = 9, endHour = 17, intervalMinutes = 30): string[] => {
  const slots: string[] = []
  const start = new Date()
  start.setHours(startHour, 0, 0, 0)

  const end = new Date()
  end.setHours(endHour, 0, 0, 0)

  const current = new Date(start)

  while (current < end) {
    slots.push(formatTime(current))
    current.setMinutes(current.getMinutes() + intervalMinutes)
  }

  return slots
}

export const getWorkingHours = (date: Date): string => {
  const dayOfWeek = date.getDay()

  // Weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return "Zamknięte"
  }

  // Weekdays
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return "07:00 - 21:00"
  }

  return "09:00 - 17:00"
}

export const calculatePregnancyWeek = (lastPeriodDate: Date): number => {
  const now = new Date()
  const diffTime = now.getTime() - lastPeriodDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7)
}

export const calculateDueDate = (lastPeriodDate: Date): Date => {
  return addDays(lastPeriodDate, 280) // 40 weeks
}

export const formatDateInput = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

export const parseDateInput = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00")
}
