"use client"

import { useState } from "react"
import { TunerForm } from "@/components/forms/tuner-form"
import type { TunerFormData } from "@/validators/tuner-form"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleFormSubmit = async (data: TunerFormData) => {
    setIsLoading(true)
    try {
      console.log("Form data:", data)
      
      // TODO: Implement API call to timescaledb-tune
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setResult("Configuration generated successfully! (This is a placeholder)")
    } catch (error) {
      console.error("Error:", error)
      setResult("Error generating configuration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">TimescaleDB Tuner</h1>
        <p className="text-lg text-muted-foreground">
          Optimize your TimescaleDB configuration for better performance
        </p>
      </div>

      <div className="mb-8">
        <TunerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>

      {result && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration Result</h2>
            <pre className="text-sm bg-muted p-4 rounded overflow-auto">
              {result}
            </pre>
          </div>
        </div>
      )}
    </main>
  )
}
