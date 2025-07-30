"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const polishCities = [
  "Warszawa",
  "Kraków",
  "Gdańsk",
  "Wrocław",
  "Poznań",
  "Łódź",
  "Katowice",
  "Szczecin",
  "Bydgoszcz",
  "Lublin",
  "Białystok",
  "Toruń",
  "Sosnowiec",
  "Radom",
  "Kielce",
  "Gliwice",
  "Zabrze",
  "Bytom",
  "Olsztyn",
  "Rzeszów",
  "Ruda Śląska",
  "Rybnik",
  "Tychy",
  "Dąbrowa Górnicza",
  "Płock",
  "Elbląg",
  "Opole",
  "Gorzów Wielkopolski",
  "Włocławek",
  "Zielona Góra",
  "Tarnów",
  "Chorzów",
  "Kalisz",
  "Koszalin",
  "Legnica",
  "Grudziądz",
  "Słupsk",
  "Jaworzno",
  "Jastrzębie-Zdrój",
  "Częstochowa",
  "Gdynia",
  "Bielsko-Biała",
  "Olkusz",
  "Nowy Sącz",
  "Siedlce",
  "Piła",
  "Ostrów Wielkopolski",
]

export function CityAutocomplete({
  value,
  onChange,
  placeholder = "Miasto lub kod pocztowy...",
  className,
}: CityAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = polishCities.filter((city) => city.toLowerCase().includes(value.toLowerCase())).slice(0, 6)

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
    setHighlightedIndex(-1)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSuggestionClick = (city: string) => {
    onChange(city)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex])
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false)
      }
    }, 150)
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => value.length >= 2 && setShowSuggestions(suggestions.length > 0)}
          placeholder={placeholder}
          className={`pl-10 w-full ${className}`}
          autoComplete="off"
        />
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <button
              key={city}
              onClick={() => handleSuggestionClick(city)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                index === highlightedIndex ? "bg-pink-50 text-pink-700" : "text-gray-700"
              } ${index === 0 ? "rounded-t-lg" : ""} ${index === suggestions.length - 1 ? "rounded-b-lg" : ""}`}
            >
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
