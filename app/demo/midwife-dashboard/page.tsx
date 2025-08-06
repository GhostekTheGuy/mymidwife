"use client"
import React, { useState, useRef, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, MessageCircle, Star, TrendingUp, ArrowLeft, Clock, MapPin, Settings, FileText, Plus, Edit, Camera, CheckCircle, XCircle, AlertCircle, User, Phone, Mail, CalendarDays, BookOpen, ImageIcon, Heart, Bell, Home, ChevronRight, Stethoscope, Baby, Scale, Thermometer, Calculator, Video, Award, Upload, Eye, Move, Trash2, Search, ArrowUp, ArrowDown } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NavigationBar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DemoBanner } from "@/components/demo-banner"
import { useIsMobile } from "@/hooks/use-mobile"
import { MessagesSystem } from "@/components/messages-system"
import { useAuth } from "@/hooks/use-auth"
import { EducationalContent } from "@/components/educational-content"
import { ArticleEditor } from "@/components/article-editor"
import { MidwifeProfile } from "@/components/midwife-profile"
import { midwifeDataManager } from "@/lib/midwife-data-manager"
import { dataManager } from "@/lib/data-manager"
import { CityAutocomplete } from "@/components/city-autocomplete"
import { MidwifeCalendar } from "@/components/midwife-calendar"
import { SlidersHorizontal } from 'lucide-react'

// Import date utilities at the top
import { formatDate, formatDateISO, formatRelativeTime, addDays } from "@/lib/date-utils"

function MidwifeDashboardContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "overview")
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showPatientList, setShowPatientList] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showEducationalMaterials, setShowEducationalMaterials] = useState(false)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    searchParams.get('conversationId')
  )
  const [customArticles, setCustomArticles] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  
  // Search and sort states for patients
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [patientSortOrder, setPatientSortOrder] = useState<"asc" | "desc">("asc")
  
  // Initialize profile data from data manager
  const initialProfile = midwifeDataManager.getProfile('2') || {
    name: "Maria Nowak",
    title: "Położna specjalistka", 
    phone: "+48 987 654 321",
    email: "maria.nowak@mymidwife.pl",
    location: "Kraków, Stare Miasto",
    fullAddress: "ul. Floriańska 45, 31-019 Kraków",
    bio: "Specjalizuję się w porodach domowych i naturalnym rodzeniu.",
    experience: "12 lat",
    verified: true,
    premium: false,
    rating: 4.8,
    reviewCount: 89,
    services: [],
    gallery: [
      {
        id: 'nurse-checklist',
        url: '/images/nurse-checklist.jpg',
        name: 'Pielęgniarka z listą kontrolną - świadomość zdrowotna',
        uploadDate: new Date().toISOString()
      }
    ],
    workingHours: {}
  }
  
  // Profile management states
  const [profileData, setProfileData] = useState({
    name: initialProfile.name,
    title: initialProfile.title,
    phone: initialProfile.phone,
    email: initialProfile.email,
    location: initialProfile.location,
    fullAddress: initialProfile.fullAddress,
    bio: initialProfile.bio,
    experience: initialProfile.experience,
    verified: initialProfile.verified,
    premium: initialProfile.premium,
    rating: initialProfile.rating,
    reviewCount: initialProfile.reviewCount
  })
  
  const [services, setServices] = useState(initialProfile.services || [])
  const [gallery, setGallery] = useState<any[]>(initialProfile.gallery || [])
  const [workingHours, setWorkingHours] = useState(initialProfile.workingHours || {})
  
  // Gallery states
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [editingImage, setEditingImage] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [editingService, setEditingService] = useState<any>(null)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeProfileTab, setActiveProfileTab] = useState("basic")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
  // Location management states
  const [city, setCity] = useState("Kraków")
  const [district, setDistrict] = useState("Stare Miasto")
  const [street, setStreet] = useState("ul. Floriańska 45")
  const [postalCode, setPostalCode] = useState("31-019")
  const [additionalInfo, setAdditionalInfo] = useState("")
  
  const isMobile = useIsMobile()
  const { user } = useAuth()

  // Pobierz imię użytkownika z systemu autoryzacji
  const userName = user?.firstName || "Maria"

  // Lista wszystkich wizyt położnej
  const [allAppointments, setAllAppointments] = useState([
    // Wizyty na dzisiaj
    {
      id: 1,
      patient: "Anna Kowalska",
      date: formatDateISO(new Date()),
      time: "09:00",
      type: "Kontrola prenatalna",
      status: "confirmed" as const,
      week: "20 tydzień",
      phone: "+48 123 456 789",
      email: "anna.kowalska@example.com",
    },
    {
      id: 2,
      patient: "Joanna Zielińska",
      date: formatDateISO(new Date()),
      time: "11:30",
      type: "Kontrola przedporodowa",
      status: "confirmed" as const,
      week: "36 tydzień",
      phone: "+48 567 890 123",
      email: "joanna.zielinska@example.com",
    },
    {
      id: 3,
      patient: "Maria Wiśniewska",
      date: formatDateISO(new Date()),
      time: "14:00",
      type: "Badanie CTG",
      status: "pending" as const,
      week: "32 tydzień",
      phone: "+48 234 567 890",
      email: "maria.wisniewski@example.com",
    },

    // Jutrzejsze wizyty
    {
      id: 4,
      patient: "Joanna Zielińska",
      date: formatDateISO(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      time: "10:00",
      type: "Ostatnia wizyta przedporodowa",
      status: "confirmed" as const,
      week: "36 tydzień",
      phone: "+48 567 890 123",
      email: "joanna.zielinska@example.com",
    },

    // Przyszłe wizyty
    {
      id: 5,
      patient: "Anna Kowalska",
      date: formatDateISO(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
      time: "10:00",
      type: "Kontrola prenatalna",
      status: "pending" as const,
      week: "20 tydzień",
      phone: "+48 123 456 789",
      email: "anna.kowalska@example.com",
    },
    {
      id: 6,
      patient: "Maria Wiśniewska",
      date: formatDateISO(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      time: "15:30",
      type: "USG dopplerowskie",
      status: "pending" as const,
      week: "32 tydzień",
      phone: "+48 234 567 890",
      email: "maria.wisniewski@example.com",
    },
    {
      id: 7,
      patient: "Katarzyna Nowak",
      date: formatDateISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      time: "12:00",
      type: "Kontrola prenatalna",
      status: "pending" as const,
      week: "28 tydzień",
      phone: "+48 345 678 901",
      email: "kasia.nowak@example.com",
    },
    {
      id: 8,
      patient: "Agnieszka Kowal",
      date: formatDateISO(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      time: "09:30",
      type: "USG morfologiczne",
      status: "pending" as const,
      week: "16 tydzień",
      phone: "+48 456 789 012",
      email: "aga.kowal@example.com",
    },

    // Przeszłe wizyty (dla historii)
    {
      id: 9,
      patient: "Anna Kowalska",
      date: formatDateISO(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
      time: "09:30",
      type: "Pierwsza wizyta prenatalna",
      status: "completed" as const,
      week: "18 tydzień",
      phone: "+48 123 456 789",
      email: "anna.kowalska@example.com",
    },
    {
      id: 10,
      patient: "Maria Wiśniewska",
      date: formatDateISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      time: "11:00",
      type: "Kontrola prenatalna",
      status: "completed" as const,
      week: "31 tydzień",
      phone: "+48 234 567 890",
      email: "maria.wisniewski@example.com",
    },
    {
      id: 11,
      patient: "Test Anulowana",
      date: formatDateISO(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
      time: "14:00",
      type: "Wizyta anulowana",
      status: "cancelled" as const,
      week: "25 tydzień",
      phone: "+48 999 999 999",
      email: "test@example.com",
    },
  ])

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
  const isTimeSlotOccupied = (date: string, time: string, duration: number) => {
    const timeInMinutes = parseTime(time)
    return allAppointments.some(apt => {
      if (apt.date !== date || apt.status === 'cancelled') return false
      const aptStart = parseTime(apt.time)
      const aptDuration = serviceTypes[apt.type]?.duration || 1
      const aptEnd = aptStart + (aptDuration * 30)
      
      // Sprawdź czy przedziały czasowe się nakładają
      return (timeInMinutes < aptEnd && (timeInMinutes + duration * 30) > aptStart)
    })
  }

  // Wizyty na dzisiaj (tylko 3 najwcześniejsze posortowane po godzinie)
  const todayAppointments = allAppointments
    .filter(apt => apt.date === formatDateISO(new Date()))
    .sort((a, b) => parseTime(a.time) - parseTime(b.time))
    .slice(0, 3)

  // Update recentMessages to use real relative times
  const recentMessages = [
    {
      id: 1,
      patient: "Anna K.",
      message: "Dzień dobry! Mam pytanie dotyczące badań prenatalnych",
      time: formatRelativeTime(new Date(Date.now() - 30 * 60 * 1000)),
      unread: true,
      avatar: "/images/midwife-consultation.png",
    },
    {
      id: 2,
      patient: "Anna K.",
      message: "Chodzi mi o USG morfologiczne. Kiedy najlepiej je wykonać?",
      time: formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)),
      unread: false,
      avatar: "/images/midwife-consultation.png",
    },
  ]

  // Lista pacjentek
  const patientsList = [
    {
      id: 1,
      name: "Anna Kowalska",
      email: "anna.kowalska@example.com",
      phone: "+48 123 456 789",
      lastVisit: formatDateISO(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
      nextVisit: formatDateISO(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
      pregnancyWeek: 20,
      status: "active",
      notes: "Pacjentka w 20 tygodniu ciąży, pierwsze ruchy płodu. Wszystko przebiega prawidłowo.",
      recommendations: "Kontynuować suplementację, USG morfologiczne za tydzień.",
      avatar: "/images/pregnancy-support.png",
    },
    {
      id: 2,
      name: "Maria Wiśniewska",
      email: "maria.wisniewski@example.com", 
      phone: "+48 234 567 890",
      lastVisit: formatDateISO(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      nextVisit: formatDateISO(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      pregnancyWeek: 32,
      status: "active",
      notes: "Pacjentka w 32 tygodniu ciąży, trzeci trymestr. Lekkie obrzęki kończyn dolnych.",
      recommendations: "Ograniczyć sól w diecie, więcej odpoczynku z uniesionymi nogami.",
      avatar: "/images/pregnancy-support.png",
    },
    {
      id: 3,
      name: "Katarzyna Nowak",
      email: "kasia.nowak@example.com",
      phone: "+48 345 678 901",
      lastVisit: formatDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)),
      nextVisit: formatDateISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      pregnancyWeek: 28,
      status: "active", 
      notes: "Pacjentka w 28 tygodniu ciąży, początek trzeciego trymestru. Zgaga i problemy ze snem.",
      recommendations: "Dieta łatwo strawna, spanie na lewym boku, dodatkowe poduszki.",
      avatar: "/images/pregnancy-support.png",
    },
    {
      id: 4,
      name: "Agnieszka Kowal",
      email: "aga.kowal@example.com",
      phone: "+48 456 789 012",
      lastVisit: formatDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
      nextVisit: formatDateISO(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
      pregnancyWeek: 16,
      status: "active",
      notes: "Pacjentka w 16 tygodniu ciąży, druga ciąża. Planowane USG prenatal.",
      recommendations: "Kontynuować suplementację, umówić badania genetyczne.",
      avatar: "/images/pregnancy-support.png",
    },
    {
      id: 5,
      name: "Joanna Zielińska",
      email: "joanna.zielinska@example.com",
      phone: "+48 567 890 123",
      lastVisit: formatDate(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)),
      nextVisit: formatDate(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)),
      pregnancyWeek: 36,
      status: "active",
      notes: "Pacjentka w 36 tygodniu ciąży, przygotowania do porodu. Dziecko w pozycji główkowej.",
      recommendations: "Ćwiczenia oddechowe, plan porodu, torba do szpitala.",
      avatar: "/images/pregnancy-support.png",
    },
  ]

  const monthlyStats = {
    totalPatients: patientsList.length,
    newPatients: 2,
    completedAppointments: allAppointments.filter(apt => apt.status === 'completed').length,
    rating: 4.9,
  }

  const handleAppointmentAction = (appointmentId: number, action: 'confirm' | 'cancel' | 'reschedule') => {
    console.log(`Appointment ${appointmentId}: ${action}`)
    
    // Znajdź wizytę w lokalnych danych
    const appointmentIndex = allAppointments.findIndex(apt => apt.id === appointmentId)
    if (appointmentIndex === -1) return

    const appointment = allAppointments[appointmentIndex]
    
    // Konwertuj lokalne dane do formatu data-manager
    const serviceDuration = serviceTypes[appointment.type]?.duration || 1
    const endTime = getEndTime(appointment.time, appointment.type)
    
    const appointmentForDataManager = {
      id: appointmentId.toString(),
      midwifeId: "2", // Maria Nowak ID
      midwifeName: "Maria Nowak",
      midwifeAvatar: "/images/pregnancy-support.png",
      date: appointment.date,
      time: appointment.time,
      endTime: endTime,
      type: appointment.type,
      duration: serviceDuration,
      location: "Gabinet położnej",
      isOnline: false,
      status: action === 'confirm' ? 'scheduled' as const : 
              action === 'cancel' ? 'cancelled' as const : 
              appointment.status as any,
      notes: `Pacjentka: ${appointment.patient}, ${appointment.week || ''}, Czas trwania: ${serviceTypes[appointment.type]?.description || '30 min'}`,
      patientName: appointment.patient,
      patientPhone: appointment.phone || '',
      patientEmail: appointment.email || '',
      pregnancyWeek: appointment.week || '',
    }

    // Aktualizuj w data-manager
    const existingAppointments = dataManager.getAppointments()
    const existingIndex = existingAppointments.findIndex(apt => apt.id === appointmentId.toString())
    
    if (existingIndex !== -1) {
      // Aktualizuj istniejącą wizytę
      dataManager.updateAppointment(appointmentId.toString(), {
        status: appointmentForDataManager.status
      })
    } else {
      // Dodaj nową wizytę do data-manager
      dataManager.addAppointment(appointmentForDataManager)
    }

    // Aktualizuj lokalne dane
    const updatedAppointments = [...allAppointments]
    switch (action) {
      case 'confirm':
        updatedAppointments[appointmentIndex] = {
          ...appointment,
          status: 'confirmed' as const
        }
        break
      case 'cancel':
        updatedAppointments[appointmentIndex] = {
          ...appointment,
          status: 'cancelled' as const
        }
        break
      case 'reschedule':
        // Logika przełożenia wizyty - na razie tylko oznacz jako pending
        console.log('Reschedule appointment functionality to be implemented')
        break
    }

    // Wymuszenie re-renderowania przez aktualizację state
    setAllAppointments(updatedAppointments)
  }

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient)
    setShowPatientDetails(true)
  }

  const getPatientAppointments = (patientName: string) => {
    return allAppointments.filter(apt => apt.patient === patientName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Funkcje do wyszukiwania i sortowania pacjentek
  const filteredAndSortedPatients = () => {
    // Filtruj pacjentki tylko te, które mają jakiekolwiek wizyty
    let filtered = patientsList.filter(patient => 
      allAppointments.some(appointment => appointment.patient === patient.name)
    )

    // Wyszukiwanie
    if (patientSearchTerm.trim()) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        patient.notes.toLowerCase().includes(patientSearchTerm.toLowerCase())
      )
    }

    // Sortowanie alfabetyczne
    filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      return patientSortOrder === "asc" 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })

    return filtered
  }

  const handlePatientSearch = (searchTerm: string) => {
    setPatientSearchTerm(searchTerm)
  }

  const handlePatientSort = (order: "asc" | "desc") => {
    setPatientSortOrder(order)
  }

  // Funkcje do zarządzania artykułami
  const handleSaveArticle = (articleData: any) => {
    const newArticle = {
      id: `custom-${Date.now()}`,
      ...articleData,
      publishDate: new Date().toISOString().split('T')[0],
    }
    setCustomArticles([...customArticles, newArticle])
  }

  const handleEditArticle = (article: any) => {
    const updatedArticles = customArticles.map(a => 
      a.id === article.id ? { ...a, ...article } : a
    )
    setCustomArticles(updatedArticles)
  }

  const handleDeleteArticle = (articleId: string) => {
    setCustomArticles(customArticles.filter(a => a.id !== articleId))
  }

  // Quick Stats dla położnej
  const quickStats = [
    {
      label: "Pacjentki",
      value: monthlyStats.totalPatients.toString(),
      change: `+${monthlyStats.newPatients} w tym miesiącu`,
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Wizyty w miesiącu",
      value: monthlyStats.completedAppointments.toString(),
      change: "Zakończone",
      trend: "stable" as const,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      label: "Ocena",
      value: `${monthlyStats.rating}/5.0`,
      change: "127 opinii",
      trend: "stable" as const,
      icon: Star,
      color: "text-yellow-600",
    },
    {
      label: "Nowe wiadomości",
      value: recentMessages.filter(m => m.unread).length.toString(),
      change: "Nieprzeczytane",
      trend: "up" as const,
      icon: MessageCircle,
      color: "text-pink-600",
    },
  ]

  const quickActions = [
    {
      label: "Zarządzaj kalendarzem",
      icon: Calendar,
      color: "bg-pink-500 hover:bg-pink-600",
      action: () => setActiveTab("calendar"),
    },
    {
      label: "Lista pacjentek",
      icon: Users,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => setActiveTab("patients"),
    },
    {
      label: "Wiadomości",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => setActiveTab("messages"),
    },
    {
      label: "Materiały",
      icon: BookOpen,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => setActiveTab("education"),
    },
  ]

  const navigationItems = [
    { id: "overview", label: "Przegląd", icon: Home },
    { id: "patients", label: "Pacjentki", icon: Users },
    { id: "calendar", label: "Kalendarz", icon: Calendar },
    { id: "messages", label: "Wiadomości", icon: MessageCircle, badge: recentMessages.filter(m => m.unread).length || undefined },
    { id: "education", label: "Materiały", icon: BookOpen },
    { id: "profile-management", label: "Zarządzanie stroną", icon: SlidersHorizontal },
  ]

  const sidebarItems = [
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Ustawienia", icon: Settings },
    { id: "notifications", label: "Powiadomienia", icon: Bell },
  ]

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Witaj, {userName}! 👋</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Jak dzisiaj wygląda Twój harmonogram?</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-pink-600 bg-white px-3 py-2 rounded-full">
            <Stethoscope className="w-4 h-4" />
            <span className="font-medium">Położna</span>
          </div>
        </div>
      </div>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="p-3 sm:p-4">
              <CardContent className="p-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center`}>
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.label}</p>
                    <p className="text-sm sm:text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-gray-500 truncate">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions - Mobile 2x2 Grid */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white h-16 sm:h-20 flex flex-col gap-1 sm:gap-2`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Dzisiejszy harmonogram</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab("calendar")}>
              <span className="hidden sm:inline">Zobacz kalendarz</span>
              <ChevronRight className="w-4 h-4 sm:ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto sm:mx-0">
                    <AvatarImage src="/images/midwife-consultation.png" />
                    <AvatarFallback>
                      {appointment.patient.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{appointment.patient}</h3>
                      <Badge 
                        variant={appointment.status === "confirmed" ? "default" : "secondary"}
                        className={
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {appointment.status === "confirmed" ? "Potwierdzona" : 
                         appointment.status === "cancelled" ? "Anulowana" :
                         appointment.status === "completed" ? "Zakończona" :
                         "Oczekuje"}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{appointment.time} - {getEndTime(appointment.time, appointment.type)}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{appointment.type}</span>
                        <span className="text-xs text-gray-500">({serviceTypes[appointment.type]?.description || '30 min'})</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Baby className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{appointment.week}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center sm:justify-end">
                    {appointment.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-3 bg-transparent"
                          onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Potwierdź</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-3 bg-transparent"
                          onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                        >
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Anuluj</span>
                        </Button>
                      </>
                    )}
                    <Button size="sm" className="bg-pink-500 hover:bg-pink-600 h-8 px-3">
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Wiadomość</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Ostatnia aktywność</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Nowa wiadomość od pacjentki Anny Kowalskiej</p>
                <p className="text-xs text-gray-600">30 minut temu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Potwierdzono wizytę kontrolną z Anną Kowalską</p>
                <p className="text-xs text-gray-600">2 godziny temu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Anna Kowalska dołączyła jako pacjentka</p>
                <p className="text-xs text-gray-600">1 dzień temu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPatients = () => {
    const patientsWithAppointments = filteredAndSortedPatients()

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Moje pacjentki</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {patientSearchTerm.trim() 
                ? `Znaleziono ${patientsWithAppointments.length} pacjentek` 
                : `Pacjentki z umówionymi wizytami (${patientsWithAppointments.length})`
              }
            </p>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Szukaj pacjentek po nazwisku, email lub notatkach..."
                value={patientSearchTerm}
                onChange={(e) => handlePatientSearch(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              {patientSearchTerm.trim() && (
                <button
                  onClick={() => handlePatientSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              variant={patientSortOrder === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePatientSort("asc")}
              className="flex items-center gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              A-Z
            </Button>
            <Button
              variant={patientSortOrder === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePatientSort("desc")}
              className="flex items-center gap-2"
            >
              <ArrowDown className="w-4 h-4" />
              Z-A
            </Button>
          </div>
        </div>

        {patientsWithAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak pacjentek</h3>
              <p className="text-gray-600">Pacjentki pojawią się tutaj po umówieniu wizyty</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {patientsWithAppointments.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mx-0">
                      <AvatarImage src="/images/pregnancy-support.png" />
                      <AvatarFallback>
                        {patient.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Baby className="w-4 h-4" />
                          <span>{patient.pregnancyWeek} tydzień ciąży</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Następna wizyta: {patient.nextVisit}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 sm:col-span-2">
                          <Mail className="w-4 h-4" />
                          <span>{patient.email}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 text-center sm:text-left">{patient.notes}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 sm:flex-none bg-transparent"
                        onClick={() => setActiveTab("messages")}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Napisz wiadomość
                      </Button>
                      <Button 
                        className="bg-pink-500 hover:bg-pink-600 flex-1 sm:flex-none"
                        onClick={() => handlePatientClick(patient)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Szczegóły
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderCalendar = () => (
    <div className="space-y-6">
      <MidwifeCalendar
        appointments={allAppointments}
        midwifeId="2"
        onAppointmentAction={handleAppointmentAction}
      />
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold">Wiadomości</h2>
        <p className="text-sm sm:text-base text-gray-600">Komunikacja z pacjentkami</p>
      </div>
      <div className="h-[calc(96vh-200px)] min-h-[360px]">
        <MessagesSystem preselectedConversationId={selectedConversationId} />
      </div>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6">
      {/* ArticleEditor dla położnej */}
      <ArticleEditor
        onSave={handleSaveArticle}
        onEdit={handleEditArticle}
        onDelete={handleDeleteArticle}
        existingArticles={customArticles}
      />
      
      {/* Separator */}
      <div className="border-t border-gray-200 my-8" />
      
      {/* Centrum edukacyjne */}
      <div>
              <EducationalContent customArticles={customArticles} />
      </div>
    </div>
  )

  // Profile management helper functions
  const handleSaveService = (serviceData: any) => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...serviceData, id: editingService.id } : s))
    } else {
      const maxId = services.length > 0 ? Math.max(...services.map(s => s.id || 0)) : 0
      const newService = { ...serviceData, id: maxId + 1 }
      setServices([...services, newService])
    }
    setShowServiceDialog(false)
    setEditingService(null)
  }

  const handleDeleteService = (serviceId: number) => {
    setServices(services.filter(s => (s.id || 0) !== serviceId))
  }

  const handleEditService = (service: any) => {
    setEditingService(service)
    setShowServiceDialog(true)
  }

  const handleProfileDataChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleWorkingHoursChange = (day: string, hours: string) => {
    setWorkingHours(prev => ({ ...prev, [day]: hours }))
  }

  const updateLocationData = () => {
    const location = `${city}, ${district}`
    const fullAddress = `${street}, ${postalCode} ${city}${additionalInfo ? `, ${additionalInfo}` : ''}`
    
    setProfileData(prev => ({
      ...prev,
      location,
      fullAddress
    }))
  }

  // Update location data whenever location fields change
  React.useEffect(() => {
    updateLocationData()
  }, [city, district, street, postalCode, additionalInfo])

  const handleAddGalleryImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        name: file.name,
        description: '',
        uploadedAt: new Date().toISOString()
      }))
      setGallery([...gallery, ...newImages])
    }
    // Reset input
    if (event.target) {
      event.target.value = ''
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index))
  }

  const handleImageClick = (image: any) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  const handleEditImage = (image: any) => {
    setEditingImage(image)
    setShowEditModal(true)
  }

  const handleSaveImageEdit = () => {
    if (editingImage) {
      setGallery(gallery.map(img => 
        img.id === editingImage.id ? editingImage : img
      ))
      setShowEditModal(false)
      setEditingImage(null)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (dragIndex !== dropIndex) {
      const newGallery = [...gallery]
      const [draggedItem] = newGallery.splice(dragIndex, 1)
      newGallery.splice(dropIndex, 0, draggedItem)
      setGallery(newGallery)
    }
  }

  const handleGalleryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file, index) => ({
        id: Date.now() + index,
        url: URL.createObjectURL(file),
        name: file.name,
        description: '',
        uploadedAt: new Date().toISOString()
      }))
      setGallery([...gallery, ...newImages])
    }
  }

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Function to sync profile data with midwife-profile.tsx mockMidwives
  const syncProfileData = async () => {
    setIsSaving(true)
    setIsSaved(false)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update the data manager with current profile data
    midwifeDataManager.updateProfile('2', {
      name: profileData.name,
      title: profileData.title,
      phone: profileData.phone,
      email: profileData.email,
      location: profileData.location,
      fullAddress: profileData.fullAddress,
      bio: profileData.bio,
      experience: profileData.experience,
      verified: profileData.verified,
      premium: profileData.premium,
      rating: profileData.rating,
      reviewCount: profileData.reviewCount,
      services,
      gallery,
      workingHours
    })
    
    // Also update the search results (this would be handled by backend in real app)
    console.log('Synchronizing with search results:', {
      location: profileData.location,
      fullAddress: profileData.fullAddress
    })
    
    setIsSaving(false)
    setIsSaved(true)
    
    console.log('Profile data synced successfully!')
    
    // Reset saved state after 3 seconds
    setTimeout(() => {
      setIsSaved(false)
    }, 3000)
  }

  const renderProfileManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Zarządzanie stroną</h2>
          <p className="text-gray-600">Edytuj swój profil, usługi i inne informacje widoczne dla pacjentek</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Podgląd profilu
          </Button>
          <Button 
            onClick={syncProfileData} 
            disabled={isSaving}
            className={`transition-all duration-300 ease-in-out ${
              isSaved 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Zapisywanie...
              </>
            ) : isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 animate-bounce" />
                Zapisano!
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Zapisz zmiany
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab} className="w-full">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger 
            value="basic" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Podstawowe
          </TabsTrigger>
          <TabsTrigger 
            value="bio"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Opis
          </TabsTrigger>
          <TabsTrigger 
            value="services"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Usługi
          </TabsTrigger>
          <TabsTrigger 
            value="gallery"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Zdjęcia
          </TabsTrigger>
          <TabsTrigger 
            value="hours"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Godziny
          </TabsTrigger>
          <TabsTrigger 
            value="location"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Lokalizacja
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
              <CardDescription>Twoje dane podstawowe widoczne w profilu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Imię i nazwisko</Label>
                  <Input 
                    id="name" 
                    value={profileData.name}
                    onChange={(e) => handleProfileDataChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Tytuł zawodowy</Label>
                  <Input 
                    id="title" 
                    value={profileData.title}
                    onChange={(e) => handleProfileDataChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input 
                    id="phone" 
                    value={profileData.phone}
                    onChange={(e) => handleProfileDataChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={profileData.email}
                    onChange={(e) => handleProfileDataChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Doświadczenie</Label>
                  <Input 
                    id="experience" 
                    value={profileData.experience}
                    onChange={(e) => handleProfileDataChange('experience', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lokalizacja</Label>
                  <Input 
                    id="location" 
                    value={profileData.location}
                    onChange={(e) => handleProfileDataChange('location', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Opis profilu</CardTitle>
              <CardDescription>Napisz o sobie i swoim doświadczeniu</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={profileData.bio}
                onChange={(e) => handleProfileDataChange('bio', e.target.value)}
                rows={8}
                placeholder="Opowiedz o swoim doświadczeniu, specjalizacji i podejściu do pracy..."
              />
              <p className="text-sm text-gray-500 mt-2">
                {profileData.bio.length}/1000 znaków
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usługi</CardTitle>
                <CardDescription>Zarządzaj swoją ofertą usług</CardDescription>
              </div>
              <Button onClick={() => setShowServiceDialog(true)} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Dodaj usługę
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="font-medium text-pink-600">{service.price}</span>
                        <span className="text-gray-500">{service.duration}</span>
                        {service.isOnline && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">Online</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditService(service)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteService(service.id || 0)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Galeria zdjęć</CardTitle>
                <CardDescription>Dodaj zdjęcia swojego gabinetu i wyposażenia</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddGalleryImage} className="bg-pink-500 hover:bg-pink-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Dodaj zdjęcie
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </CardHeader>
            <CardContent>
              {gallery.length === 0 ? (
                <div 
                  className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 transition-colors"
                  onDrop={handleGalleryDrop}
                  onDragOver={handleGalleryDragOver}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Brak zdjęć w galerii</h3>
                  <p className="text-gray-600 mb-4">Przeciągnij i upuść zdjęcia tutaj lub kliknij przycisk poniżej</p>
                  <Button onClick={handleAddGalleryImage} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Dodaj pierwsze zdjęcie
                  </Button>
                </div>
              ) : (
                <div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  onDrop={handleGalleryDrop}
                  onDragOver={handleGalleryDragOver}
                >
                  {gallery.map((image, index) => (
                    <div 
                      key={image.id || index} 
                      className="relative group cursor-pointer"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => handleImageClick(image)}
                    >
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        {typeof image === 'string' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        ) : (
                          <img 
                            src={image.url || "/placeholder.svg"} 
                            alt={image.name || 'Zdjęcie gabinetu'}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageClick(image)
                            }}
                            className="bg-white/90 hover:bg-white"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditImage(image)
                            }}
                            className="bg-white/90 hover:bg-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveGalleryImage(index)
                            }}
                            className="bg-red-500/90 hover:bg-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Drag handle */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 text-white p-1 rounded">
                          <Move className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Image info */}
                      {typeof image !== 'string' && image.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs truncate">{image.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Godziny pracy</CardTitle>
              <CardDescription>Ustaw swoje godziny dostępności</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="w-24">
                      <Label>{day}</Label>
                    </div>
                    <div className="flex-1 max-w-xs">
                      <Input 
                        value={String(hours)}
                        onChange={(e) => handleWorkingHoursChange(day, e.target.value)}
                        placeholder="np. 9:00 - 17:00 lub Zamknięte"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lokalizacja gabinetu</CardTitle>
              <CardDescription>Precyzyjne informacje o lokalizacji Twojego gabinetu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Miasto</Label>
                  <CityAutocomplete
                    value={city}
                    onChange={setCity}
                    placeholder="Wybierz miasto..."
                    className="h-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Główne miasto, w którym znajduje się gabinet</p>
                </div>
                <div>
                  <Label htmlFor="district">Dzielnica / Okolica</Label>
                  <Input 
                    id="district" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="np. Stare Miasto, Mokotów..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Dzielnica lub nazwa okolicy</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="street">Ulica i numer</Label>
                <Input 
                  id="street" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="np. ul. Floriańska 45"
                />
                <p className="text-xs text-gray-500 mt-1">Dokładny adres ulicy i numer budynku/lokalu</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Kod pocztowy</Label>
                  <Input 
                    id="postalCode" 
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="00-000"
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalInfo">Dodatkowe informacje</Label>
                  <Input 
                    id="additionalInfo" 
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="np. wejście od podwórza, II piętro..."
                  />
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">Podgląd adresu:</Label>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Lokalizacja w wyszukiwarce:</span> {city}, {district}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Pełny adres:</span> {street}, {postalCode} {city}
                    {additionalInfo && <span className="text-gray-600"> ({additionalInfo})</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for service editing */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edytuj usługę' : 'Dodaj nową usługę'}</DialogTitle>
          </DialogHeader>
          <ServiceEditForm 
            service={editingService}
            onSave={handleSaveService}
            onCancel={() => {
              setShowServiceDialog(false)
              setEditingService(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Profile preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Podgląd profilu</DialogTitle>
            <DialogDescription>
              Tak widzą Twój profil pacjentki w wyszukiwarce
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-0">
            <MidwifeProfile midwifeId="2" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview()
      case "patients":
        return renderPatients()
      case "calendar":
        return renderCalendar()
      case "messages":
        return renderMessages()
      case "education":
        return renderEducation()
      case "profile-management":
        return renderProfileManagement()
      default:
        return renderOverview()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 pt-16">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DemoBanner />
          </div>
          
          {/* Main Container with Grid System */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex">
              {/* Desktop Sidebar */}
              <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:top-16 lg:bottom-0 lg:left-0 xl:left-auto xl:static xl:top-auto xl:bottom-auto z-30">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto xl:rounded-lg xl:shadow-sm xl:border xl:mt-6">
                  <div className="flex items-center flex-shrink-0 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-gray-900">MyMidwife</span>
                    </div>
                  </div>

                  <div className="mt-8 flex-grow flex flex-col">
                    <nav className="flex-1 px-2 space-y-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                              activeTab === item.id
                                ? "bg-pink-100 text-pink-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.label}
                            {item.badge && item.badge > 0 && (
                              <Badge className="ml-auto bg-pink-500 text-white">{item.badge}</Badge>
                            )}
                          </button>
                        )
                      })}
                    </nav>

                    <div className="px-2 space-y-1">
                      {sidebarItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                          <button
                            key={item.id}
                            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
                          >
                            <IconComponent className="mr-3 h-5 w-5 flex-shrink-0" />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 xl:ml-6">
                <main className="pb-20 lg:pb-8 pt-6">
                  {renderContent()}
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40">
        <div className="grid grid-cols-6 gap-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative ${
                  isActive ? "bg-pink-50 text-pink-600" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title={item.label}
              >
                <div className="relative">
                  <IconComponent className="w-6 h-6" />
                  {item.badge && item.badge > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {!isMobile && <Footer />}

      {/* Dialog do edycji profilu */}
      <Dialog open={showProfileEdit} onOpenChange={setShowProfileEdit}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edytuj profil</DialogTitle>
            <DialogDescription>
              Zaktualizuj swoje dane, usługi i zdjęcia
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Imię i nazwisko</Label>
                <Input id="name" defaultValue={`${user?.firstName || "Anna"} ${user?.lastName || "Kowalska"}`} />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" defaultValue={user?.profile?.phone || "+48 123 456 789"} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || "anna.kowalska@mymidwife.pl"} />
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Input id="address" defaultValue={user?.profile?.workLocation ? `${user.profile.workLocation}, ul. Przykładowa 1` : "Warszawa, ul. Marszałkowska 1"} />
              </div>
            </div>
            
            <div>
              <Label>Opis</Label>
              <Textarea 
                defaultValue="Specjalizuję się w porodach domowych i naturalnym rodzeniu. Moje podejście opiera się na szacunku dla naturalnych procesów i wspieraniu kobiet w ich wyborach."
                rows={4}
              />
            </div>

            <div>
              <Label>Usługi</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Opieka prenatalna", "Porody domowe", "Opieka poporodowa", "Edukacja przedporodowa ( szkoła rodzenia )"].map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <input type="checkbox" id={service} defaultChecked />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Zdjęcia</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400" />
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProfileEdit(false)}>
                Anuluj
              </Button>
              <Button onClick={() => setShowProfileEdit(false)}>
                Zapisz zmiany
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog szczegółów pacjentki */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={selectedPatient?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {selectedPatient?.name.split(" ").map((n: string) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl font-bold">{selectedPatient?.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPatient?.pregnancyWeek} tydzień ciąży
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              {/* Informacje o pacjentce */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informacje o pacjentce
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Baby className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedPatient.pregnancyWeek} tydzień ciąży</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Następna wizyta: {selectedPatient.nextVisit}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="font-medium">Notatki:</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedPatient.notes}</p>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="font-medium">Zalecenia:</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedPatient.recommendations}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Historia wizyt */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Historia wizyt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPatientAppointments(selectedPatient.name).map((appointment) => (
                      <div key={appointment.id} className="border-l-4 border-pink-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {appointment.status === 'completed' ? 'Ukończona' :
                               appointment.status === 'confirmed' ? 'Potwierdzona' :
                               appointment.status === 'pending' ? 'Oczekująca' : 'Zaplanowana'}
                            </Badge>
                            <span className="text-sm text-gray-500">{appointment.week}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.date} • {appointment.time}
                          </div>
                        </div>
                        <div className="font-medium">{appointment.type}</div>
                      </div>
                    ))}
                  </div>

                  {getPatientAppointments(selectedPatient.name).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Brak wizyt w historii</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Akcje */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPatientDetails(false)}>
                  Zamknij
                </Button>
                <Button 
                  className="bg-pink-500 hover:bg-pink-600"
                  onClick={() => {
                    setShowPatientDetails(false)
                    setActiveTab("messages")
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Napisz wiadomość
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Podgląd zdjęcia</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                {typeof selectedImage === 'string' ? (
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <img 
                    src={selectedImage.url || "/placeholder.svg"} 
                    alt={selectedImage.name || 'Zdjęcie gabinetu'}
                    className="w-full h-auto rounded-lg"
                  />
                )}
              </div>
              
              {typeof selectedImage !== 'string' && (
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium">Nazwa pliku:</Label>
                    <p className="text-sm text-gray-600">{selectedImage.name}</p>
                  </div>
                  
                  {selectedImage.description && (
                    <div>
                      <Label className="font-medium">Opis:</Label>
                      <p className="text-sm text-gray-600">{selectedImage.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="font-medium">Data dodania:</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedImage.uploadedAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowImageModal(false)}>
                  Zamknij
                </Button>
                {typeof selectedImage !== 'string' && (
                  <Button 
                    onClick={() => {
                      setShowImageModal(false)
                      handleEditImage(selectedImage)
                    }}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edytuj
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edytuj zdjęcie</DialogTitle>
            <DialogDescription>
              Dodaj opis do zdjęcia lub zmień jego nazwę
            </DialogDescription>
          </DialogHeader>
          
          {editingImage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Podgląd:</Label>
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mt-2">
                    {typeof editingImage === 'string' ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ) : (
                      <img 
                        src={editingImage.url || "/placeholder.svg"} 
                        alt={editingImage.name || 'Zdjęcie gabinetu'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageName">Nazwa zdjęcia</Label>
                    <Input 
                      id="imageName"
                      value={typeof editingImage === 'string' ? '' : editingImage.name || ''}
                      onChange={(e) => {
                        if (typeof editingImage !== 'string') {
                          setEditingImage({
                            ...editingImage,
                            name: e.target.value
                          })
                        }
                      }}
                      placeholder="np. Gabinet - sala porodowa"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageDescription">Opis zdjęcia</Label>
                    <Textarea 
                      id="imageDescription"
                      value={typeof editingImage === 'string' ? '' : editingImage.description || ''}
                      onChange={(e) => {
                        if (typeof editingImage !== 'string') {
                          setEditingImage({
                            ...editingImage,
                            description: e.target.value
                          })
                        }
                      }}
                      placeholder="Opisz co przedstawia to zdjęcie..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Opis będzie widoczny dla pacjentek w Twoim profilu
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Anuluj
                </Button>
                <Button 
                  onClick={handleSaveImageEdit}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Zapisz zmiany
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Service Edit Form Component
function ServiceEditForm({ service, onSave, onCancel }: { 
  service: any | null, 
  onSave: (data: any) => void, 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || '',
    duration: service?.duration || '',
    isOnline: service?.isOnline || false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="serviceName">Nazwa usługi</Label>
        <Input 
          id="serviceName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="np. Opieka prenatalna"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="serviceDescription">Opis</Label>
        <Textarea 
          id="serviceDescription"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Opisz szczegóły usługi..."
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="servicePrice">Cena</Label>
          <Input 
            id="servicePrice"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder="np. 180 zł"
            required
          />
        </div>
        <div>
          <Label htmlFor="serviceDuration">Czas trwania</Label>
          <Input 
            id="serviceDuration"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="np. 45 min"
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox"
          id="isOnline"
          checked={formData.isOnline}
          onChange={(e) => setFormData(prev => ({ ...prev, isOnline: e.target.checked }))}
        />
        <Label htmlFor="isOnline">Usługa dostępna online</Label>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
          {service ? 'Zapisz zmiany' : 'Dodaj usługę'}
        </Button>
      </div>
    </form>
  )
}

export default function MidwifeDemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MidwifeDashboardContent />
    </Suspense>
  )
}
