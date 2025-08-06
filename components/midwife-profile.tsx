"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Award,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Baby,
  Users,
  Video,
  Stethoscope,
  Navigation,
  X,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { AppointmentBookingCalendar } from "./appointment-booking-calendar"
import { dataManager } from "@/lib/data-manager"
import { formatDate, addDays, getWorkingHours } from "@/lib/date-utils"
import { midwifeDataManager } from "@/lib/midwife-data-manager"

interface MidwifeProfileProps {
  midwifeId: string
}

// Service icon mapping
const getServiceIcon = (serviceName: string) => {
  const iconMap: { [key: string]: any } = {
    "Opieka prenatalna": Heart,
    "Porody domowe": Heart,
    "Opieka poporodowa": Users,
    "CDL - Ciągłość Opieki": Users,
    "Edukacja przedporodowa ( szkoła rodzenia )": Baby,
    "Seksuologia - konsultacja seksuologiczna": Heart,
    "Edukacja seksualna": Baby,
    "Fizjoterapia uroginekologiczna": Heart,
    "Opieka okołomenopauzalna": Heart,
    "Edukacja zdrowia intymnego": Baby,
    "Wsparcie w okresie dojrzewania": Baby,
    "Psychologia perinatalna": Heart,
    "USG prenatalny": Stethoscope,
  }
  return iconMap[serviceName] || Heart
}

