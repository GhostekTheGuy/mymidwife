import { AdvancedSearch } from "@/components/advanced-search"
import NavigationBar from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 pt-20">
        <AdvancedSearch />
      </div>
      <Footer />
    </div>
  )
}
