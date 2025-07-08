"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Database, BarChart3 } from "lucide-react"
import DataUpload from "@/components/data/data-upload"
import PredictionForm from "@/components/prediccion/prediction-form"
import ResultsDisplay from "@/components/prediccion/results-display"
import Dashboard from "@/components/layout/dashboard"

export default function SolarPredictionApp() {
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [predictionResults, setPredictionResults] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Predictor de Radiación Solar</h1>
          </div>
          <p className="text-lg text-gray-600">
            Sistema de predicción para Radiación UV, Ozono (O₃) y Precipitaciones - Departamento de Junín
          </p>
        </div>

        <Dashboard onLogout={() => {}} />

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">            
            <CardDescription>
                  SOLARA FURUTA
                </CardDescription>            
          </TabsList>

          
          <TabsContent value="prediction">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Predicción Solar
                </CardTitle>
                <CardDescription>
                  Selecciona la fecha para generar predicciones usando modelos matemáticos especializados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PredictionForm uploadedData={uploadedData} onPredictionComplete={setPredictionResults} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resultados de Predicción
                  </CardTitle>
                  <CardDescription>
                    Análisis detallado con modelo LSTM y recomendaciones para el Departamento de Junín
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsDisplay results={predictionResults} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
