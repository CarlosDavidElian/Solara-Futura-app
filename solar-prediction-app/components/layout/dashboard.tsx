"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Database, BarChart3, MapPin, LogOut, User } from "lucide-react"
import DataUpload from "../data/data-upload"
import PredictionForm from "../prediccion/prediction-form"
import ResultsDisplay from "../prediccion/results-display"
import JuninInfo from "../informacion/junin-info"

interface DashboardProps {
  onLogout: () => void
}

function DataSection({ uploadedData, setUploadedData }: { uploadedData: any[]; setUploadedData: (data: any[]) => void }) {
  return (
    <TabsContent value="upload">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gestión de Datos
          </CardTitle>
          <CardDescription>
            Carga tu archivo Excel con datos históricos de radiación solar, ozono y precipitaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataUpload uploadedData={uploadedData} onDataUploaded={setUploadedData} />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

function PredictionSection({ uploadedData, setPredictionResults }: { uploadedData: any[]; setPredictionResults: (results: any) => void }) {
  return (
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
  )
}

function ResultsSection({ predictionResults }: { predictionResults: any }) {
  return (
    <TabsContent value="results">
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
    </TabsContent>
  )
}

function InfoSection() {
  return (
    <TabsContent value="junin">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Departamento de Junín
          </CardTitle>
          <CardDescription>
            Información detallada sobre las características geográficas y climáticas de la región
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JuninInfo />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [predictionResults, setPredictionResults] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con información del usuario */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Predictor de Índice UV</h1>
              <p className="text-gray-600">Sistema de Predicción - Departamento de Junín</p>
            </div>
          </div>
        </div>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Cargar Datos
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Predicción
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="junin" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Información Junín
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestión de Datos
                </CardTitle>
                <CardDescription>
                  Carga tu archivo Excel con datos históricos de radiación solar, ozono y precipitaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataUpload uploadedData={uploadedData} onDataUploaded={setUploadedData} />
              </CardContent>
            </Card>
          </TabsContent>
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
          </TabsContent>
          <TabsContent value="junin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Departamento de Junín
                </CardTitle>
                <CardDescription>
                  Información detallada sobre las características geográficas y climáticas de la región
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JuninInfo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
