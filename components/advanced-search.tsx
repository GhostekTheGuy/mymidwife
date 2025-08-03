"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  MapPin,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Award,
  Shield,
  Search,
  SlidersHorizontal,
  Stethoscope,
  DollarSign,
  Calendar,
  Heart,
  Baby,
  Users,
  Video,
  Home,
  CheckCircle,
  X,
  Filter,
} from "lucide-react"
import { CityAutocomplete } from "@/components/city-autocomplete"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { dataManager } from "@/lib/data-manager"
import { getAvailabilityText, addDays } from "@/lib/date-utils"

const mockMidwives = [
  {
    id: 1,
    name: "Anna Kowalska",
    location: "Warszawa, Mokotów",
    rating: 4.9,
    reviews: 127,
    services: [
      "CDL",
      "Chustonoszenie",
      "Opieka prenatalna",
      "Edukacja przedporodowa",
      "Prowadzenie ciąży fizjologicznej",
      "Seksuologia - konsultacja seksuologiczna",
      "Edukacja seksualna",
      "Fizjoterapia uroginekologiczna",
    ],
    experience: 8,
    priceRange: "150-200 zł",
    availability: getAvailabilityText(new Date()),
    image: "/placeholder.svg?height=120&width=120",
    verified: true,
    premium: true,
    responseTime: "15 min",
    consultationTypes: ["Online", "Gabinet", "W domu pacjentki"],
    minPrice: 150,
    maxPrice: 200,
  },
  {
    id: 2,
    name: "Maria Nowak",
    location: "Kraków, Stare Miasto",
    rating: 4.8,
    reviews: 89,
    services: ["Porody domowe", "Wsparcie w karmieniu", "Opieka poporodowa", "Chustonoszenie", "Opieka okołomenopauzalna", "Edukacja zdrowia intymnego"],
    experience: 12,
    priceRange: "180-250 zł",
    availability: getAvailabilityText(addDays(new Date(), 1)),
    image: "/placeholder.svg?height=120&width=120",
    verified: true,
    premium: false,
    responseTime: "30 min",
    consultationTypes: ["Online", "Gabinet", "W domu pacjentki"],
    minPrice: 180,
    maxPrice: 250,
  },
  {
    id: 3,
    name: "Katarzyna Wiśniewska",
    location: "Gdańsk, Wrzeszcz",
    rating: 4.7,
    reviews: 156,
    services: ["Konsultacje online", "Edukacja przedporodowa", "Psychologia perinatalna", "CDL", "Wsparcie w okresie dojrzewania u nastolatek", "Edukacja seksualna"],
    experience: 6,
    priceRange: "120-180 zł",
    availability: getAvailabilityText(addDays(new Date(), 7)),
    image: "/placeholder.svg?height=120&width=120",
    verified: true,
    premium: true,
    responseTime: "45 min",
    consultationTypes: ["Online", "Gabinet"],
    minPrice: 120,
    maxPrice: 180,
  },
  {
    id: 4,
    name: "Joanna Kowalczyk",
    location: "Wrocław, Krzyki",
    rating: 4.6,
    reviews: 73,
    services: [
      "Opieka nad wcześniakami",
      "Wsparcie w karmieniu",
      "Opieka prenatalna",
      "Prowadzenie ciąży fizjologicznej",
      "Fizjoterapia uroginekologiczna",
      "Opieka okołomenopauzalna",
    ],
    experience: 10,
    priceRange: "160-220 zł",
    availability: getAvailabilityText(addDays(new Date(), 2)),
    image: "/placeholder.svg?height=120&width=120",
    verified: false,
    premium: false,
    responseTime: "60 min",
    consultationTypes: ["Gabinet", "W domu pacjentki"],
    minPrice: 160,
    maxPrice: 220,
  },
  {
    id: 5,
    name: "Magdalena Zielińska",
    location: "Poznań, Jeżyce",
    rating: 4.9,
    reviews: 201,
    services: ["CDL", "Porody domowe", "Edukacja przedporodowa", "Chustonoszenie", "Seksuologia - konsultacja seksuologiczna", "Edukacja zdrowia intymnego"],
    experience: 15,
    priceRange: "200-300 zł",
    availability: getAvailabilityText(new Date()),
    image: "/placeholder.svg?height=120&width=120",
    verified: true,
    premium: true,
    responseTime: "10 min",
    consultationTypes: ["Online", "Gabinet", "W domu pacjentki"],
    minPrice: 200,
    maxPrice: 300,
  },
]