// Mock data for different midwives
const mockMidwives = {
  "1": {
    id: "1",
    name: "Anna Kowalska",
    title: "Położna dyplomowana",
    location: "Warszawa, Mokotów",
    fullAddress: "ul. Puławska 123, 02-595 Warszawa",
    coordinates: { lat: 52.1672, lng: 21.0128 },
    rating: 4.9,
    reviewCount: 127,
    experience: "8 lat",
    verified: true,
    premium: true,
    phone: "+48 123 456 789",
    email: "anna.kowalska@mymidwife.pl",
    bio: "Cieszę się, że tu trafiłaś/eś 😊 bo to znaczy że cenisz jakość i doświadczenie. Pracuję jako położna od ponad 8 lat dodatkowo jestem szkoleniowcem dla największych szkół fitness w PL szkołąc trenerów personalnych od 11 lat. Posiadam certyfikaty w zakresie opieki prenatalnej i wsparcia w naturalnym rodzeniu.",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Gabinet+Anna+1",
      "/placeholder.svg?height=400&width=600&text=Gabinet+Anna+2",
      "/placeholder.svg?height=400&width=600&text=Sprzęt+medyczny+Anna",
      "/images/nurse-checklist.jpg",
      "/placeholder.svg?height=400&width=600&text=Certyfikaty+Anna",
      "/placeholder.svg?height=400&width=600&text=Sala+konsultacyjna+Anna",
    ],
    services: [
      {
        name: "Opieka prenatalna",
        description: "Kompleksowa opieka przez cały okres ciąży z regularnym monitoringiem",
        price: "180 zł",
        duration: "45 min",
        icon: Heart,
        isOnline: false,
      },
      {
        name: "CDL - Ciągłość Opieki",
        description: "Indywidualne wsparcie od początku ciąży do okresu poporodowego",
        price: "2500 zł",
        duration: "pakiet",
        icon: Users,
        isOnline: false,
      },
      {
        name: "Edukacja przedporodowa ( szkoła rodzenia )",
        description: "Przygotowanie do porodu i rodzicielstwa w grupach lub indywidualnie",
        price: "150 zł",
        duration: "90 min",
        icon: Baby,
        isOnline: false,
      },

      {
        name: "Seksuologia - konsultacja seksuologiczna",
        description: "Profesjonalne konsultacje seksuologiczne z położną-seksuologiem",
        price: "200 zł",
        duration: "60 min",
        icon: Heart,
        isOnline: true,
      },
      {
        name: "Edukacja seksualna",
        description: "Edukacja w zakresie zdrowia seksualnego i intymnego",
        price: "150 zł",
        duration: "60 min",
        icon: Baby,
        isOnline: true,
      },
      {
        name: "Fizjoterapia uroginekologiczna",
        description: "Specjalistyczna fizjoterapia mięśni dna miednicy",
        price: "180 zł",
        duration: "45 min",
        icon: Heart,
        isOnline: false,
      },
      {
        name: "Opieka okołomenopauzalna",
        description: "Wsparcie i edukacja w okresie menopauzy",
        price: "160 zł",
        duration: "45 min",
        icon: Heart,
        isOnline: true,
      },
      {
        name: "Edukacja zdrowia intymnego",
        description: "Edukacja w zakresie zdrowia intymnego i higieny",
        price: "140 zł",
        duration: "45 min",
        icon: Baby,
        isOnline: true,
      },
      {
        name: "Wsparcie w okresie dojrzewania",
        description: "Wsparcie nastolatek w okresie dojrzewania",
        price: "130 zł",
        duration: "45 min",
        icon: Baby,
        isOnline: true,
      },
    ],
    workingHours: {
      Dziś: getWorkingHours(new Date()),
      [formatDate(addDays(new Date(), 1), { day: "numeric", month: "short", year: "numeric" })]: getWorkingHours(
        addDays(new Date(), 1),
      ),
      [formatDate(addDays(new Date(), 2), { day: "numeric", month: "short", year: "numeric" })]: getWorkingHours(
        addDays(new Date(), 2),
      ),
      [formatDate(addDays(new Date(), 3), { day: "numeric", month: "short", year: "numeric" })]: getWorkingHours(
        addDays(new Date(), 3),
      ),
    },
  },
  "2": {
    id: "2",
    name: "Maria Nowak",
    title: "Położna specjalistka",
    location: "Kraków, Stare Miasto",
    fullAddress: "ul. Floriańska 45, 31-019 Kraków",
    coordinates: { lat: 50.0647, lng: 19.945 },
    rating: 4.8,
    reviewCount: 89,
    experience: "12 lat",
    verified: true,
    premium: false,
    phone: "+48 987 654 321",
    email: "maria.nowak@mymidwife.pl",
    bio: "Specjalizuję się w porodach domowych i naturalnym rodzeniu. Moje podejście opiera się na szacunku dla naturalnych procesów i wspieraniu kobiet w ich wyborach. Posiadam 12-letnie doświadczenie w położnictwie i jestem certyfikowaną doula.",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Dom+Maria+1",
      "/placeholder.svg?height=400&width=600&text=Dom+Maria+2",
      "/images/nurse-checklist.jpg",
      "/placeholder.svg?height=400&width=600&text=Sprzęt+Maria",
      "/placeholder.svg?height=400&width=600&text=Certyfikaty+Maria",
    ],
    services: [
      {
        name: "Porody domowe",
        description: "Profesjonalne wsparcie podczas porodu w domowym zaciszu",
        price: "2800 zł",
        duration: "pakiet",
        icon: Heart,
        isOnline: false,
      },

      {
        name: "Opieka poporodowa",
        description: "Wsparcie w pierwszych tygodniach po porodzie",
        price: "250 zł",
        duration: "90 min",
        icon: Users,
        isOnline: false,
      },

    ],
    workingHours: {
      Dziś: "9:00 - 17:00",
      [formatDate(addDays(new Date(), 1), { day: "numeric", month: "short", year: "numeric" })]: "10:00 - 18:00",
      [formatDate(addDays(new Date(), 2), { day: "numeric", month: "short", year: "numeric" })]: "Zamknięte",
      [formatDate(addDays(new Date(), 3), { day: "numeric", month: "short", year: "numeric" })]: "9:00 - 15:00",
    },
  },
  "3": {
    id: "3",
    name: "Katarzyna Wiśniewska",
    title: "Położna z certyfikatem USG",
    location: "Gdańsk, Wrzeszcz",
    fullAddress: "ul. Grunwaldzka 82, 80-244 Gdańsk",
    coordinates: { lat: 54.352, lng: 18.6466 },
    rating: 4.7,
    reviewCount: 156,
    experience: "6 lat",
    verified: true,
    premium: true,
    phone: "+48 555 123 456",
    email: "katarzyna.wisniewska@mymidwife.pl",
    bio: "Młoda, energiczna położna z nowoczesnym podejściem do opieki prenatalnej. Specjalizuję się w diagnostyce prenatalnej i psychologii perinatnej. Ukończyłam liczne kursy z zakresu ultrasonografii i wsparcia psychologicznego kobiet w ciąży.",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Gabinet+Katarzyna+1",
      "/placeholder.svg?height=400&width=600&text=USG+Katarzyna",
      "/images/nurse-checklist.jpg",
      "/placeholder.svg?height=400&width=600&text=Konsultacje+Katarzyna",
      "/placeholder.svg?height=400&width=600&text=Certyfikaty+Katarzyna",
    ],
    services: [

      {
        name: "Edukacja przedporodowa ( szkoła rodzenia )",
        description: "Nowoczesne podejście do przygotowania na rodzicielstwo",
        price: "180 zł",
        duration: "90 min",
        icon: Baby,
        isOnline: false,
      },
      {
        name: "Psychologia perinatalna",
        description: "Wsparcie psychologiczne w okresie okołoporodowym",
        price: "200 zł",
        duration: "60 min",
        icon: Heart,
        isOnline: false,
      },
      {
        name: "USG prenatalny",
        description: "Badania ultrasonograficzne z dokładną interpretacją",
        price: "150 zł",
        duration: "30 min",
        icon: Stethoscope,
        isOnline: false,
      },
    ],
    workingHours: {
      Dziś: "8:00 - 16:00",
      [formatDate(addDays(new Date(), 1), { day: "numeric", month: "short", year: "numeric" })]: "8:00 - 16:00",
      [formatDate(addDays(new Date(), 2), { day: "numeric", month: "short", year: "numeric" })]: "10:00 - 14:00",
      [formatDate(addDays(new Date(), 3), { day: "numeric", month: "short", year: "numeric" })]: "8:00 - 16:00",
    },
  },
  "4": {
    id: "4",
    name: "Joanna Kowalczyk",
    title: "Położna neonatolog",
    location: "Wrocław, Krzyki",
    fullAddress: "ul. Powstańców Śląskich 95, 53-332 Wrocław",
    coordinates: { lat: 51.1079, lng: 17.0385 },
    rating: 4.6,
    reviewCount: 73,
    experience: "10 lat",
    verified: false,
    premium: false,
    phone: "+48 666 789 012",
    email: "joanna.kowalczyk@mymidwife.pl",
    bio: "Specjalizuję się w opiece nad wcześniakami i noworodkami wymagającymi szczególnej uwagi. Mam 10-letnie doświadczenie w neonatologii i jestem certyfikowaną konsultantką laktacyjną. Pomagam rodzicom w nauce opieki nad małymi dziećmi.",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=OIOM+Joanna",
      "/placeholder.svg?height=400&width=600&text=Inkubatory+Joanna",
      "/images/nurse-checklist.jpg",
      "/placeholder.svg?height=400&width=600&text=Gabinet+Joanna",
      "/placeholder.svg?height=400&width=600&text=Certyfikaty+Joanna",
    ],
    services: [


      {
        name: "Opieka prenatalna",
        description: "Kontrole ciąży wysokiego ryzyka",
        price: "200 zł",
        duration: "60 min",
        icon: Stethoscope,
        isOnline: false,
      },
      {
        name: "Konsultacje rodzinne",
        description: "Wsparcie całej rodziny w opiece nad noworodkiem",
        price: "250 zł",
        duration: "90 min",
        icon: Users,
        isOnline: false,
      },
    ],
    workingHours: {
      Dziś: "7:00 - 15:00",
      [formatDate(addDays(new Date(), 1), { day: "numeric", month: "short", year: "numeric" })]: "7:00 - 15:00",
      [formatDate(addDays(new Date(), 2), { day: "numeric", month: "short", year: "numeric" })]: "7:00 - 15:00",
      [formatDate(addDays(new Date(), 3), { day: "numeric", month: "short", year: "numeric" })]: "Zamknięte",
    },
  },
  "5": {
    id: "5",
    name: "Magdalena Zielińska",
    title: "Położna z tytułem magistra",
    location: "Poznań, Jeżyce",
    fullAddress: "ul. Dąbrowskiego 79, 60-529 Poznań",
    coordinates: { lat: 52.4064, lng: 16.9252 },
    rating: 4.9,
    reviewCount: 201,
    experience: "15 lat",
    verified: true,
    premium: true,
    phone: "+48 777 888 999",
    email: "magdalena.zielinska@mymidwife.pl",
    bio: "Jestem położną z 15-letnim doświadczeniem i tytułem magistra położnictwa. Specjalizuję się w CDL (Ciągłość Opieki Położnej) oraz porodach domowych. Jestem autorką kilku publikacji naukowych z zakresu położnictwa i prowadzę szkolenia dla młodszych koleżanek.",
    gallery: [
      "/placeholder.svg?height=400&width=600&text=Gabinet+Magdalena+1",
      "/placeholder.svg?height=400&width=600&text=Gabinet+Magdalena+2",
      "/images/nurse-checklist.jpg",
      "/placeholder.svg?height=400&width=600&text=Sala+porodowa+Magdalena",
      "/placeholder.svg?height=400&width=600&text=Biblioteka+Magdalena",
      "/placeholder.svg?height=400&width=600&text=Dyplomy+Magdalena",
    ],
    services: [
      {
        name: "CDL - Ciągłość Opieki",
        description: "Kompleksowa opieka od początku ciąży do 6 tygodni po porodzie",
        price: "3500 zł",
        duration: "pakiet",
        icon: Users,
        isOnline: false,
      },
      {
        name: "Porody domowe",
        description: "Profesjonalne wsparcie podczas porodu w domu",
        price: "3000 zł",
        duration: "pakiet",
        icon: Heart,
        isOnline: false,
      },
      {
        name: "Edukacja przedporodowa ( szkoła rodzenia )",
        description: "Autorski program przygotowania do porodu i rodzicielstwa",
        price: "200 zł",
        duration: "120 min",
        icon: Baby,
        isOnline: false,
      },
      {
        name: "Konsultacje eksperckie",
        description: "Konsultacje w trudnych przypadkach położniczych",
        price: "300 zł",
        duration: "90 min",
        icon: Stethoscope,
        isOnline: false,
      },
    ],
    workingHours: {
      Dziś: "9:00 - 18:00",
      [formatDate(addDays(new Date(), 1), { day: "numeric", month: "short", year: "numeric" })]: "9:00 - 18:00",
      [formatDate(addDays(new Date(), 2), { day: "numeric", month: "short", year: "numeric" })]: "9:00 - 15:00",
      [formatDate(addDays(new Date(), 3), { day: "numeric", month: "short", year: "numeric" })]: "9:00 - 18:00",
    },
  },
}

