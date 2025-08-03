"use client"

import { cn } from "@/lib/utils"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Search, Calendar, MessageCircle, FileText, BookOpen, Bell, Heart, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// Animated skeleton components for each feature
const SearchSkeleton = () => {
  const variants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-3 p-2"
    >
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-3">
        <Search className="w-4 h-4 text-gray-400" />
        <div className="flex-1 text-sm text-gray-600">Warszawa, opieka prenatalna</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-8 bg-pink-100 rounded-lg flex items-center justify-center">
          <div className="text-xs text-pink-600 font-medium">15 km</div>
        </div>
        <div className="h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <div className="text-xs text-green-600 font-medium">Dostępna</div>
        </div>
      </div>
      <div className="text-xs text-gray-500">127 położnych w okolicy</div>
    </motion.div>
  )
}

const CalendarSkeleton = () => {
  const variants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 p-2">
      <div className="text-xs text-gray-600 mb-2">Marzec 2024</div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <motion.div
            key={i}
            variants={variants}
            initial="initial"
            animate="animate"
            style={{ animationDelay: `${i * 0.1}s` }}
            className={cn(
              "h-6 rounded flex items-center justify-center text-xs",
              i === 10 ? "bg-pink-500 text-white" : i === 5 || i === 15 ? "bg-pink-100 text-pink-600" : "bg-gray-100",
            )}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">3 dostępne terminy w tym tygodniu</div>
    </motion.div>
  )
}

const ChatSkeleton = () => {
  const variants = {
    initial: { x: 0 },
    animate: {
      x: [0, 5, 0],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 p-2">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2 ml-auto max-w-[80%]"
      >
        <div className="text-xs text-gray-600">Czy mogę umówić wizytę?</div>
        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </motion.div>
      <div className="flex items-center space-x-2 bg-pink-50 rounded-lg p-2 max-w-[80%]">
        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        <div className="text-xs text-gray-600">Oczywiście! Mam wolny termin jutro o 14:00</div>
      </div>
      <div className="text-xs text-gray-400 text-center">Średni czas odpowiedzi: 5 min</div>
    </motion.div>
  )
}

const JournalSkeleton = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 p-2">
      <div className="text-xs text-gray-600 mb-2">Dzisiejsze wpisy</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="text-xs text-gray-600">Samopoczucie: bardzo dobre</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="text-xs text-gray-600">Energia: średnia</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="text-xs text-gray-600">Sen: 7 godzin</div>
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      </div>
      <div className="text-xs text-gray-400">Seria: 12 dni</div>
    </motion.div>
  )
}

const EducationSkeleton = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 p-2">
      <div className="flex items-center space-x-2 mb-2">
        <BookOpen className="w-4 h-4 text-pink-500" />
        <div className="text-xs text-gray-600 font-medium">Najnowsze artykuły</div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="h-8 bg-pink-50 rounded-lg border border-pink-200 flex items-center px-2">
          <div className="text-xs text-pink-700">Przygotowanie do porodu</div>
        </div>
        <div className="h-8 bg-blue-50 rounded-lg border border-blue-200 flex items-center px-2">
          <div className="text-xs text-blue-700">Karmienie piersią</div>
        </div>
      </div>
      <div className="text-xs text-gray-400">+23 nowe materiały</div>
    </motion.div>
  )
}

const NotificationsSkeleton = () => {
  const variants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
    },
  }

  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 p-2">
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="flex items-center space-x-2 bg-pink-50 border border-pink-200 rounded-lg p-2"
      >
        <Bell className="w-4 h-4 text-pink-500" />
        <div className="text-xs text-pink-700">Wizyta jutro o 10:00</div>
      </motion.div>
      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
        <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
        <div className="text-xs text-gray-600">Badania za ~3 dni</div>
      </div>
      <div className="text-xs text-gray-400">2 aktywne przypomnienia</div>
    </motion.div>
  )
}

const HealthSkeleton = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col items-center justify-center p-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="relative w-16 h-16 mb-2"
      >
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent" />
        <Heart className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
      </motion.div>
      <div className="text-xs text-gray-900 font-medium">Cykl: 28 dni</div>
      <div className="text-xs text-gray-500 text-center">Następna owulacja za ~12 dni</div>
    </motion.div>
  )
}

const PremiumSkeleton = () => {
  return (
    <motion.div
      initial={{ background: "linear-gradient(45deg, #f3f4f6, #f9fafb)" }}
      animate={{
        background: [
          "linear-gradient(45deg, #f3f4f6, #f9fafb)",
          "linear-gradient(45deg, #fdf2f8, #fef7ff)",
          "linear-gradient(45deg, #f3f4f6, #f9fafb)",
        ],
      }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col items-center justify-center p-4 rounded-lg"
    >
      <Crown className="w-8 h-8 text-pink-500 mb-2" />
      <Badge className="bg-pink-500 text-white mb-2">Premium</Badge>
      <div className="text-xs text-gray-600 text-center">Wyróżnij swój profil</div>
      <div className="text-xs text-gray-500 text-center">+40% więcej wizyt</div>
    </motion.div>
  )
}

const items = [
  {
    title: "Filtry i wyszukiwanie",
    description: "Znajdź położną według lokalizacji, specjalizacji i dostępności",
    header: <SearchSkeleton />,
    className: "md:col-span-2",
    icon: <Search className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Kalendarz wizyt",
    description: "Sprawdzaj dostępność i umów wizyty online",
    header: <CalendarSkeleton />,
    className: "md:col-span-1",
    icon: <Calendar className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Chat i kontakt",
    description: "Bezpośredni kontakt z położną",
    header: <ChatSkeleton />,
    className: "md:col-span-1",
    icon: <MessageCircle className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Dzienniczek objawów",
    description: "Śledź swoje samopoczucie i objawy",
    header: <JournalSkeleton />,
    className: "md:col-span-1",
    icon: <FileText className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Edukacja",
    description: "Artykuły i porady ekspertów",
    header: <EducationSkeleton />,
    className: "md:col-span-1",
    icon: <BookOpen className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Przypomnienia",
    description: "Alerty o wizytach i badaniach",
    header: <NotificationsSkeleton />,
    className: "md:col-span-1",
    icon: <Bell className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Śledzenie zdrowia",
    description: "Monitor cyklu i samopoczucia",
    header: <HealthSkeleton />,
    className: "md:col-span-1",
    icon: <Heart className="h-4 w-4 text-pink-500" />,
  },
  {
    title: "Strefa Premium",
    description: "Dodatkowe narzędzia i promocja profilu",
    header: <PremiumSkeleton />,
    className: "md:col-span-1",
    icon: <Crown className="h-4 w-4 text-pink-500" />,
  },
]

export function BentoGridSection() {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
            Wszystko czego potrzebujesz <span className="text-pink-500">w jednej aplikacji</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kompleksowe narzędzia do zarządzania opieką położniczą i monitorowania zdrowia
          </p>
        </div>

        <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}