const serviceIcons: { [key: string]: React.ElementType } = {
  "Opieka prenatalna": Heart,
  "Porody domowe": Home,
  "Opieka poporodowa": Users,
  CDL: CheckCircle,
  "Edukacja przedporodowa": Stethoscope,
  "Konsultacje online": Video,
  "Wsparcie w karmieniu": Heart,
  "Psychologia perinatalna": Users,
  "Opieka nad wcześniakami": Baby,
  Chustonoszenie: Baby,
  "Prowadzenie ciąży fizjologicznej": Heart,
}

export function AdvancedSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [experienceRange, setExperienceRange] = useState([0, 20])
  const [priceRange, setPriceRange] = useState([0, 500])
  const [availability, setAvailability] = useState<string[]>([])
  const [consultationType, setConsultationType] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("rating")
  const [locationSearch, setLocationSearch] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Define preferred order for services
  const preferredServicesOrder = ["CDL", "Chustonoszenie", "Prowadzenie ciąży fizjologicznej"]
  const allUniqueServices = Array.from(new Set(mockMidwives.flatMap((m) => m.services)))
  const allServices = [
    ...preferredServicesOrder,
    ...allUniqueServices.filter((s) => !preferredServicesOrder.includes(s)),
  ]

  const allConsultationTypes = Array.from(new Set(mockMidwives.flatMap((m) => m.consultationTypes)))

  const availabilityOptions = [
    { text: getAvailabilityText(new Date()), value: "today" },
    { text: getAvailabilityText(addDays(new Date(), 1)), value: "tomorrow" },
    { text: getAvailabilityText(addDays(new Date(), 7)), value: "next-week" },
    { text: getAvailabilityText(addDays(new Date(), 2)), value: "day-after-tomorrow" },
  ]

  const activeFiltersCount =
    selectedServices.length +
    (experienceRange[0] > 0 || experienceRange[1] < 20 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0) +
    availability.length +
    consultationType.length +
    (minRating > 0 ? 1 : 0)

  const filteredMidwives = useMemo(() => {
    const filtered = mockMidwives.filter((midwife) => {
      if (
        (searchQuery && !midwife.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (locationSearch && !midwife.location.toLowerCase().includes(locationSearch.toLowerCase()))
      ) {
        if (
          searchQuery &&
          !midwife.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !midwife.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          return false
        }
      }
      if (selectedServices.length > 0 && !selectedServices.some((service) => midwife.services.includes(service))) {
        return false
      }
      if (midwife.experience < experienceRange[0] || midwife.experience > experienceRange[1]) {
        return false
      }
      if (midwife.minPrice > priceRange[1] || midwife.maxPrice < priceRange[0]) {
        return false
      }
      if (availability.length > 0 && !availability.some(avail => midwife.availability.includes(avail))) {
        return false
      }
      if (consultationType.length > 0 && !consultationType.some((type) => midwife.consultationTypes.includes(type))) {
        return false
      }
      if (midwife.rating < minRating) {
        return false
      }
      return true
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        case "experience":
          return b.experience - a.experience
        case "price-low":
          return a.minPrice - b.minPrice
        case "price-high":
          return b.maxPrice - a.maxPrice
        default:
          return 0
      }
    })
  }, [
    searchQuery,
    locationSearch,
    selectedServices,
    experienceRange,
    priceRange,
    availability,
    consultationType,
    minRating,
    sortBy,
  ])

  const clearAllFilters = () => {
    setSelectedServices([])
    setExperienceRange([0, 20])
    setPriceRange([0, 500])
    setAvailability([])
    setConsultationType([])
    setMinRating(0)
  }

  const handleStartConversation = (midwife: (typeof mockMidwives)[0]) => {
    const conversation = dataManager.getOrCreateConversation(midwife.id.toString(), midwife.name, midwife.image)
    router.push(`/dashboard?tab=messages&conversationId=${conversation.id}`)
  }

  const handleSearch = () => {
    setSearchQuery(locationSearch)
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="w-4 h-4 text-pink-500" />
          <Label className="font-medium">Rodzaj usług</Label>
        </div>
        <div className="space-y-2">
          {allServices.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={service}
                checked={selectedServices.includes(service)}
                onCheckedChange={(checked) => {
                  setSelectedServices(
                    checked ? [...selectedServices, service] : selectedServices.filter((s) => s !== service),
                  )
                }}
              />
              <Label htmlFor={service} className="text-sm">
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-500" />
          <Label className="font-medium">Doświadczenie (lata)</Label>
        </div>
        <div className="px-2">
          <Slider
            value={experienceRange}
            onValueChange={setExperienceRange}
            max={20}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{experienceRange[0]} lat</span>
            <span>{experienceRange[1]} lat</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-green-500" />
          <Label className="font-medium">Zakres cenowy (zł)</Label>
        </div>
        <div className="px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500} min={0} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{priceRange[0]} zł</span>
            <span>{priceRange[1]} zł</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-purple-500" />
          <Label className="font-medium">Dostępność</Label>
        </div>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={availability.includes(option.text)}
                onCheckedChange={(checked) => {
                  setAvailability(checked ? [...availability, option.text] : availability.filter((a) => a !== option.text))
                }}
              />
              <Label htmlFor={option.value} className="text-sm">
                {option.text}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Video className="w-4 h-4 text-blue-500" />
          <Label className="font-medium">Sposób konsultacji</Label>
        </div>
        <div className="space-y-2">
          {allConsultationTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={consultationType.includes(type)}
                onCheckedChange={(checked) => {
                  setConsultationType(checked ? [...consultationType, type] : consultationType.filter((t) => t !== type))
                }}
              />
              <Label htmlFor={type} className="text-sm">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-yellow-500" />
          <Label className="font-medium">Minimalna ocena</Label>
        </div>
        <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz ocenę" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Wszystkie</SelectItem>
            <SelectItem value="3">3+ gwiazdki</SelectItem>
            <SelectItem value="4">4+ gwiazdki</SelectItem>
            <SelectItem value="4.5">4.5+ gwiazdki</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-bold text-left text-3xl sm:text-4xl lg:text-5xl leading-tight">
            Wybierz spośród ponad <span className="text-yellow-300">500</span> położnych!
          </h1>
        </div>
      </div>

      {/* Search Section - Mobile Optimized */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <CityAutocomplete
                value={locationSearch}
                onChange={setLocationSearch}
                placeholder="Miasto, dzielnica..."
                className="pl-12 h-12 sm:h-12 text-base sm:text-lg border-gray-300"
              />
            </div>
            <Button size="lg" className="h-12 px-6 sm:px-8 bg-pink-500 hover:bg-pink-600" onClick={handleSearch}>
              <Search className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Szukaj</span>
              <span className="sm:hidden">Znajdź</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filtry
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Wyczyść
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              {/* Mobile-optimized header */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Mobile Filters Button */}
                <div className="flex items-center justify-between lg:hidden">
                  <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Filter className="w-4 h-4" />
                        Filtry
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:w-80 overflow-y-auto">
                      <SheetHeader>
                        <div className="flex items-center justify-between">
                          <SheetTitle className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5" />
                            Filtry
                            {activeFiltersCount > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                {activeFiltersCount}
                              </Badge>
                            )}
                          </SheetTitle>
                          {activeFiltersCount > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Wyczyść
                            </Button>
                          )}
                        </div>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Najwyższa ocena</SelectItem>
                      <SelectItem value="reviews">Najwięcej opinii</SelectItem>
                      <SelectItem value="experience">Doświadczenie</SelectItem>
                      <SelectItem value="price-low">Cena: od najniższej</SelectItem>
                      <SelectItem value="price-high">Cena: od najwyższej</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tabs and Desktop Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <TabsList className="w-full sm:w-auto">
                    <TabsTrigger value="all" className="flex-1 sm:flex-none">
                      Wszystkie ({filteredMidwives.length})
                    </TabsTrigger>
                    <TabsTrigger value="premium" className="flex-1 sm:flex-none">
                      Premium
                    </TabsTrigger>
                    <TabsTrigger value="verified" className="flex-1 sm:flex-none">
                      Zweryfikowane
                    </TabsTrigger>
                  </TabsList>

                  <div className="hidden lg:flex items-center gap-4">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Najwyższa ocena</SelectItem>
                        <SelectItem value="reviews">Najwięcej opinii</SelectItem>
                        <SelectItem value="experience">Doświadczenie</SelectItem>
                        <SelectItem value="price-low">Cena: od najniższej</SelectItem>
                        <SelectItem value="price-high">Cena: od najwyższej</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <TabsContent value="all">
                {filteredMidwives.length === 0 ? (
                  <Card className="p-6 sm:p-8 text-center">
                    <div className="text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Brak wyników</h3>
                      <p className="text-sm sm:text-base">Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry.</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredMidwives.map((midwife) => (
                      <Card key={midwife.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Midwife Info - Mobile Optimized */}
                            <Link href={`/midwife/${midwife.id}`} className="flex flex-1 gap-3 sm:gap-4 min-w-0">
                              <Avatar className="w-16 h-16 sm:w-16 sm:h-16 flex-shrink-0">
                                <AvatarImage src={midwife.image || "/placeholder.svg"} alt={midwife.name} />
                                <AvatarFallback className="text-lg">
                                  {midwife.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                  <h3 className="text-lg font-semibold hover:text-pink-600 transition-colors">
                                    {midwife.name}
                                  </h3>
                                  <div className="flex gap-1 sm:gap-2">
                                    {midwife.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Shield className="w-3 h-3 mr-1" />
                                        <span className="hidden sm:inline">Zweryfikowana</span>
                                        <span className="sm:hidden">Zweryfikowana</span>
                                      </Badge>
                                    )}
                                    {midwife.premium && (
                                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                        <Award className="w-3 h-3 mr-1" />
                                        Premium
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate">{midwife.location}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm mb-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="font-medium">{midwife.rating}</span>
                                    <span className="text-gray-500">({midwife.reviews})</span>
                                  </div>
                                  <span className="text-gray-400 hidden sm:inline">•</span>
                                  <span className="text-gray-600">{midwife.experience} lat</span>
                                  <span className="text-gray-400 hidden sm:inline">•</span>
                                  <span className="text-gray-600 text-xs sm:text-sm">{midwife.priceRange}</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {midwife.services.slice(0, 2).map((service) => (
                                    <Badge key={service} variant="outline" className="text-xs">
                                      {service}
                                    </Badge>
                                  ))}
                                  {midwife.services.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{midwife.services.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Link>

                            {/* Action Buttons - Mobile Optimized */}
                            <div className="flex sm:flex-col gap-2 sm:min-w-[120px] flex-shrink-0">
                              <Button
                                size="sm"
                                className="flex-1 sm:flex-none bg-pink-500 hover:bg-pink-600 text-sm h-9"
                                onClick={() => handleStartConversation(midwife)}
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Napisz
                              </Button>

                              <Accordion type="single" collapsible className="flex-1 sm:flex-none sm:w-full">
                                <AccordionItem value="phone">
                                  <AccordionTrigger className="flex items-center justify-center py-2 px-3 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md transition-colors">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Zadzwoń
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-2">
                                    <div className="text-center">
                                      <a
                                        href={`tel:+48${Math.floor(Math.random() * 900000000) + 100000000}`}
                                        className="text-pink-600 font-medium hover:underline text-sm"
                                      >
                                        +48 {Math.floor(Math.random() * 900) + 100}{" "}
                                        {Math.floor(Math.random() * 900) + 100} {Math.floor(Math.random() * 900) + 100}
                                      </a>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