export function MidwifeProfile({ midwifeId }: MidwifeProfileProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [expandedService, setExpandedService] = useState<number[]>([0, 1, 2, 3, 4])
  const [showMapPopup, setShowMapPopup] = useState(false)
  const [userDistance, setUserDistance] = useState<string | null>(null)
  const [showFullBio, setShowFullBio] = useState(false)
  const [showAllHours, setShowAllHours] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [showBookingCalendar, setShowBookingCalendar] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [midwife, setMidwife] = useState<any>(null)

  // Get the specific midwife data from data manager or fallback to mockMidwives
  useEffect(() => {
    const managedProfile = midwifeDataManager.getProfile(midwifeId)
    if (managedProfile) {
      setMidwife(managedProfile)
    } else {
      // Fallback to static data
      const staticMidwife = mockMidwives[midwifeId as keyof typeof mockMidwives]
      setMidwife(staticMidwife)
    }

    // Subscribe to profile updates
    const unsubscribe = midwifeDataManager.subscribe(midwifeId, (updatedProfile) => {
      setMidwife(updatedProfile)
    })

    return unsubscribe
  }, [midwifeId])

  useEffect(() => {
    if (!midwife) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          const distance = calculateDistance(userLat, userLng, midwife.coordinates.lat, midwife.coordinates.lng)
          setUserDistance(`${distance.toFixed(1)} km od Ciebie`)
        },
        () => setUserDistance("2.3 km od centrum"),
      )
    } else {
      setUserDistance("2.3 km od centrum")
    }
  }, [midwife])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % midwife.gallery.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + midwife.gallery.length) % midwife.gallery.length)

  const handleStartConversation = () => {
    const conversation = dataManager.getOrCreateConversation(midwife.id, midwife.name, midwife.gallery[0])
    router.push(`/dashboard?tab=messages&conversationId=${conversation.id}`)
  }

  const handleBookService = (service: any) => {
    setSelectedService(service)
    setShowBookingCalendar(true)
  }

  const handleBookingConfirm = (date: string, time: string) => {
    if (!selectedService) return
    const newAppointment = {
      id: dataManager.generateId(),
      midwifeId: midwife.id,
      midwifeName: midwife.name,
      midwifeAvatar: "/images/pregnancy-support.png",
      date,
      time,
      type: selectedService.name,
      location: selectedService.isOnline ? "Online" : midwife.fullAddress,
      isOnline: selectedService.isOnline,
      status: "scheduled" as const,
      meetingLink: selectedService.isOnline ? "https://meet.google.com/demo-link" : undefined,
      notes: `Wizyta umówiona przez profil położnej - ${selectedService.price}`,
    }
    dataManager.addAppointment(newAppointment)
    setSelectedService(null)
    setShowBookingCalendar(false)
  }

  const handleMapClick = () => setShowMapPopup(true)
  const openGoogleMaps = () => {
    const address = encodeURIComponent(midwife.fullAddress)
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, "_blank")
  }

  // If midwife not found, show error message
  if (!midwife) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/search" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do wyników wyszukiwania
          </Link>
        </div>
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <h3 className="text-lg font-medium mb-2">Położna nie została znaleziona</h3>
            <p>Nie można znaleźć profilu położnej o podanym ID: {midwifeId}</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search" className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Powrót do wyników wyszukiwania
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={midwife.gallery[currentImageIndex] || "/images/midwife-consultation.png"}
                alt={`Zdjęcie ${currentImageIndex + 1}`}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold">{midwife.rating}</div>
                <div className="text-xs">{midwife.reviewCount} opinii</div>
              </div>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {midwife.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4" />
              Usługa mobilna
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{midwife.name}</h1>
              {midwife.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Zweryfikowana
                </Badge>
              )}
              {midwife.premium && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Award className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-2">{midwife.title}</p>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{midwife.fullAddress}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usługi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">Sugerowane usługi</div>
              {midwife.services.map((service, index) => {
                const IconComponent = service.icon || getServiceIcon(service.name)
                const isExpanded = expandedService.includes(index)
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{service.name}</h3>
                          <button
                            onClick={() =>
                              setExpandedService(
                                isExpanded ? expandedService.filter((i) => i !== index) : [...expandedService, index],
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold text-lg">{service.price}</div>
                                <div className="text-sm text-gray-600">{service.duration}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {service.isOnline && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <Video className="w-3 h-3 mr-1" />
                                    Online
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleBookService(service)}
                              className="bg-pink-500 hover:bg-pink-600"
                            >
                              Umów wizytę
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="relative">
            <div
              className="h-48 bg-gray-100 rounded-t-lg relative overflow-hidden cursor-pointer"
              onClick={handleMapClick}
            >
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${midwife.coordinates.lng - 0.005},${
                  midwife.coordinates.lat - 0.0025
                },${midwife.coordinates.lng + 0.005},${
                  midwife.coordinates.lat + 0.0025
                }&layer=mapnik&marker=${midwife.coordinates.lat},${midwife.coordinates.lng}&zoom=17`}
                className="w-full h-full border-0"
                title="Mapa lokalizacji"
              />
              {userDistance && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {userDistance}
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openGoogleMaps()
                }}
                className="absolute bottom-3 right-3 bg-white hover:bg-gray-50 p-2 rounded-full shadow-lg transition-colors group"
                title="Otwórz w Google Maps"
              >
                <Navigation className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </button>
            </div>
            {showMapPopup && (
              <div className="absolute inset-0 bg-black/50 flex items-end justify-center p-4 rounded-lg">
                <div className="bg-white rounded-lg p-4 w-full max-w-sm relative">
                  <button
                    onClick={() => setShowMapPopup(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {midwife.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{midwife.name}</h3>
                      <p className="text-sm text-gray-600">{midwife.fullAddress}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-400">{"★".repeat(Math.floor(midwife.rating))}</div>
                        <span className="text-sm text-gray-600">
                          {midwife.rating} ({midwife.reviewCount} opinii)
                        </span>
                      </div>
                    </div>
                    <button onClick={openGoogleMaps} className="text-blue-600 hover:text-blue-700">
                      <Navigation className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>O NAS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm leading-relaxed">{midwife.bio}</p>
              <Button
                variant="link"
                className="p-0 h-auto text-blue-500 mt-2"
                onClick={() => setShowFullBio(!showFullBio)}
              >
                {showFullBio ? "ZWIŃ ↑" : "ROZWIŃ →"}
              </Button>
            </CardContent>
          </Card>



          <Card>
            <CardHeader>
              <CardTitle>DANE KONTAKTOWE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm font-medium">{midwife.name}</div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{midwife.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{showEmail ? midwife.email : "Ukryte"}</span>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-500 text-sm"
                  onClick={() => setShowEmail(!showEmail)}
                >
                  {showEmail ? "Ukryj" : "Pokaż"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleStartConversation}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Napisz wiadomość
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>MEDIA SPOŁECZNOŚCIOWE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-1">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">Instagram</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">Facebook</div>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mb-1">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs text-gray-600">Strona</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentBookingCalendar
        isOpen={showBookingCalendar}
        onClose={() => {
          setShowBookingCalendar(false)
          setSelectedService(null)
        }}
        onConfirm={handleBookingConfirm}
        midwifeName={midwife.name}
        serviceName={selectedService?.name || ""}
        servicePrice={selectedService?.price || ""}
        serviceDuration={selectedService?.duration || ""}
        isOnline={selectedService?.isOnline || false}
        location={midwife.fullAddress}
      />
    </div>
  )
}
