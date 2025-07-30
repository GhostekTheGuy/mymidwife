"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, Sparkles } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50 pt-20 pb-8">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-gray-400 rounded-full opacity-40 animate-bounce" />
        <div className="absolute bottom-40 left-20 w-2.5 h-2.5 bg-pink-500 rounded-full opacity-50 animate-pulse" />
        <div className="absolute top-60 right-40 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-30 animate-bounce" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-left">
          <div className="mb-6">
            <div className="inline-flex items-center bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4 mr-2" />
              Ponad 500+ położnych w całej Polsce
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 leading-tight tracking-tight">
              Znajdź położną
              <br />
              <span className="text-pink-500 relative underline decoration-pink-200 decoration-4 underline-offset-4">
                idealną dla siebie
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-xl leading-relaxed">
              Profesjonalna opieka położnicza dostosowana do Twoich potrzeb.
            </p>
          </div>

          {/* Quick Search */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              size="lg"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 text-base h-12 rounded-xl"
              onClick={() => router.push("/search")}
            >
              Znajdź położną
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 px-6 py-3 text-base h-12 rounded-xl bg-transparent"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Wyróżnij się jako położna
            </Button>
          </div>

          {/* Stats under buttons */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-pink-200 rounded-full border-2 border-white" />
                <div className="w-6 h-6 bg-purple-200 rounded-full border-2 border-white" />
                <div className="w-6 h-6 bg-blue-200 rounded-full border-2 border-white" />
              </div>
              <span className="font-medium text-gray-900">2,500+</span>
              <span>zadowolonych mam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-gray-900">28</span>
              <span>dostępnych teraz</span>
            </div>
          </div>
        </div>

        {/* Right Content - Lottie Animation */}
        <div className="relative flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/d0ff7847-e295-426a-b21e-0f650053fecd/8BRjiu3KzU.lottie"
            loop
            autoplay
            className="w-full h-full scale-[1.7] max-w-none my-14"
            style={{ minHeight: "100%" }}
          />
        </div>
      </div>
    </section>
  )
}
