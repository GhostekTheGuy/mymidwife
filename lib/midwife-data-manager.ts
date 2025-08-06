// Shared data manager for midwife profiles
interface MidwifeProfile {
  id: string
  name: string
  title: string
  location: string
  fullAddress: string
  coordinates: { lat: number; lng: number }
  rating: number
  reviewCount: number
  experience: string
  verified: boolean
  premium: boolean
  phone: string
  email: string
  bio: string
  gallery: string[]
  services: Array<{
    id?: number
    name: string
    description: string
    price: string
    duration: string
    isOnline: boolean
  }>
  workingHours: Record<string, string>
}

interface MidwifeAvailability {
  id: string
  midwifeId: string
  date: string
  time: string
  isAvailable: boolean
  maxBookings: number
  currentBookings: number
}

class MidwifeDataManager {
  private profiles: Map<string, MidwifeProfile> = new Map()
  private availability: Map<string, MidwifeAvailability[]> = new Map()
  private subscribers: Map<string, ((profile: MidwifeProfile) => void)[]> = new Map()
  private availabilitySubscribers: Map<string, ((availability: MidwifeAvailability[]) => void)[]> = new Map()

  constructor() {
    // Initialize with default data
    this.initializeProfiles()
    this.initializeAvailability()
  }

  private initializeProfiles() {
    // Profile for Maria Nowak (ID: 2)
    this.profiles.set('2', {
      id: '2',
      name: 'Maria Nowak',
      title: 'Położna specjalistka',
      location: 'Kraków, Stare Miasto',
      fullAddress: 'ul. Floriańska 45, 31-019 Kraków',
      coordinates: { lat: 50.0647, lng: 19.945 },
      rating: 4.8,
      reviewCount: 89,
      experience: '12 lat',
      verified: true,
      premium: false,
      phone: '+48 987 654 321',
      email: 'maria.nowak@mymidwife.pl',
      bio: 'Specjalizuję się w porodach domowych i naturalnym rodzeniu. Moje podejście opiera się na szacunku dla naturalnych procesów i wspieraniu kobiet w ich wyborach. Posiadam 12-letnie doświadczenie w położnictwie i jestem certyfikowaną doula.',
      gallery: [
        '/images/pregnancy-support.png',
        '/images/midwife-consultation.png',
        '/images/prenatal-care.png',
        '/images/postpartum-care.png',
      ],
      services: [
        {
          id: 1,
          name: 'Porody domowe',
          description: 'Profesjonalne wsparcie podczas porodu w domowym zaciszu',
          price: '2800 zł',
          duration: 'pakiet',
          isOnline: false,
        },
        {
          id: 2,
          name: 'Opieka poporodowa',
          description: 'Wsparcie w pierwszych tygodniach po porodzie',
          price: '250 zł',
          duration: '90 min',
          isOnline: false,
        },
      ],
      workingHours: {
        Poniedziałek: '9:00 - 17:00',
        Wtorek: '10:00 - 18:00',
        Środa: 'Zamknięte',
        Czwartek: '9:00 - 15:00',
        Piątek: '9:00 - 17:00',
        Sobota: '10:00 - 14:00',
        Niedziela: 'Zamknięte',
      },
    })
  }

