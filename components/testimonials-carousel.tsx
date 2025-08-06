"use client"

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

const testimonials = [
  {
    quote:
      "Dzięki MyMidwife znalazłam wspaniałą położną, która towarzyszyła mi przez całą ciążę. Profesjonalizm i empatia na najwyższym poziomie. Czułam się bezpiecznie przez cały okres.",
    name: "Anna Kowalska",
    title: "Warszawa • Opieka prenatalna",
  },
  {
    quote:
      "Aplikacja bardzo intuicyjna, a możliwość bezpośredniego kontaktu z położną to ogromne ułatwienie. Polecam każdej przyszłej mamie! System rezerwacji działa bez zarzutu.",
    name: "Magdalena Nowak",
    title: "Kraków • Poród prywatny",
  },
  {
    quote:
      "Fantastyczne wsparcie w okresie poporodowym. Położna była zawsze dostępna i udzielała cennych rad. Czuję się bezpiecznie i mogę liczyć na profesjonalną pomoc.",
    name: "Katarzyna Wiśniewska",
    title: "Gdańsk • Opieka poporodowa",
  },
  {
    quote:
      "Dzienniczek objawów pomógł mi lepiej zrozumieć moje ciało. Położna mogła lepiej dostosować opiekę do moich potrzeb. To naprawdę zmienia sposób opieki medycznej.",
    name: "Joanna Kaczmarek",
    title: "Wrocław • Edukacja przedporodowa ( szkoła rodzenia )",
  },
  {
    quote:
      "Szybko znalazłam położną w mojej okolicy. System rezerwacji wizyt działa bez zarzutu. Bardzo polecam wszystkim kobietom szukającym profesjonalnej opieki.",
    name: "Monika Lewandowska",
    title: "Poznań • Opieka prenatalna",
  },
  {
    quote:
      "Wsparcie 24/7 i możliwość szybkiego kontaktu w nagłych przypadkach. MyMidwife daje poczucie bezpieczeństwa, którego potrzebowałam podczas ciąży.",
    name: "Agnieszka Zielińska",
    title: "Łódź • Opieka kompleksowa",
  },
  {
    quote:
      "Edukacyjne materiały i webinary pomogły mi przygotować się do porodu. Położna była cierpliwa i odpowiadała na wszystkie moje pytania.",
    name: "Paulina Dąbrowska",
    title: "Szczecin • Przygotowanie do porodu",
  },
]

export function TestimonialsCarousel() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 tracking-tight">
            Co mówią nasze <span className="text-pink-500">użytkowniczki</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prawdziwe opinie od kobiet, które skorzystały z naszej platformy
          </p>
        </div>

        <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <span className="text-sm">Zweryfikowane opinie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              <span className="text-sm">Tylko po wizytach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm">100% autentyczne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
