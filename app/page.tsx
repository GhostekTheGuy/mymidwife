import NavigationBar from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { TestimonialsSlider } from "@/components/testimonials-slider"
import { BentoGridSection } from "@/components/bento-grid"
import { MidwifeBenefits } from "@/components/midwife-benefits"
import { CommunitySignup } from "@/components/community-signup"
import { Footer } from "@/components/footer"
import { DemoBanner } from "@/components/demo-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <main className="flex-1">
        <div className="pt-16">
          <HeroSection />
          <BentoGridSection />
          <MidwifeBenefits />
          <TestimonialsSlider />
          <CommunitySignup />
        </div>
        <DemoBanner />
      </main>
      <Footer />
    </div>
  )
}