  private initializeAvailability() {
    // Initialize with some sample availability for Maria Nowak
    const today = new Date()
    const sampleAvailability: MidwifeAvailability[] = []
    
    // Generate sample availability for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      
      // Generate availability for weekdays only
      const dayOfWeek = date.getDay()
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
        const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        timeSlots.forEach(time => {
          sampleAvailability.push({
            id: `${dateString}-${time}`,
            midwifeId: '2',
            date: dateString,
            time,
            isAvailable: Math.random() > 0.2, // 80% chance of availability
            maxBookings: 1,
            currentBookings: 0
          })
        })
      }
    }
    
    this.availability.set('2', sampleAvailability)
  }

  getProfile(id: string): MidwifeProfile | undefined {
    return this.profiles.get(id)
  }

  updateProfile(id: string, updates: Partial<MidwifeProfile>): void {
    const currentProfile = this.profiles.get(id)
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates }
      this.profiles.set(id, updatedProfile)
      this.notifySubscribers(id, updatedProfile)
    }
  }

  // Availability management methods
  getAvailability(midwifeId: string): MidwifeAvailability[] {
    return this.availability.get(midwifeId) || []
  }

  getAvailabilityForDate(midwifeId: string, date: string): MidwifeAvailability[] {
    const allAvailability = this.getAvailability(midwifeId)
    return allAvailability.filter(slot => slot.date === date)
  }

  setAvailability(midwifeId: string, availabilitySlots: MidwifeAvailability[]): void {
    // Remove existing slots for the same dates and times
    const existingSlots = this.getAvailability(midwifeId)
    const slotsToKeep = existingSlots.filter(existingSlot => 
      !availabilitySlots.some(newSlot => 
        newSlot.date === existingSlot.date && newSlot.time === existingSlot.time
      )
    )
    
    // Add new slots
    const updatedSlots = [...slotsToKeep, ...availabilitySlots]
    this.availability.set(midwifeId, updatedSlots)
    this.notifyAvailabilitySubscribers(midwifeId, updatedSlots)
  }

  updateAvailabilitySlot(midwifeId: string, slotId: string, updates: Partial<MidwifeAvailability>): void {
    const currentSlots = this.getAvailability(midwifeId)
    const updatedSlots = currentSlots.map(slot => 
      slot.id === slotId ? { ...slot, ...updates } : slot
    )
    this.availability.set(midwifeId, updatedSlots)
    this.notifyAvailabilitySubscribers(midwifeId, updatedSlots)
  }

  deleteAvailabilitySlot(midwifeId: string, slotId: string): void {
    const currentSlots = this.getAvailability(midwifeId)
    const updatedSlots = currentSlots.filter(slot => slot.id !== slotId)
    this.availability.set(midwifeId, updatedSlots)
    this.notifyAvailabilitySubscribers(midwifeId, updatedSlots)
  }

  // Multi-day availability setting
  setMultiDayAvailability(
    midwifeId: string,
    startDate: string,
    endDate: string,
    selectedDays: number[],
    timeSlots: string[],
    isAvailable: boolean,
    maxBookings: number
  ): void {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const newSlots: MidwifeAvailability[] = []

    // Iterate through all days in the range
    const currentDate = new Date(start)
    while (currentDate <= end) {
      const dayOfWeek = (currentDate.getDay() + 6) % 7 // Convert to 0=Monday
      
      // Check if the day of week is selected
      if (selectedDays.includes(dayOfWeek)) {
        const dateString = currentDate.toISOString().split('T')[0]
        
        // Add all selected time slots for this day
        timeSlots.forEach(time => {
          const slotId = `${dateString}-${time}`
          newSlots.push({
            id: slotId,
            midwifeId,
            date: dateString,
            time: time,
            isAvailable: isAvailable,
            maxBookings: maxBookings,
            currentBookings: 0
          })
        })
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    this.setAvailability(midwifeId, newSlots)
  }

  subscribe(id: string, callback: (profile: MidwifeProfile) => void): () => void {
    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, [])
    }
    this.subscribers.get(id)!.push(callback)
    
    return () => {
      const callbacks = this.subscribers.get(id)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  subscribeToAvailability(midwifeId: string, callback: (availability: MidwifeAvailability[]) => void): () => void {
    if (!this.availabilitySubscribers.has(midwifeId)) {
      this.availabilitySubscribers.set(midwifeId, [])
    }
    this.availabilitySubscribers.get(midwifeId)!.push(callback)
    
    return () => {
      const callbacks = this.availabilitySubscribers.get(midwifeId)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private notifySubscribers(id: string, profile: MidwifeProfile): void {
    const callbacks = this.subscribers.get(id)
    if (callbacks) {
      callbacks.forEach(callback => callback(profile))
    }
  }

  private notifyAvailabilitySubscribers(midwifeId: string, availability: MidwifeAvailability[]): void {
    const callbacks = this.availabilitySubscribers.get(midwifeId)
    if (callbacks) {
      callbacks.forEach(callback => callback(availability))
    }
  }
}

export const midwifeDataManager = new MidwifeDataManager()
export type { MidwifeProfile, MidwifeAvailability }