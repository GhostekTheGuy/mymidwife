"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const testimonials = [
  {
    quote:
      "Dzięki MyMidwife znalazłam wspaniałą położną, która towarzyszyła mi przez całą ciążę. Profesjonalizm na najwyższym poziomie. Czułam się bezpiecznie przez cały okres.",
    name: "Anna Kowalska",
    title: "Warszawa • Opieka prenatalna",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Aplikacja bardzo intuicyjna, a możliwość bezpośredniego kontaktu z położną to ogromne ułatwienie. Polecam każdej przyszłej mamie! System rezerwacji działa bez zarzutu.",
    name: "Magdalena Nowak",
    title: "Kraków • Poród prywatny",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Fantastyczne wsparcie w okresie poporodowym. Położna była zawsze dostępna i udzielała cennych rad. Czuję się bezpiecznie i mogę liczyć na profesjonalną pomoc.",
    name: "Katarzyna Wiśniewska",
    title: "Gdańsk • Opieka poporodowa",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Dzienniczek objawów pomógł mi lepiej zrozumieć moje ciało. Położna mogła lepiej dostosować opiekę do moich potrzeb. To naprawdę zmienia sposób opieki medycznej.",
    name: "Joanna Kaczmarek",
    title: "Wrocław • Edukacja przedporodowa",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Szybko znalazłam położną w mojej okolicy. System rezerwacji wizyt działa bez zarzutu. Bardzo polecam wszystkim kobietom szukającym profesjonalnej opieki.",
    name: "Monika Lewandowska",
    title: "Poznań • Opieka prenatalna",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Wsparcie 24/7 i możliwość szybkiego kontaktu w nagłych przypadkach. MyMidwife daje poczucie bezpieczeństwa, którego potrzebowałam podczas ciąży.",
    name: "Agnieszka Zielińska",
    title: "Łódź • Opieka kompleksowa",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    quote:
      "Edukacyjne materiały i webinary pomogły mi przygotować się do porodu. Położna była cierpliwa i odpowiadała na wszystkie moje pytania.",
    name: "Paulina Dąbrowska",
    title: "Szczecin • Przygotowanie do porodu",
    image: "/placeholder.svg?height=48&width=48",
  },
]

export function TestimonialsSlider() {
  const [startAnimation, setStartAnimation] = useState(false)

  useEffect(() => {
    // Start animation after 2 seconds
    const timer = setTimeout(() => {
      setStartAnimation(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Create extended array for infinite loop
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials]

  return (
    <section className="py-8 bg-gray-50">
      <div className="h-[320px] flex flex-col antialiased items-center justify-center relative overflow-hidden">
        <div className="relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
          <motion.div
            className="flex gap-4 py-4"
            animate={
              startAnimation
                ? {
                    x: [0, -100 * testimonials.length - testimonials.length * 16], // Move by full width of original testimonials + gaps
                  }
                : {}
            }
            transition={
              startAnimation
                ? {
                    duration: 60, // 60 seconds for full cycle
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
                : {}
            }
            style={{
              width: "max-content",
            }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-white px-8 py-6 shadow-sm md:w-[450px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index < 3 ? index * 0.2 : 0, duration: 0.5 }}
              >
                <blockquote>
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg?height=48&width=48"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-[1.6]">{testimonial.name}</h3>
                      <p className="text-xs leading-[1.6] text-gray-500">{testimonial.title}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="relative z-20 text-sm leading-[1.6] font-normal text-neutral-600">
                    {testimonial.quote}
                  </span>
                </blockquote>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
