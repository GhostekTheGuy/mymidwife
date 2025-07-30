"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function CommunitySignup() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && agreedToPrivacy) {
      setIsSubmitted(true)
      // Here you would typically send the email to your backend
      console.log("Email submitted:", email)

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
        setAgreedToPrivacy(false)
      }, 3000)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-3xl p-8 md:p-12">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left Content - Title */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Dołącz do naszej społeczności!
              </h2>
            </div>

            {/* Right Content - Form */}
            <div className="lg:col-span-2">
              {!isSubmitted ? (
                <div>
                  <p className="text-pink-100 text-lg mb-6 leading-relaxed">
                    Zapisz się do newslettera MyMidwife i otrzymuj najnowsze informacje o platformie, ekskluzywne porady
                    dla położnych oraz zaproszenia na wydarzenia branżowe.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Adres email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                      <Button
                        type="submit"
                        size="lg"
                        disabled={!agreedToPrivacy}
                        className="bg-pink-500 hover:bg-pink-600 text-white h-12 px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Zapisz się
                      </Button>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="privacy-consent"
                        checked={agreedToPrivacy}
                        onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        className="mt-1 w-4 h-4 text-pink-600 bg-white border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                        required
                      />
                      <label
                        htmlFor="privacy-consent"
                        className="text-sm text-pink-100 leading-relaxed flex items-center gap-1"
                      >
                        Zgoda na przetwarzanie danych osobowych
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </label>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                  <h3 className="text-white font-semibold text-lg mb-2">Dziękujemy!</h3>
                  <p className="text-pink-100">Wkrótce otrzymasz od nas wiadomość na podany adres email.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
