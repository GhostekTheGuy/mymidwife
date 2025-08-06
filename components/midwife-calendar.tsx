"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  MapPin,
  Video,
  CalendarRange
} from "lucide-react"
import { generateTimeSlots, formatDate, isToday, isPastDate } from "@/lib/date-utils"
import { midwifeDataManager, type MidwifeAvailability } from "@/lib/midwife-data-manager"
import { useIsMobile } from "@/hooks/use-mobile"

const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

const DAYS_OF_WEEK = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nie"]

// Definicja typów usług i ich czasów trwania (w slotach po 30 min)
const serviceTypes: Record<string, { duration: number; description: string }> = {
  "Kontrola prenatalna": { duration: 2, description: "60 min" },
  "Kontrola przedporodowa": { duration: 2, description: "60 min" },
  "Badanie CTG": { duration: 1, description: "30 min" },
  "Ostatnia wizyta przedporodowa": { duration: 3, description: "90 min" },
  "USG dopplerowskie": { duration: 2, description: "60 min" },
  "USG morfologiczne": { duration: 3, description: "90 min" },
  "Pierwsza wizyta prenatalna": { duration: 3, description: "90 min" },
  "Badanie kompletne": { duration: 3, description: "90 min" },
  "Wizyta anulowana": { duration: 1, description: "30 min" },
}

