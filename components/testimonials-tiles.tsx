"use client"

const testimonials = [
  {
    quote:
      "Dzięki MyMidwife znalazłam wspaniałą położną, która towarzyszyła mi przez całą ciążę. Profesjonalizm na najwyższym poziomie.",
    name: "Anna Kowalska",
    location: "Warszawa",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
  {
    quote:
      "Aplikacja bardzo intuicyjna, a możliwość bezpośredniego kontaktu z położną to ogromne ułatwienie. Polecam każdej przyszłej mamie!",
    name: "Magdalena Nowak",
    location: "Kraków",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
  {
    quote: "Fantastyczne wsparcie w okresie poporodowym. Położna była zawsze dostępna i udzielała cennych rad.",
    name: "Katarzyna Wiśniewska",
    location: "Gdańsk",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
  {
    quote:
      "Dzienniczek objawów pomógł mi lepiej zrozumieć moje ciało. Położna mogła lepiej dostosować opiekę do moich potrzeb.",
    name: "Joanna Kaczmarek",
    location: "Wrocław",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
  {
    quote: "Szybko znalazłam położną w mojej okolicy. System rezerwacji wizyt działa bez zarzutu.",
    name: "Monika Lewandowska",
    location: "Poznań",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
  {
    quote:
      "Wsparcie 24/7 i możliwość szybkiego kontaktu w nagłych przypadkach. MyMidwife daje poczucie bezpieczeństwa.",
    name: "Agnieszka Zielińska",
    location: "Łódź",
    image: "/images/pregnancy-support.png",
    rating: 5,
  },
]

export function TestimonialsTiles() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={testimonial.image || "/images/pregnancy-support.png"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h3>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
