"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DemoAccountSwitcher } from "@/components/auth/demo-account-switcher"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/hooks/use-auth"
import { CityAutocomplete } from "@/components/city-autocomplete"
import { LottieIcon } from "./lottie-icon"

export default function NavigationBar() {
  const router = useRouter()

  /* UI state -------------------------------------------------------------- */
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false)

  /* Auth state ------------------------------------------------------------ */
  const { user, getDemoAccountType, isMidwife } = useAuth()

  /* Search state ---------------------------------------------------------- */
  const [cityQuery, setCityQuery] = React.useState("")

  /* Handlers -------------------------------------------------------------- */
  const handleSearch = () => {
    if (!cityQuery) return
    router.push(`/search?city=${encodeURIComponent(cityQuery)}`)
    setIsMenuOpen(false)
    setIsSearchModalOpen(false)
  }

  const handleMobileSearchClick = () => {
    setIsSearchModalOpen(true)
  }

  // Określ odpowiedni link do dashboardu na podstawie roli
  const getDashboardLink = () => {
    if (isMidwife()) {
      return "/demo/midwife-dashboard"
    }
    return "/dashboard"
  }

  /* JSX ------------------------------------------------------------------- */
  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ---------------------------------------------------------------- */}
          {/* Logo                                                            */}
          {/* ---------------------------------------------------------------- */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500">
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <span className="font-semibold text-gray-900">MyMidwife</span>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">DEMO</span>
          </Link>

          {/* ---------------------------------------------------------------- */}
          {/* Desktop search & filters                                        */}
          {/* ---------------------------------------------------------------- */}
          <div className="mx-4 hidden flex-1 max-w-4xl items-center space-x-3 lg:flex">
            <CityAutocomplete
              value={cityQuery}
              onChange={setCityQuery}
              placeholder="Miasto lub kod pocztowy..."
              className="h-10 flex-1 min-w-[400px] border-gray-200"
            />

            <Button className="h-10 bg-pink-500 px-6 text-white hover:bg-pink-600 whitespace-nowrap" onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Znajdź położną
            </Button>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Desktop demo switcher and user menu                             */}
          {/* ---------------------------------------------------------------- */}
          <div className="hidden items-center space-x-3 lg:flex">
            <DemoAccountSwitcher />
            {user && getDemoAccountType !== "guest" && (
              <>
                <Link href={getDashboardLink()} passHref>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isMidwife() ? "Panel Położnej" : "Panel Pacjentki"}
                    className="h-10 w-10 bg-pink-300 shadow-inner hover:bg-pink-500 rounded-lg transition-colors"
                  >
                    <LottieIcon />
                  </Button>
                </Link>
                <UserMenu />
              </>
            )}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Mobile navigation icons                                          */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex items-center space-x-3 lg:hidden">
            {/* Search icon */}
            <button
              onClick={handleMobileSearchClick}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Szukaj położnych"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Patient panel icon */}
            {user && getDemoAccountType !== "guest" && (
              <Link href={getDashboardLink()}>
                <button
                  className="p-2 bg-pink-300 shadow-inner hover:bg-pink-500 rounded-lg transition-colors"
                  aria-label={isMidwife() ? "Panel Położnej" : "Panel Pacjentki"}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <LottieIcon />
                  </div>
                </button>
              </Link>
            )}

            {/* Menu toggle */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile menu                                                       */}
        {/* ------------------------------------------------------------------ */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 pb-4 pt-4 lg:hidden">
            <div className="space-y-4 px-4">
              <div className="space-y-3">
                <DemoAccountSwitcher />
                {user && getDemoAccountType !== "guest" && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Zalogowany jako:</span>
                    <UserMenu />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* -------------------------------------------------------------------- */}
      {/* Mobile Search Modal                                                 */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-md top-20">
          <DialogHeader>
            <DialogTitle>Szukaj położnych</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <CityAutocomplete
              value={cityQuery}
              onChange={setCityQuery}
              placeholder="Miasto lub kod pocztowy..."
              className="h-12 w-full border-gray-200 text-base"
              autoFocus
            />
            <Button
              className="w-full h-12 bg-pink-500 text-white hover:bg-pink-600 text-base"
              onClick={handleSearch}
              disabled={!cityQuery}
            >
              <Search className="w-5 h-5 mr-2" />
              Znajdź położną
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