// Funkcja do parsowania godziny
const parseTime = (timeStr: string) => {
  if (!timeStr || !timeStr.includes(':')) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

// Funkcja do obliczania końcowego czasu wizyty
const getEndTime = (startTime: string, appointmentType: string) => {
  const duration = serviceTypes[appointmentType]?.duration || 1
  const startMinutes = parseTime(startTime)
  const endMinutes = startMinutes + (duration * 30)
  const hours = Math.floor(endMinutes / 60)
  const minutes = endMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Funkcja do sprawdzania czy slot czasowy jest zajęty
const isTimeSlotOccupied = (appointments: Appointment[], date: string, time: string, duration: number = 1) => {
  const timeInMinutes = parseTime(time)
  return appointments.some(apt => {
    if (apt.date !== date || apt.status === 'cancelled') return false
    const aptStart = parseTime(apt.time)
    const aptDuration = serviceTypes[apt.type]?.duration || 1
    const aptEnd = aptStart + (aptDuration * 30)
    return (timeInMinutes < aptEnd && (timeInMinutes + duration * 30) > aptStart)
  })
}

interface Appointment {
  id: number
  patient: string
  date: string
  time: string
  type: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  week?: string
  phone?: string
  email?: string
  isOnline?: boolean
  location?: string
}

interface AvailabilitySlot {
  id: string
  date: string
  time: string
  isAvailable: boolean
  maxBookings?: number
  currentBookings?: number
}

interface MidwifeCalendarProps {
  appointments: Appointment[]
  midwifeId?: string
  onAppointmentAction?: (appointmentId: number, action: 'confirm' | 'cancel' | 'reschedule') => void
  onAvailabilityChange?: (date: string, time: string, isAvailable: boolean) => void
}

export function MidwifeCalendar({ 
  appointments, 
  midwifeId = '2', // Default to Maria Nowak for demo
  onAppointmentAction,
}: MidwifeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false)
  const [showAppointmentsDialog, setShowAppointmentsDialog] = useState(false)
  const [showMultiDayDialog, setShowMultiDayDialog] = useState(false)
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [midwifeAvailability, setMidwifeAvailability] = useState<MidwifeAvailability[]>([])
  const isMobile = useIsMobile()
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week')

  useEffect(() => {
    if (isMobile) {
      setViewMode('week');
    } else {
      setViewMode('month');
    }
  }, [isMobile]);

  // Load availability from data manager
  useEffect(() => {
    const loadAvailability = () => {
      const availability = midwifeDataManager.getAvailability(midwifeId)
      setMidwifeAvailability(availability)
    }
    
    loadAvailability()
    
    const unsubscribe = midwifeDataManager.subscribeToAvailability(midwifeId, (availability) => {
      setMidwifeAvailability(availability)
    })
    
    return unsubscribe
  }, [midwifeId])

  // React to appointments changes
  useEffect(() => {
    if (selectedDate) {
      setAvailabilitySlots(generateAvailabilityForDate(selectedDate))
    }
  }, [appointments, selectedDate])

  const getAvailabilityForDate = (date: string) => {
    return midwifeAvailability.filter(slot => slot.date === date)
  }

  const convertToAvailabilitySlot = (midwifeSlot: MidwifeAvailability): AvailabilitySlot => ({
    id: midwifeSlot.id,
    date: midwifeSlot.date,
    time: midwifeSlot.time,
    isAvailable: midwifeSlot.isAvailable,
    maxBookings: midwifeSlot.maxBookings,
    currentBookings: midwifeSlot.currentBookings
  })

  const generateAvailabilityForDate = (date: string) => {
    const existingSlots = getAvailabilityForDate(date)
    if (existingSlots.length > 0) {
      return existingSlots.map(convertToAvailabilitySlot)
    }
    
    const slots = generateTimeSlots(9, 17, 30)
    return slots.map(time => {
      const isOccupied = isTimeSlotOccupied(appointments, date, time, 1)
      return {
        id: `${date}-${time}`,
        date,
        time,
        isAvailable: !isOccupied,
        maxBookings: 1,
        currentBookings: isOccupied ? 1 : 0
      }
    })
  }
  
  const getDaysInWeek = (date: Date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek)
      weekDay.setDate(startOfWeek.getDate() + i)
      days.push(weekDay)
    }
    return days
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Monday start

    const days: (Date | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1))
      return newDate
    })
  }
  
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + (direction === "prev" ? -7 : 7))
      return newDate
    })
  }

  const getDateString = (date: Date) => date.toISOString().split("T")[0]
  const getAppointmentsForDate = (date: Date) => {
    const dateString = getDateString(date)
    return appointments.filter(apt => apt.date === dateString)
  }

  const handleDateClick = (date: Date) => {
    if (isPastDate(date) && !isToday(date)) return
    
    const dateString = getDateString(date)
    setSelectedDate(dateString)
    setAvailabilitySlots(generateAvailabilityForDate(dateString))
    setShowAppointmentsDialog(true)
  }

  const handleAddAvailability = () => {
    if (!selectedDate) return
    setEditingSlot(null)
    setShowAvailabilityDialog(true)
  }

  const handleEditAvailability = (slot: AvailabilitySlot) => {
    setEditingSlot(slot)
    setShowAvailabilityDialog(true)
  }

  const handleSaveAvailability = (slotData: Partial<AvailabilitySlot>) => {
    if (!selectedDate) return

    const slotId = `${selectedDate}-${slotData.time}`
    
    if (editingSlot) {
      midwifeDataManager.updateAvailabilitySlot(midwifeId, slotId, {
        isAvailable: slotData.isAvailable ?? editingSlot.isAvailable,
        maxBookings: slotData.maxBookings ?? editingSlot.maxBookings
      })
    } else {
      const newSlot: MidwifeAvailability = {
        id: slotId,
        midwifeId,
        date: selectedDate,
        time: slotData.time!,
        isAvailable: slotData.isAvailable ?? true,
        maxBookings: slotData.maxBookings ?? 1,
        currentBookings: 0
      }
      midwifeDataManager.setAvailability(midwifeId, [newSlot])
    }
    setShowAvailabilityDialog(false)
    setEditingSlot(null)
  }

  const handleDeleteAvailability = (slotId: string) => {
    midwifeDataManager.deleteAvailabilitySlot(midwifeId, slotId)
  }

  const handleOpenMultiDayDialog = () => {
    setShowMultiDayDialog(true)
  }

  const handleSaveMultiDayAvailability = (
    startDate: string, endDate: string, selectedDays: number[], 
    timeSlots: string[], isAvailable: boolean, maxBookings: number
  ) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return
    
    midwifeDataManager.setMultiDayAvailability(
      midwifeId, startDate, endDate, selectedDays, 
      timeSlots, isAvailable, maxBookings
    )
    setShowMultiDayDialog(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-green-400'
      case 'pending': return 'border-yellow-400'
      case 'completed': return 'border-blue-400'
      case 'cancelled': return 'border-red-400'
      default: return 'border-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) return <div key={index} className="p-1 sm:p-2 h-10 sm:h-20" />
            
            const appointments = getAppointmentsForDate(date)
            const hasAppts = appointments.length > 0
            const isPast = isPastDate(date) && !isToday(date)
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const isTodayDate = isToday(date)

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isPast}
                className={`p-1 sm:p-2 h-12 sm:h-20 flex flex-col items-center justify-center border rounded-lg transition-all duration-200 text-center ${
                  isPast ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-pink-50 hover:border-pink-300"
                } ${isTodayDate && isCurrentMonth ? "bg-pink-100 border-pink-300" : "border-gray-200"} ${
                  !isCurrentMonth ? "opacity-40" : ""
                }`}
              >
                <div className={`text-xs sm:text-sm font-medium ${isTodayDate && isCurrentMonth ? "text-pink-600" : "text-gray-900"}`}>
                  {date.getDate()}
                </div>
                {hasAppts && isCurrentMonth && !isPast && (
                  <div className="text-[10px] sm:text-xs text-blue-600 mt-1 truncate px-1">
                    {appointments.length}{isMobile ? '' : (appointments.length > 1 ? ' wizyt' : ' wizyta')}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </>
    )
  }
  
  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate)
    return (
      <div className="space-y-4">
        {days.map((date) => {
          const appointmentsOnDay = getAppointmentsForDate(date).sort((a, b) => parseTime(a.time) - parseTime(b.time));
          const isPast = isPastDate(date) && !isToday(date)
          const isTodayDate = isToday(date)
          
          return (
            <div key={date.toISOString()} className={`p-3 rounded-lg border ${isTodayDate ? 'bg-pink-50 border-pink-200' : 'bg-white'}`}>
              <h3 
                onClick={() => handleDateClick(date)}
                className={`font-semibold mb-2 flex items-center justify-between ${isPast ? 'text-gray-400' : 'cursor-pointer'}`}
              >
                <span>{formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                {!isPast && <Plus className="w-4 h-4 text-gray-500" />}
              </h3>
              {appointmentsOnDay.length > 0 ? (
                <div className="space-y-2">
                  {appointmentsOnDay.map(apt => (
                     <div key={apt.id} className={`p-2 border-l-4 rounded-r-md ${getStatusBorderColor(apt.status)} ${getStatusColor(apt.status)}`}>
                       <div className="flex items-center justify-between text-xs sm:text-sm">
                         <div className="font-medium">{apt.time} - {getEndTime(apt.time, apt.type)}</div>
                         <div>{serviceTypes[apt.type]?.description || '30 min'}</div>
                       </div>
                       <div className="text-sm font-medium mt-1">{apt.patient}</div>
                       <div className="text-xs text-gray-600">{apt.type}</div>
                     </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{isPast ? 'Dzień minął' : 'Brak wizyt'}</p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Kalendarz wizyt</h2>
          <p className="text-sm sm:text-base text-gray-600">Zarządzaj swoją dostępnością i harmonogramem</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            variant="outline"
            className="border-pink-500 text-pink-600 hover:bg-pink-50"
            onClick={handleOpenMultiDayDialog}
          >
            <CalendarRange className="w-4 h-4 mr-2" />
            Ustaw dostępność
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="w-5 h-5" />
              {viewMode === 'month' ? 
                `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}` :
                `Tydzień: ${formatDate(getDaysInWeek(currentDate)[0])} - ${formatDate(getDaysInWeek(currentDate)[6])}`
              }
            </CardTitle>
            <div className="flex items-center gap-2">
              {isMobile && (
                <Select value={viewMode} onValueChange={(val) => setViewMode(val as 'month' | 'week')}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Widok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Miesiąc</SelectItem>
                    <SelectItem value="week">Tydzień</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => viewMode === 'month' ? navigateMonth("prev") : navigateWeek('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => viewMode === 'month' ? navigateMonth("next") : navigateWeek('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {(isMobile ? (viewMode === 'week' ? renderWeekView() : renderMonthView()) : renderMonthView())}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div><span>Dziś</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div><span>Wizyty</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAppointmentsDialog} onOpenChange={setShowAppointmentsDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedDate && formatDate(new Date(selectedDate), { weekday: "long", day: "numeric", month: "long" })}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5" />
                  Wizyty ({selectedDate ? getAppointmentsForDate(new Date(selectedDate)).length : 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {selectedDate && getAppointmentsForDate(new Date(selectedDate)).length > 0 ? getAppointmentsForDate(new Date(selectedDate)).map((appointment) => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1.5">{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                        </Badge>
                        <div className="text-left sm:text-right text-xs">
                          <p className="font-semibold text-sm">{appointment.time} - {getEndTime(appointment.time, appointment.type)}</p>
                          <p className="text-gray-500">{serviceTypes[appointment.type]?.description || '30 min'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        {onAppointmentAction && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {appointment.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => onAppointmentAction(appointment.id, 'confirm')} className="bg-green-500 hover:bg-green-600 h-8">Potwierdź</Button>
                                <Button size="sm" variant="outline" onClick={() => onAppointmentAction(appointment.id, 'cancel')} className="h-8">Anuluj</Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" onClick={() => onAppointmentAction(appointment.id, 'reschedule')} className="h-8">Przełóż</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Brak wizyt w tym dniu</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-5 h-5" />
                    Dostępność
                  </CardTitle>
                  <Button size="sm" onClick={handleAddAvailability}>
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-2">
                  {availabilitySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between gap-2 p-2 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={slot.isAvailable ? "default" : "secondary"}>{slot.isAvailable ? "Dostępne" : "Niedostępne"}</Badge>
                        <div className="font-medium">{slot.time}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEditAvailability(slot)} className="h-8 w-8"><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteAvailability(slot.id)} className="h-8 w-8 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                  {availabilitySlots.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Brak ustawionej dostępności</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlot ? "Edytuj dostępność" : "Dodaj dostępność"}</DialogTitle>
          </DialogHeader>
          <AvailabilityForm slot={editingSlot} onSave={handleSaveAvailability} onCancel={() => setShowAvailabilityDialog(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMultiDayDialog} onOpenChange={setShowMultiDayDialog}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl">
          <DialogHeader><DialogTitle>Ustaw dostępność dla wielu dni</DialogTitle></DialogHeader>
          <MultiDayAvailabilityForm onSave={handleSaveMultiDayAvailability} onCancel={() => setShowMultiDayDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AvailabilityForm({ slot, onSave, onCancel }: { slot: AvailabilitySlot | null, onSave: (data: Partial<AvailabilitySlot>) => void, onCancel: () => void }) {
  const [time, setTime] = useState(slot?.time || "")
  const [isAvailable, setIsAvailable] = useState(slot?.isAvailable ?? true)
  const [maxBookings, setMaxBookings] = useState(slot?.maxBookings?.toString() || "1")
  const timeSlots = generateTimeSlots(9, 17, 30)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ time, isAvailable, maxBookings: parseInt(maxBookings) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="time">Godzina</Label>
        <Select value={time} onValueChange={setTime} required>
          <SelectTrigger><SelectValue placeholder="Wybierz godzinę" /></SelectTrigger>
          <SelectContent>{timeSlots.map((slot) => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="isAvailable">Status</Label>
        <Select value={isAvailable.toString()} onValueChange={(value) => setIsAvailable(value === "true")}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Dostępne</SelectItem>
            <SelectItem value="false">Niedostępne</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="maxBookings">Maks. rezerwacji</Label>
        <Input id="maxBookings" type="number" min="1" max="10" value={maxBookings} onChange={(e) => setMaxBookings(e.target.value)} />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Anuluj</Button>
        <Button type="submit" className="flex-1 bg-pink-500 hover:bg-pink-600">{slot ? "Zapisz" : "Dodaj"}</Button>
      </div>
    </form>
  )
}

function MultiDayAvailabilityForm({ onSave, onCancel }: { onSave: (startDate: string, endDate: string, selectedDays: number[], timeSlots: string[], isAvailable: boolean, maxBookings: number) => void, onCancel: () => void }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [isAvailable, setIsAvailable] = useState(true)
  const [maxBookings, setMaxBookings] = useState("1")
  const timeSlots = generateTimeSlots(9, 17, 30)
  const daysOfWeek = [{ value: 0, label: "Pon" }, { value: 1, label: "Wt" }, { value: 2, label: "Śr" }, { value: 3, label: "Czw" }, { value: 4, label: "Pt" }, { value: 5, label: "Sob" }, { value: 6, label: "Nie" }]

  const handleDayToggle = (day: number) => setSelectedDays(p => p.includes(day) ? p.filter(d => d !== day) : [...p, day].sort())
  const handleTimeSlotToggle = (time: string) => setSelectedTimeSlots(p => p.includes(time) ? p.filter(t => t !== time) : [...p, time].sort())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || selectedDays.length === 0 || selectedTimeSlots.length === 0) {
      alert("Proszę wypełnić wszystkie wymagane pola")
      return
    }
    onSave(startDate, endDate, selectedDays, selectedTimeSlots, isAvailable, parseInt(maxBookings))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label htmlFor="startDate">Data od</Label><Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
        <div><Label htmlFor="endDate">Data do</Label><Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
      </div>
      <div>
        <Label>Dni tygodnia</Label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-2">
          {daysOfWeek.map((day) => (
            <Button key={day.value} type="button" variant={selectedDays.includes(day.value) ? "default" : "outline"} onClick={() => handleDayToggle(day.value)}>{day.label}</Button>
          ))}
        </div>
      </div>
      <div>
        <Label>Godziny</Label>
        <div className="flex gap-2 my-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTimeSlots(timeSlots)}>Wszystkie</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedTimeSlots([])}>Wyczyść</Button>
        </div>
        <div className="grid grid-cols-4 gap-2 border rounded-md p-2 max-h-48 overflow-y-auto">
          {timeSlots.map((time) => (
            <div key={time} className="flex items-center gap-2"><Checkbox id={`time-${time}`} checked={selectedTimeSlots.includes(time)} onCheckedChange={() => handleTimeSlotToggle(time)} /><Label htmlFor={`time-${time}`} className="cursor-pointer">{time}</Label></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Status</Label>
            <Select value={isAvailable.toString()} onValueChange={(v) => setIsAvailable(v === "true")}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent><SelectItem value="true">Dostępne</SelectItem><SelectItem value="false">Niedostępne</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
              <Label>Maks. rezerwacji</Label>
              <Input type="number" min="1" value={maxBookings} onChange={e => setMaxBookings(e.target.value)} />
          </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
        <Button type="submit">Ustaw dostępność</Button>
      </div>
    </form>
  )
}
