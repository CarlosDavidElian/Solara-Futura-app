"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, CheckCircle, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import * as XLSX from "xlsx"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useToast } from "@/hooks/use-toast"

interface DataUploadProps {
  onDataUploaded: (data: any[]) => void
  uploadedData: any[]
}

export default function CargaDatos({ onDataUploaded, uploadedData }: DataUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Interpolación lineal para valores faltantes
  const interpolate = (arr: any[], key: string) => {
    let lastValid = null
    let lastValidIdx = -1
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] == null || isNaN(arr[i][key])) {
        // Buscar el siguiente valor válido
        let nextValid = null
        let nextValidIdx = -1
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[j][key] != null && !isNaN(arr[j][key])) {
            nextValid = arr[j][key]
            nextValidIdx = j
            break
          }
        }
        if (lastValid != null && nextValid != null) {
          // Interpolación lineal
          const step = (nextValid - lastValid) / (nextValidIdx - lastValidIdx)
          for (let k = lastValidIdx + 1; k < nextValidIdx; k++) {
            arr[k][key] = lastValid + step * (k - lastValidIdx)
          }
          i = nextValidIdx - 1
        }
      } else {
        lastValid = arr[i][key]
        lastValidIdx = i
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus("Procesando archivo Excel...")

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      // Asumiendo que la primera fila es el header
      let [header, ...rows] = jsonData
      if (!Array.isArray(header)) header = []
      // Buscar los índices de las columnas requeridas
      const idxRad = Array.isArray(header) ? header.findIndex((h: any) => typeof h === 'string' && (h.toLowerCase().includes('radiacion') || h.toLowerCase().includes('uv'))) : -1
      const idxO3 = Array.isArray(header) ? header.findIndex((h: any) => typeof h === 'string' && (h.toLowerCase().includes('o3') || h.toLowerCase().includes('ozono'))) : -1
      const idxPP = Array.isArray(header) ? header.findIndex((h: any) => typeof h === 'string' && (h.toLowerCase().includes('precipitacion') || h.toLowerCase().includes('pp') || h.toLowerCase().includes('lluvia'))) : -1
      const idxFecha = Array.isArray(header) ? header.findIndex((h: any) => typeof h === 'string' && h.toLowerCase().includes('fecha')) : -1

      if (idxFecha === -1 || idxRad === -1 || idxO3 === -1 || idxPP === -1) {
        setUploadStatus("El archivo debe contener las columnas: fecha, radiación solar, O3 y precipitaciones (pueden llamarse similar)")
        setIsUploading(false)
        toast({
          title: "Error al cargar archivo",
          description: "El archivo debe contener las columnas: fecha, radiación solar, O3 y precipitaciones (pueden llamarse similar)",
          variant: "destructive"
        })
        return
      }

      // Guardar todos los datos y columnas del Excel
      let allKeys = Array.isArray(header) ? header.map((h: any) => (typeof h === 'string' ? h : '')) : [];
      let formattedData = rows.map((row: any) => {
        let obj: any = {};
        allKeys.forEach((key, idx) => {
          obj[key] = row[idx] !== undefined && row[idx] !== null && row[idx] !== '' ? row[idx] : null;
        });
        return obj;
      });

      // Interpolación lineal solo para radiacion, o3 y precipitacion si existen
      const colNames = {
        radiacion: allKeys.find(k => typeof k === 'string' && (k.toLowerCase().includes('radiacion') || k.toLowerCase().includes('uv'))),
        o3: allKeys.find(k => typeof k === 'string' && (k.toLowerCase().includes('o3') || k.toLowerCase().includes('ozono'))),
        precipitacion: allKeys.find(k => typeof k === 'string' && (k.toLowerCase().includes('precipitacion') || k.toLowerCase().includes('pp') || k.toLowerCase().includes('lluvia'))),
      };
      if (colNames.radiacion) interpolate(formattedData, colNames.radiacion);
      if (colNames.o3) interpolate(formattedData, colNames.o3);
      if (colNames.precipitacion) interpolate(formattedData, colNames.precipitacion);

      onDataUploaded(formattedData)
      setUploadStatus("¡Archivo cargado exitosamente!")
      toast({
        title: "Datos cargados",
        description: "¡Archivo cargado exitosamente!",
        variant: "default"
      })
    } catch (error) {
      setUploadStatus("Error al procesar el archivo.")
      toast({
        title: "Error al procesar archivo",
        description: "Hubo un problema al procesar el archivo Excel.",
        variant: "destructive"
      })
    }
    setIsUploading(false)
  }

  const generateSampleData = () => {
    setIsUploading(true)
    setUploadStatus("Generando datos de muestra...")

    setTimeout(() => {
      const sampleData = Array.from({ length: 30 }, (_, i) => ({
        fecha: new Date(2024, 0, i + 1).toISOString().split("T")[0],
        radiacion: Math.round((7 + Math.random() * 4) * 10) / 10, // 7.0-11.0 UV
        o3: Math.round(25 + Math.random() * 40), // 25-65 µg/m³
        precipitacion: Math.round(Math.random() * 15 * 10) / 10, // 0-15 mm
      }))

      onDataUploaded(sampleData)
      setUploadStatus("¡Datos de muestra generados exitosamente!")
      setIsUploading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cargar Archivo Excel
            </CardTitle>
            <CardDescription>Sube tu archivo Excel con datos históricos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excel-file">Seleccionar archivo Excel</Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </div>
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {isUploading ? "Procesando..." : "Seleccionar Archivo"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Datos de Muestra
            </CardTitle>
            <CardDescription>Genera datos de ejemplo para probar el sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Si no tienes un archivo Excel, puedes generar datos de muestra para probar las funcionalidades del
              sistema.
            </p>
            <Button
              onClick={generateSampleData}
              disabled={isUploading}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Database className="h-4 w-4 mr-2" />
              {isUploading ? "Generando..." : "Generar Datos de Muestra"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {uploadStatus && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}

      {uploadedData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de los datos cargados en el sistema</CardTitle>
            <CardDescription>Valores máximos alcanzados en cada variable</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // Detectar nombres de columnas relevantes
              const keys = Object.keys(uploadedData[0] || {})
              const colRad = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('radiacion') || k.toLowerCase().includes('uv')))
              const colO3 = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('o3') || k.toLowerCase().includes('ozono')))
              const colPP = keys.find(k => typeof k === 'string' && (k.toLowerCase().includes('precipitacion') || k.toLowerCase().includes('pp') || k.toLowerCase().includes('lluvia')))
              const maxRad = colRad ? Math.max(...uploadedData.map(row => Number(row[colRad]) || 0)) : null
              const minRad = colRad ? Math.min(...uploadedData.map(row => Number(row[colRad]) || 0)) : null
              const maxO3 = colO3 ? Math.max(...uploadedData.map(row => Number(row[colO3]) || 0)) : null
              const minO3 = colO3 ? Math.min(...uploadedData.map(row => Number(row[colO3]) || 0)) : null
              const maxPP = colPP ? Math.max(...uploadedData.map(row => Number(row[colPP]) || 0)) : null
              const minPP = colPP ? Math.min(...uploadedData.map(row => Number(row[colPP]) || 0)) : null
              const chartData = [
                colRad && { variable: 'Radiación', Máximo: maxRad, Mínimo: minRad },
                colO3 && { variable: 'O₃', Máximo: maxO3, Mínimo: minO3 },
                colPP && { variable: 'Precipitación', Máximo: maxPP, Mínimo: minPP },
              ].filter(Boolean)
              return (
                <>
                  <div className="flex flex-wrap gap-6 justify-center mb-8">
                    {colRad && (
                      <div className="bg-orange-50 rounded-lg p-4 shadow text-center min-w-[160px]">
                        <div className="text-xs text-orange-700 mb-1 font-semibold">Radiación Solar Máxima</div>
                        <div className="text-3xl font-bold text-orange-600">{maxRad?.toFixed(2)}</div>
                      </div>
                    )}
                    {colO3 && (
                      <div className="bg-green-50 rounded-lg p-4 shadow text-center min-w-[160px]">
                        <div className="text-xs text-green-700 mb-1 font-semibold">O₃ Máximo</div>
                        <div className="text-3xl font-bold text-green-600">{maxO3?.toFixed(2)}</div>
                      </div>
                    )}
                    {colPP && (
                      <div className="bg-blue-50 rounded-lg p-4 shadow text-center min-w-[160px]">
                        <div className="text-xs text-blue-700 mb-1 font-semibold">Precipitación Máxima (PP)</div>
                        <div className="text-3xl font-bold text-blue-600">{maxPP?.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                  {chartData.length > 0 && (
                    <>
                      <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="variable" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Máximo" fill="#f59e42" name="Máximo" />
                            <Bar dataKey="Mínimo" fill="#38bdf8" name="Mínimo" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                        <ul className="list-disc pl-5">
                          <li><b>Radiación Solar:</b> El valor máximo indica el mayor nivel de radiación registrado, útil para identificar picos de exposición solar. El mínimo muestra los días de menor radiación, relevantes para análisis de riesgo y planificación agrícola.</li>
                          <li><b>O₃ (Ozono):</b> El valor máximo refleja la mayor concentración de ozono detectada, importante para evaluar la calidad del aire y posibles alertas ambientales. El mínimo ayuda a identificar periodos de menor protección atmosférica.</li>
                          <li><b>Precipitación (PP):</b> El máximo representa el día más lluvioso registrado, clave para estudios hidrológicos y prevención de inundaciones. El mínimo muestra los días más secos, útiles para gestión de sequías.</li>
                        </ul>
                        <div className="mt-2 text-xs text-gray-500">Estos valores resumen los extremos históricos de tus datos cargados y ayudan a interpretar los gráficos y tomar decisiones informadas.</div>
                      </div>
                    </>
                  )}
                </>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
