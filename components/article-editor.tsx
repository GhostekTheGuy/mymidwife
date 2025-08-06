"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"

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

interface ArticleEditorProps {
  onSave: (article: Omit<Article, 'id' | 'publishDate'>) => void
  onEdit?: (article: Article) => void
  onDelete?: (articleId: string) => void
  existingArticles?: Article[]
}

const categories = [
  { id: "pregnancy", name: "Ciąża" },
  { id: "psychology", name: "Psychologia" },
  { id: "nutrition", name: "Żywienie" },
  { id: "lactation", name: "Laktacja" },
  { id: "postpartum", name: "Połóg" },
]

export function ArticleEditor({ onSave, onEdit, onDelete, existingArticles = [] }: ArticleEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "pregnancy",
    author: "",
    readTime: 5,
    image: "/images/prenatal-care.png",
    featured: false,
  })

  const handleOpen = (article?: Article) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        author: article.author,
        readTime: article.readTime,
        image: article.image,
        featured: article.featured,
      })
    } else {
      setEditingArticle(null)
      setFormData({
        title: "",
        excerpt: "",
        category: "pregnancy",
        author: "",
        readTime: 5,
        image: "/images/prenatal-care.png",
        featured: false,
      })
    }
    setIsOpen(true)
  }

  const handleSave = () => {
    if (formData.title.trim() && formData.excerpt.trim() && formData.author.trim()) {
      onSave(formData)
      setIsOpen(false)
      setEditingArticle(null)
      setFormData({
        title: "",
        excerpt: "",
        category: "pregnancy",
        author: "",
        readTime: 5,
        image: "/images/prenatal-care.png",
        featured: false,
      })
    }
  }

  const handleDelete = (articleId: string) => {
    if (onDelete) {
      onDelete(articleId)
    }
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || categoryId
  }

  return (
    <div className="space-y-6">
      {/* Header z przyciskiem dodawania */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Zarządzaj artykułami</h2>
          <p className="text-sm text-gray-600">Dodawaj i edytuj materiały edukacyjne</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="bg-pink-500 hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj artykuł
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Edytuj artykuł" : "Dodaj nowy artykuł"}
              </DialogTitle>
              <DialogDescription>
                Wypełnij wszystkie pola, aby utworzyć artykuł edukacyjny
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł artykułu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Wprowadź tytuł artykułu"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Krótki opis *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Wprowadź krótki opis artykułu"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Imię i nazwisko autora"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="readTime">Czas czytania (minuty) *</Label>
                  <Input
                    id="readTime"
                    type="number"
                    min="1"
                    max="60"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })}
                  />
                </div>

                <div>
                  <Label htmlFor="image">URL obrazka</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/prenatal-care.png"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Oznacz jako polecany</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </Button>
                <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
                  <Save className="w-4 h-4 mr-2" />
                  {editingArticle ? "Zapisz zmiany" : "Dodaj artykuł"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista istniejących artykułów */}
      {existingArticles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Istniejące artykuły</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingArticles.map((article) => (
              <Card key={article.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryName(article.category)}
                    </Badge>
                    {article.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Polecane</Badge>}
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{article.author}</span>
                    <span>{article.readTime} min</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpen(article)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edytuj
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 