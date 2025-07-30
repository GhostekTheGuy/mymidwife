import { MidwifeProfile } from "@/components/midwife-profile"
import NavigationBar from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function MidwifeProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1 pt-20">
        <MidwifeProfile midwifeId={params.id} />
      </div>
      <Footer />
    </div>
  )
}
