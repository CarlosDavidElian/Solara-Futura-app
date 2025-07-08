"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mountain, Thermometer, Cloud, Users, Wheat, Camera, TreePine } from "lucide-react"

export default function InformacionJunin() {
  return (
    <div className="space-y-6">
      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Ubicación Geográfica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>Región:</strong> Sierra Central del Perú
              </div>
              <div>
                <strong>Coordenadas:</strong> 11°09′S 75°59′O
              </div>
              <div>
                <strong>Superficie:</strong> 44,197 km²
              </div>
              <div>
                <strong>Capital:</strong> Huancayo
              </div>
              <div>
                <strong>Altitud:</strong> 3,200 - 5,730 msnm
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Sierra Central</Badge>
              <Badge variant="secondary">Región Andina</Badge>
              <Badge variant="secondary">Zona Tropical</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Datos Demográficos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>Población:</strong> ~1,350,000 habitantes
              </div>
              <div>
                <strong>Densidad:</strong> 30.5 hab/km²
              </div>
              <div>
                <strong>Provincias:</strong> 9 provincias
              </div>
              <div>
                <strong>Distritos:</strong> 123 distritos
              </div>
              <div>
                <strong>Idiomas:</strong> Español, Quechua
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Huancayo</Badge>
              <Badge variant="outline">Tarma</Badge>
              <Badge variant="outline">La Oroya</Badge>
              <Badge variant="outline">Jauja</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Características Climáticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            Características Climáticas
          </CardTitle>
          <CardDescription>Condiciones meteorológicas típicas del departamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600">Temperatura</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Promedio anual:</strong> 11°C - 16°C
                </li>
                <li>
                  • <strong>Máxima:</strong> 20°C - 24°C (día)
                </li>
                <li>
                  • <strong>Mínima:</strong> -3°C - 5°C (noche)
                </li>
                <li>
                  • <strong>Variación diurna:</strong> Muy pronunciada
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600">Precipitaciones</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Anual:</strong> 600 - 1,200 mm
                </li>
                <li>
                  • <strong>Época húmeda:</strong> Dic - Mar
                </li>
                <li>
                  • <strong>Época seca:</strong> May - Sep
                </li>
                <li>
                  • <strong>Distribución:</strong> Irregular
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-purple-600">Radiación Solar</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Intensidad:</strong> Alta (altitud)
                </li>
                <li>
                  • <strong>Horas sol/día:</strong> 6 - 8 horas
                </li>
                <li>
                  • <strong>UV máximo:</strong> 800 - 1,200 W/m²
                </li>
                <li>
                  • <strong>Variación estacional:</strong> Moderada
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topografía y Geografía */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-gray-600" />
            Topografía y Relieve
          </CardTitle>
          <CardDescription>Características geográficas que influyen en el clima</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Formas de Relieve</h4>
              <ul className="space-y-2 text-sm">
                <li>• Valle del Mantaro: Principal valle interandino</li>
                <li>• Cordillera Occidental: Límite oeste</li>
                <li>• Cordillera Oriental: Límite este</li>
                <li>• Mesetas: Altiplanos de Bombón y Junín</li>
                <li>• Cañones: Profundos valles fluviales</li>
                <li>• Nevados: Huaytapallana, Pariacaca</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Pisos Altitudinales</h4>
              <ul className="space-y-2 text-sm">
                <li>• Yunga (1,000-2,300m): Clima cálido</li>
                <li>• Quechua (2,300-3,500m): Clima templado</li>
                <li>• Suni (3,500-4,000m): Clima frío</li>
                <li>• Puna (4,000-4,800m): Clima muy frío</li>
                <li>• Janka (&gt;4,800m): Clima glacial</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actividades Económicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-yellow-600" />
              Actividades Agrícolas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Principales Cultivos:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Papa (variedades nativas)</li>
                <li>• Maíz (amiláceo y choclo)</li>
                <li>• Quinua y kiwicha</li>
                <li>• Habas y arvejas</li>
                <li>• Cebada y trigo</li>
                <li>• Hortalizas (zanahoria, lechuga)</li>
              </ul>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Impacto de la Radiación:</strong> La alta radiación UV afecta el crecimiento de cultivos y
                  requiere estrategias de protección para agricultores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-600" />
              Turismo y Atractivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Principales Atractivos:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Valle del Mantaro</li>
                <li>• Nevado de Huaytapallana</li>
                <li>• Santuario de Wariwillka</li>
                <li>• Convento de Santa Rosa de Ocopa</li>
                <li>• Laguna de Paca</li>
                <li>• Reserva Nacional de Junín</li>
              </ul>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800">
                  <strong>Recomendación UV:</strong> Los turistas deben usar protección solar alta debido a la intensa
                  radiación en altitud.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Factores Ambientales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-gray-600" />
            Factores que Influyen en la Radiación Solar
          </CardTitle>
          <CardDescription>Elementos geográficos y climáticos que afectan las mediciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-orange-600">Factores que Aumentan la Radiación:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Altitud elevada: Menor densidad atmosférica</li>
                <li>• Aire seco: Menor absorción de radiación</li>
                <li>• Cielos despejados: Época seca (mayo-septiembre)</li>
                <li>• Reflexión de nieve: En nevados y glaciares</li>
                <li>• Latitud tropical: Mayor incidencia solar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-blue-600">Factores que Reducen la Radiación:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Nubosidad: Época húmeda (diciembre-marzo)</li>
                <li>• Precipitaciones: Absorción por vapor de agua</li>
                <li>• Topografía: Sombras de montañas</li>
                <li>• Contaminación: Partículas en suspensión</li>
                <li>• Neblina matinal: Común en valles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Importancia del Monitoreo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-green-600" />
            Importancia del Monitoreo de Radiación Solar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Agricultura</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Planificación de siembras</li>
                <li>• Protección de cultivos</li>
                <li>• Optimización de riego</li>
                <li>• Prevención de estrés térmico</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Salud Pública</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Prevención de cáncer de piel</li>
                <li>• Alertas de radiación UV</li>
                <li>• Educación preventiva</li>
                <li>• Protección laboral</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Energía Solar</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Potencial fotovoltaico</li>
                <li>• Diseño de sistemas</li>
                <li>• Eficiencia energética</li>
                <li>• Planificación urbana</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
