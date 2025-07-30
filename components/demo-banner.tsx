"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DemoBanner() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show modal after a short delay when component mounts
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pink-700">
            <Info className="h-5 w-5" />
            Tryb Demo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="border-pink-500 bg-pink-50 text-pink-700">
            <AlertDescription>
              Przeglądasz MyMidwife z danymi demonstracyjnymi. Wszystkie funkcje są w pełni interaktywne, ale nic nie
              jest zapisywane i nie są wymagane żadne dane osobowe.
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)} className="bg-pink-600 hover:bg-pink-700 text-white">
              Rozumiem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
