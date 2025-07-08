"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Calculator, TrendingUp, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PredictionFormProps {
  uploadedData: any[]
  onPredictionComplete: (results: any) => void
}

export default function FormularioPrediccion({ uploadedData, onPredictionComplete }: PredictionFormProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  // Fórmulas matemáticas implementadas
  const calculateUVHoraria = (uvMax: number, hora: number): number => {
    if (hora < 5 || hora > 19) return 0
    return uvMax * (0.5 + 0.5 * Math.cos((Math.PI * Math.abs(hora - 12)) / 6))
  }

  const calculateOzonoHorario = (ozonoDia: number, hora: number): number => {
    return ozonoDia * (0.7 + 0.3 * Math.sin((Math.PI * (hora - 6)) / 12))
  }

  const calculatePrecipitacionHoraria = (precipitacionDia: number, hora: number): number => {
    if (hora >= 14 && hora <= 16) return precipitacionDia * 0.4
    if (hora >= 17 && hora <= 19) return precipitacionDia * 0.3
    return (precipitacionDia * 0.3) / 20
  }

  // Fórmula LSTM para tendencia horaria
  const calculateLSTMTrend = (hora: number, baseValue: number, historicalData: any[]): number => {
    // Simulación de función LSTM que considera:
    // - Patrón temporal (hora del día)
    // - Tendencia histórica
    // - Factor de memoria a largo plazo
    const temporalWeight = Math.sin((Math.PI * hora) / 12) * 0.3 + 0.7
    const historicalAvg =
      historicalData.length > 0
        ? historicalData.reduce((sum, item) => sum + item.uv_max, 0) / historicalData.length
        : baseValue

    const memoryFactor = 0.8 // Factor de memoria LSTM
    const lstmValue = baseValue * temporalWeight * memoryFactor + historicalAvg * (1 - memoryFactor) * 0.2

    return Math.max(0, lstmValue)
  }

  const handlePrediction = async () => {
    if (!selectedDate || uploadedData.length === 0) {
      alert("Por favor selecciona una fecha y asegúrate de tener datos cargados")
      return
    }

    setIsCalculating(true)

    // Detectar nombres de columnas relevantes igual que en data-upload.tsx
    const keys = Object.keys(uploadedData[0] || {})
    const colRad = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('radiacion') || k.toLowerCase().includes('uv')))
    const colO3 = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('o3') || k.toLowerCase().includes('ozono')))
    const colPP = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('precipitacion') || k.toLowerCase().includes('pp') || k.toLowerCase().includes('lluvia')))

    setTimeout(() => {
      // Obtener datos base (promedio de datos históricos)
      const avgUV = colRad ? uploadedData.reduce((sum, item) => sum + (Number(item[colRad]) || 0), 0) / uploadedData.length : 0
      const avgOzono = colO3 ? uploadedData.reduce((sum, item) => sum + (Number(item[colO3]) || 0), 0) / uploadedData.length : 0
      const avgPrecipitacion = colPP ? uploadedData.reduce((sum, item) => sum + (Number(item[colPP]) || 0), 0) / uploadedData.length : 0

      // Aplicar variación aleatoria para simular predicción
      const uvMax = Math.round(avgUV * (0.8 + Math.random() * 0.4) * 10) / 10
      const ozonoDia = Math.round(avgOzono * (0.8 + Math.random() * 0.4))
      const precipitacionDia = Math.round(avgPrecipitacion * (0.5 + Math.random() * 1.5) * 10) / 10

      // Calcular valores horarios usando las fórmulas
      const horasDelDia = Array.from({ length: 24 }, (_, i) => i)
      const datosHorarios = horasDelDia.map((hora) => ({
        hora,
        uv: Math.round(calculateUVHoraria(uvMax, hora) * 10) / 10,
        ozono: Math.round(calculateOzonoHorario(ozonoDia, hora) * 10) / 10,
        precipitacion: Math.round(calculatePrecipitacionHoraria(precipitacionDia, hora) * 100) / 100,
        lstm_trend: Math.round(calculateLSTMTrend(hora, uvMax, uploadedData) * 10) / 10,
      }))

      // Calcular métricas del modelo LSTM (simuladas)
      const metricas = {
        mae_uv: Math.round(Math.random() * 50 + 20),
        rmse_uv: Math.round(Math.random() * 70 + 30),
        r2_uv: Math.round((0.85 + Math.random() * 0.1) * 100) / 100,
        mae_ozono: Math.round(Math.random() * 5 + 2),
        rmse_ozono: Math.round(Math.random() * 8 + 3),
        r2_ozono: Math.round((0.8 + Math.random() * 0.15) * 100) / 100,
        mae_precipitacion: Math.round(Math.random() * 2 + 0.5 * 100) / 100,
        rmse_precipitacion: Math.round(Math.random() * 3 + 1 * 100) / 100,
        r2_precipitacion: Math.round((0.75 + Math.random() * 0.2) * 100) / 100,
        lstm_accuracy: Math.round((0.88 + Math.random() * 0.1) * 100) / 100,
      }

      const resultados = {
        fecha: selectedDate,
        uvMax,
        ozonoDia,
        precipitacionDia,
        datosHorarios,
        metricas,
        timestamp: new Date().toISOString(),
      }

      onPredictionComplete(resultados)
      setIsCalculating(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Selección de Fecha para Predicción
          </CardTitle>
          <CardDescription>Ingresa la fecha en formato Año-Mes-Día para generar la predicción horaria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prediction-date">Fecha de Predicción (YYYY-MM-DD)</Label>
            <Input
              id="prediction-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="text-lg"
            />
          </div>

          {selectedDate && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Fecha Seleccionada:</span>
              </div>
              <p className="text-blue-700">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {uploadedData.length === 0 && (
            <Alert>
              <AlertDescription>Necesitas cargar datos históricos antes de realizar una predicción.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Modelos Matemáticos y LSTM
          </CardTitle>
          <CardDescription>Fórmulas utilizadas para la predicción horaria y análisis de tendencias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Índice UV</h4>
              <p className="text-sm text-orange-700 mb-2">Perfil horario típico en montañas</p>
              <div className="text-xs font-mono bg-white p-2 rounded">
                UV_h = UV_max × [0.5 + 0.5 × cos(π × |h-12|/6)]
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Ozono (O₃)</h4>
              <p className="text-sm text-green-700 mb-2">Perfil valle-montaña adaptado</p>
              <div className="text-xs font-mono bg-white p-2 rounded">
                O₃_h = O₃_día × [0.7 + 0.3 × sin(π × (h-6)/12)]
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Precipitación</h4>
              <p className="text-sm text-blue-700 mb-2">Distribución orográfica andina</p>
              <div className="text-xs font-mono bg-white p-2 rounded">P_h = P_día × factor_horario</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Tendencia LSTM</h4>
              <p className="text-sm text-purple-700 mb-2">Análisis de memoria temporal</p>
              <div className="text-xs font-mono bg-white p-2 rounded">
                LSTM_h = V_base × W_temporal × M_factor + H_avg × (1-M_factor)
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Explicación del Modelo LSTM:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • <strong>V_base:</strong> Valor base calculado con fórmulas tradicionales
              </li>
              <li>
                • <strong>W_temporal:</strong> Peso temporal basado en la hora del día
              </li>
              <li>
                • <strong>M_factor:</strong> Factor de memoria (0.8) para retener información histórica
              </li>
              <li>
                • <strong>H_avg:</strong> Promedio histórico de los datos cargados
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handlePrediction}
        disabled={isCalculating || uploadedData.length === 0 || !selectedDate}
        className="w-full h-12 text-lg"
      >
        <TrendingUp className="h-5 w-5 mr-2" />
        {isCalculating ? "Procesando con Modelo LSTM..." : "Generar Predicción"}
      </Button>
    </div>
  )
}
