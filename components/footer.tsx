"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && agreedToPrivacy) {
      console.log("Newsletter signup:", email)
      setEmail("")
      setAgreedToPrivacy(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platforma MyMidwife</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Znajdź położną
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Opieka prenatalna
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Poród prywatny
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Opieka poporodowa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Edukacja przedporodowa ( szkoła rodzenia )
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Wsparcie 24/7
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 - For Midwives */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Dla położnych</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Dołącz do platformy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Zarządzanie kalendarzem
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Profil położnej
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  System płatności
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Społeczność położnych
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Szkolenia i webinary
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Program partnerski
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Położne w Twoim mieście</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Warszawa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Kraków
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Gdańsk
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Wrocław
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Poznań
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Łódź
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Położne Katowice
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Social media</h3>
              <p className="text-gray-400 text-sm mb-4">
                Zajrzyj na nasze media społecznościowe! Bądź na bieżąco z nowościami i promocjami
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="bg-pink-500 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Dołącz do naszej społeczności!</h4>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Adres email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white text-gray-900 border-0 h-10"
                />
                <Button
                  type="submit"
                  disabled={!agreedToPrivacy}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white h-10 disabled:opacity-50"
                >
                  Zapisz się
                </Button>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="footer-privacy"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="mt-1 w-3 h-3 text-pink-600 bg-white border-gray-300 rounded focus:ring-pink-500"
                    required
                  />
                  <label htmlFor="footer-privacy" className="text-xs text-pink-100">
                    <a href="#" className="underline hover:no-underline">
                      Zgoda na przetwarzanie danych osobowych
                    </a>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">© 2024 - MyMidwife Sp. z o.o. Wszystkie prawa zastrzeżone</div>
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Regulamin
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Polityka prywatności
              </a>
              <div className="flex items-center gap-4">
                <a href="tel:+48123456789" className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <Phone className="w-4 h-4" />
                  123 456 789
                </a>
                <a
                  href="mailto:kontakt@mymidwife.pl"
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <Mail className="w-4 h-4" />
                  kontakt@mymidwife.pl
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
