"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Clock, User, Heart, Baby, Brain, Utensils } from "lucide-react"

// Import date utilities at the top
import { formatDate as formatDateInput, addDays } from "@/lib/date-utils"

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  readTime: number
  publishDate: string
  image: string
  featured: boolean
}

interface EducationalContentProps {
  customArticles?: Article[]
}

export function EducationalContent({ customArticles = [] }: EducationalContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Wszystkie", icon: BookOpen },
    { id: "pregnancy", name: "Ciąża", icon: Baby },
    { id: "psychology", name: "Psychologia", icon: Brain },
    { id: "nutrition", name: "Żywienie", icon: Utensils },
    { id: "lactation", name: "Laktacja", icon: Heart },
    { id: "postpartum", name: "Połóg", icon: User },
  ]

  // Update articles with real dates
  const articles: Article[] = [
    {
      id: "1",
      title: "Przygotowanie do porodu - co warto wiedzieć",
      excerpt:
        "Kompleksowy przewodnik po przygotowaniu fizycznym i psychicznym do porodu. Poznaj techniki oddychania, pozycje porodowe i sposoby radzenia sobie z bólem.",
      category: "pregnancy",
      author: "Dr Anna Kowalska",
      readTime: 8,
      publishDate: formatDateInput(addDays(new Date(), -5)),
      image: "/images/nurse-checklist.jpg",
      featured: true,
    },
    {
      id: "2",
      title: "Żywienie w ciąży - co jeść, czego unikać",
      excerpt:
        "Praktyczne wskazówki dotyczące zdrowego żywienia w czasie ciąży. Lista produktów zalecanych i przeciwwskazanych.",
      category: "nutrition",
      author: "Mgr Magdalena Nowak",
      readTime: 6,
      publishDate: formatDateInput(addDays(new Date(), -7)),
      image: "/images/nurse-checklist.jpg",
      featured: false,
    },
    {
      id: "3",
      title: "Pierwsze dni z dzieckiem - praktyczny poradnik",
      excerpt:
        "Jak radzić sobie w pierwszych dniach po porodzie. Pielęgnacja noworodka, karmienie i regeneracja po porodzie.",
      category: "postpartum",
      author: "Położna Katarzyna Wiśniewska",
      readTime: 10,
      publishDate: formatDateInput(addDays(new Date(), -10)),
      image: "/images/nurse-checklist.jpg",
      featured: true,
    },
    {
      id: "4",
      title: "Karmienie piersią - podstawy i rozwiązywanie problemów",
      excerpt:
        "Wszystko o karmieniu naturalnym - od pierwszego przyłożenia po rozwiązywanie najczęstszych problemów laktacyjnych.",
      category: "lactation",
      author: "Konsultantka laktacyjna Maria Zielińska",
      readTime: 12,
      publishDate: formatDateInput(addDays(new Date(), -12)),
      image: "/images/nurse-checklist.jpg",
      featured: false,
    },
    {
      id: "5",
      title: "Depresja poporodowa - rozpoznawanie i pomoc",
      excerpt: "Jak rozpoznać objawy depresji poporodowej i gdzie szukać pomocy. Wsparcie dla mam i ich bliskich.",
      category: "psychology",
      author: "Psycholog Joanna Dąbrowska",
      readTime: 7,
      publishDate: formatDateInput(addDays(new Date(), -15)),
      image: "/images/nurse-checklist.jpg",
      featured: false,
    },
    {
      id: "6",
      title: "Ćwiczenia w ciąży - bezpieczna aktywność fizyczna",
      excerpt:
        "Jakie ćwiczenia są bezpieczne w ciąży, a których należy unikać. Przykładowe zestawy ćwiczeń dla każdego trymestru.",
      category: "pregnancy",
      author: "Fizjoterapeutka Agnieszka Lewandowska",
      readTime: 9,
      publishDate: formatDateInput(addDays(new Date(), -20)),
      image: "/images/nurse-checklist.jpg",
      featured: false,
    },
  ]

  // Łączymy domyślne artykuły z customowymi
  const allArticles = [...articles, ...customArticles]

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredArticles = allArticles.filter((article) => article.featured)

  // Update formatDate function call
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: { [key: string]: string } = {
      pregnancy: "bg-pink-100 text-pink-800",
      psychology: "bg-purple-100 text-purple-800",
      nutrition: "bg-green-100 text-green-800",
      lactation: "bg-blue-100 text-blue-800",
      postpartum: "bg-orange-100 text-orange-800",
    }
    return colors[categoryId] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Centrum edukacyjne</h1>
        <p className="text-gray-600">Artykuły i poradniki dla przyszłych i młodych mam</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Szukaj artykułów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-pink-500 hover:bg-pink-600" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Wszystkie artykuły
          </TabsTrigger>
          <TabsTrigger 
            value="featured"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Polecane
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  <img
                                          src={article.image || "/images/nurse-checklist.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getCategoryColor(article.category)}>{getCategoryName(article.category)}</Badge>
                    {article.featured && <Badge className="bg-yellow-100 text-yellow-800">Polecane</Badge>}
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>{article.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} min</span>
                      </div>
                    </div>
                    <span>{formatDate(article.publishDate)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nie znaleziono artykułów</h3>
              <p className="text-gray-600">Spróbuj zmienić kryteria wyszukiwania lub wybierz inną kategorię.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured">
          <div className="space-y-8">
            {featuredArticles.map((article, index) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-6`}>
                    <div className="lg:w-1/3">
                      <div className="aspect-video lg:aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={article.image || "/images/nurse-checklist.jpg"}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="lg:w-2/3 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(article.category)}>
                          {getCategoryName(article.category)}
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">Polecane</Badge>
                      </div>

                      <h2 className="text-2xl font-bold mb-3">{article.title}</h2>

                      <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{article.author}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{article.readTime} min czytania</span>
                          </div>
                          <span>{formatDate(article.publishDate)}</span>
                        </div>

                        <Button className="bg-pink-500 hover:bg-pink-600">Czytaj więcej</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Newsletter Signup */}
      <Card className="mt-12 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Bądź na bieżąco z najnowszymi artykułami</h3>
          <p className="text-gray-600 mb-6">
            Zapisz się do naszego newslettera i otrzymuj najnowsze poradniki prosto na swoją skrzynkę
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Twój adres email" className="flex-1" />
            <Button className="bg-pink-500 hover:bg-pink-600">Zapisz się</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
