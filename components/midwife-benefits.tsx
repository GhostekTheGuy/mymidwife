"use client"

import { Check, Users, Calendar, Star } from "lucide-react"

export function MidwifeBenefits() {
  const benefits = [
    {
      text: "Zwiększ swoją widoczność wśród tysięcy kobiet szukających profesjonalnej opieki położniczej. Łatwo dotrzesz do nowych pacjentek w Twojej okolicy.",
    },
    {
      text: "Elastyczne zarządzanie kalendarzem wizyt z jednej strony - niezależność w planowaniu, z drugiej pomoc w organizacji codziennego chaosu.",
    },
    {
      text: "MyMidwife to także społeczność - nie będziesz sama ze swoimi wyzwaniami, wymianą doświadczeń i rozwojem zawodowym.",
    },
  ]

  const features = [
    {
      icon: Users,
      title: "Więcej pacjentek",
      color: "bg-purple-100 text-purple-600",
      bgColor: "bg-purple-500",
    },
    {
      icon: Calendar,
      title: "Pełna kontrola",
      color: "bg-pink-100 text-pink-600",
      bgColor: "bg-pink-500",
    },
    {
      icon: Star,
      title: "Program partnerski",
      color: "bg-orange-100 text-orange-600",
      bgColor: "bg-orange-500",
    },
  ]

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 leading-tight">
              Szybko, prosto, <span className="text-pink-500">MyMidwife</span>
            </h2>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Background Images */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/midwife-consultation.png"
                    alt="Położna z pacjentką podczas konsultacji"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/pregnancy-support.png"
                    alt="Wsparcie podczas ciąży"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl overflow-hidden">
                  <img src="/images/prenatal-care.png" alt="Opieka prenatalna" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
                  <img
                    src="/images/postpartum-care.png"
                    alt="Opieka poporodowa i wsparcie zdrowotne"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Feature Badges */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-lg border border-gray-100 mr-3"
                  >
                    <div className={`w-8 h-8 rounded-full ${feature.bgColor} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{feature.title}</span>
                  </div>
                )
              })}
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-pulse" />
            <div className="absolute top-1/2 -left-4 w-2 h-2 bg-purple-400 rounded-full opacity-40 animate-bounce" />
            <div className="absolute -bottom-4 right-1/3 w-2.5 h-2.5 bg-orange-400 rounded-full opacity-50 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
