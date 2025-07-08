"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Sun, Shield, Droplets, TrendingUp, AlertTriangle, CheckCircle, Info, Brain } from "lucide-react"

interface ResultsDisplayProps {
  results: any
}

export default function ResultadosDisplay({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay resultados disponibles</h3>
        <p className="text-gray-500">Realiza una predicción para ver los resultados aquí</p>
      </div>
    )
  }

  const getUVRecommendations = (maxUV: number) => {
    if (maxUV < 3) {
      return {
        level: "Bajo",
        color: "green",
        icon: CheckCircle,
        recommendations: [
          "Condiciones seguras para actividades al aire libre",
          "No se requiere protección especial",
          "Ideal para actividades agrícolas y turísticas",
        ],
      }
    } else if (maxUV < 6) {
      return {
        level: "Moderado",
        color: "yellow",
        icon: Info,
        recommendations: [
          "Usar protector solar SPF 30+",
          "Usar sombrero y gafas de sol",
          "Evitar exposición prolongada entre 10am-4pm",
        ],
      }
    } else if (maxUV < 8) {
      return {
        level: "Alto",
        color: "orange",
        icon: AlertTriangle,
        recommendations: [
          "Protección solar obligatoria",
          "Buscar sombra durante las horas pico",
          "Usar ropa protectora de manga larga",
          "Aplicar protector solar cada 2 horas",
        ],
      }
    } else {
      return {
        level: "Muy Alto",
        color: "red",
        icon: AlertTriangle,
        recommendations: [
          "¡EXTREMA PRECAUCIÓN!",
          "Evitar actividades al aire libre entre 10am-4pm",
          "Protección solar máxima obligatoria",
          "Mantenerse en interiores si es posible",
          "Riesgo alto de quemaduras solares",
        ],
      }
    }
  }

  const uvInfo = getUVRecommendations(results.uvMax)
  const IconComponent = uvInfo.icon

  // Utilidad para obtener el valor correcto de una variable con varios nombres posibles
  function getVar(obj: any, keys: string[], decimals = 2) {
    for (const k of keys) {
      if (typeof obj[k] === 'number' && !isNaN(obj[k])) return obj[k].toFixed(decimals)
    }
    return null
  }

  // Obtener valores principales
  const uvValue = getVar(results, ['radiacionMax', 'uvMax', 'radiacion', 'uv_max', 'radiacion_max', 'maxRad'])
  const o3Value = getVar(results, ['ozonoDia', 'o3', 'o3_dia', 'ozono', 'maxO3'])
  const ppValue = getVar(results, ['precipitacionDia', 'precipitacion', 'pp', 'precipitacion_dia', 'maxPP'])

  const allEmpty = !uvValue && !o3Value && !ppValue

  return (
    <div className="space-y-6">
      {/* Alerta general si no hay datos */}
      {allEmpty && (
        <Alert variant="destructive">
          <AlertDescription>
            No hay datos suficientes para mostrar los resultados. Por favor, carga datos válidos y realiza una predicción.
          </AlertDescription>
        </Alert>
      )}
      {/* Resumen de Predicción */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Sun className="h-5 w-5" />
              Índice UV Máximo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {uvValue !== null ? uvValue : <span className="text-sm text-red-500">No hay datos suficientes</span>}
            </div>
            <Badge
              variant={uvInfo.color === "green" ? "default" : uvInfo.color === "red" ? "destructive" : "secondary"}
            >
              Nivel {uvInfo.level}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Shield className="h-5 w-5" />
              Ozono (O₃)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {o3Value !== null ? `${o3Value} µg/m³` : <span className="text-sm text-red-500">No hay datos suficientes</span>}
            </div>
            <Badge variant="outline">Promedio Diario</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Droplets className="h-5 w-5" />
              Precipitación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {ppValue !== null ? `${ppValue} mm` : <span className="text-sm text-red-500">No hay datos suficientes</span>}
            </div>
            <Badge variant="outline">Total Diario</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Brain className="h-5 w-5" />
              Precisión LSTM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(results.metricas.lstm_accuracy * 100)}%
            </div>
            <Badge variant="outline">Confiabilidad</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolución Horaria con LSTM */}
      <Card>
        <CardHeader>
          <CardTitle>Predicción Horaria con Análisis LSTM</CardTitle>
          <CardDescription>
            Evolución hora por hora para el {new Date(results.fecha).toLocaleDateString("es-ES")} - Incluye tendencia
            LSTM basada en memoria temporal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              uv: {
                label: "Índice UV",
                color: "hsl(var(--chart-1))",
              },
              lstm_trend: {
                label: "Tendencia LSTM (UV)",
                color: "hsl(var(--chart-4))",
              },
              ozono: {
                label: "Ozono O₃ (µg/m³)",
                color: "hsl(var(--chart-2))",
              },
              precipitacion: {
                label: "Precipitación (mm)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[500px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.datosHorarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" tickFormatter={(value) => `${value}:00`} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="uv"
                  stroke="var(--color-radiacion)"
                  strokeWidth={3}
                  name="Índice UV"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="lstm_trend"
                  stroke="var(--color-lstm_trend)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Tendencia LSTM (UV)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ozono"
                  stroke="var(--color-ozono)"
                  strokeWidth={2}
                  name="Ozono O₃ (µg/m³)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="precipitacion"
                  stroke="var(--color-precipitacion)"
                  strokeWidth={2}
                  name="Precipitación (mm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Fórmula LSTM Explicada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis del Modelo LSTM
          </CardTitle>
          <CardDescription>
            Explicación detallada de la fórmula LSTM utilizada para la tendencia horaria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Fórmula LSTM Implementada:</h4>
              <div className="font-mono text-sm bg-white p-3 rounded border">
                LSTM_h = V_base × W_temporal × M_factor + H_avg × (1 - M_factor) × 0.2
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Componentes de la Fórmula:</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>V_base:</strong> Valor base calculado con fórmulas tradicionales
                  </li>
                  <li>
                    • <strong>W_temporal:</strong> sin(π × h / 12) × 0.3 + 0.7
                  </li>
                  <li>
                    • <strong>M_factor:</strong> Factor de memoria = 0.8
                  </li>
                  <li>
                    • <strong>H_avg:</strong> Promedio histórico de datos cargados
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Interpretación:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• La red LSTM "recuerda" el 80% del patrón actual</li>
                  <li>• Incorpora 20% de información histórica</li>
                  <li>• El peso temporal simula la variación diurna</li>
                  <li>• Precisión del modelo: {Math.round(results.metricas.lstm_accuracy * 100)}%</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas del Modelo LSTM */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Rendimiento del Modelo</CardTitle>
          <CardDescription>Indicadores de precisión y confiabilidad del modelo de predicción</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600">Radiación Solar</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">MAE:</span>
                  <span className="font-mono">{results.metricas.mae_radiacion} W/m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RMSE:</span>
                  <span className="font-mono">{results.metricas.rmse_radiacion} W/m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">R²:</span>
                  <span className="font-mono">{results.metricas.r2_radiacion}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Ozono (O₃)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">MAE:</span>
                  <span className="font-mono">{results.metricas.mae_ozono} µg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RMSE:</span>
                  <span className="font-mono">{results.metricas.rmse_ozono} µg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">R²:</span>
                  <span className="font-mono">{results.metricas.r2_ozono}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600">Precipitación</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">MAE:</span>
                  <span className="font-mono">{results.metricas.mae_precipitacion} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RMSE:</span>
                  <span className="font-mono">{results.metricas.rmse_precipitacion} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">R²:</span>
                  <span className="font-mono">{results.metricas.r2_precipitacion}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className={`h-5 w-5 text-${uvInfo.color}-600`} />
            Recomendaciones de Protección Solar
          </CardTitle>
          <CardDescription>Medidas preventivas basadas en el nivel de radiación UV predicho</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className={`border-${uvInfo.color}-200 bg-${uvInfo.color}-50`}>
            <IconComponent className={`h-4 w-4 text-${uvInfo.color}-600`} />
            <AlertDescription>
              <div className="space-y-3">
                <div>
                  <strong>Nivel de Riesgo: {uvInfo.level}</strong>
                </div>
                <ul className="space-y-1">
                  {uvInfo.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-xs mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Para Actividades Agrícolas en Junín</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Programar trabajos antes de las 10am o después de las 4pm</li>
                <li>• Usar ropa de manga larga y sombrero de ala ancha</li>
                <li>• Hidratarse frecuentemente debido a la altitud</li>
                <li>• Proteger cultivos sensibles con mallas sombreadoras</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Para Turismo en la Sierra Central</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Aplicar protector solar SPF 50+ cada 2 horas</li>
                <li>• Usar gafas de sol con protección UV 100%</li>
                <li>• Planificar actividades en horarios de menor radiación</li>
                <li>• Considerar la mayor intensidad UV por la altitud</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
