export type NivelActividad = 'critico' | 'alto' | 'moderado' | 'bajo'
export type TipoMedida = 'proyecto_ley' | 'dictamen' | 'ley_aprobada'
export type TipoProyecto = 'regulatorio' | 'no_regulatorio'
export type TipoLegislador = 'diputado' | 'senador'

export interface SectorMonthlyData {
  month: string // formato: '2024-01', '2024-02', etc.
  projectCount: number
  dictamenCount: number
  leyCount: number
}

export interface SectorTrend {
  tema: string
  frecuencia: number
  tendencia: 'subiendo' | 'estable' | 'bajando'
}

export interface Sector {
  id: string
  name: string
  icon: string
  description: string
  monthlyData: SectorMonthlyData[]
  trends: SectorTrend[]
  congresistas?: SectorCongresista[] // Congresistas vinculados a este sector
}

export interface SectorCongresista {
  congresista: Congresista
  proyectosCount: number
  porcentajeAprobacion: number
}

export interface HitoClave {
  id: string
  descripcion: string
  fecha: string // ISO 8601 format
  tipo: 'votacion' | 'investigacion' | 'entrevista' | 'evento' | 'otro'
}

export interface Congresista {
  id: string
  nombre: string
  partido: string
  region: string
  tipo: TipoLegislador
  foto?: string
  cargo?: string // Cargo relevante (ej: "Presidente de Comision")
  proyectosCount?: number // Proyectos presentados en este sector
  porcentajeAprobacion?: number // Porcentaje de proyectos aprobados (0-100)
  topComisiones?: Array<{ sectorId: string; comisiones: string[] }> // Top comisiones por sector
  leyesAprobadas?: number // Leyes aprobadas por este congresista
  partidosHistoria?: Array<{ partido: string; fechaInicio: string; fechaFin?: string }>
  cargosHistoria?: Array<{ cargo: string; fechaInicio: string; fechaFin?: string }>
  perfilCualitativo?: string // Descripción cualitativa del perfil político y legislativo
  hitosClaves?: HitoClave[] // Hitos clave cronológicos del congresista
}

export interface ProyectoLey {
  id: string
  numero: string
  titulo: string
  sumilla: string
  resumen?: string
  fechaPresentacion: string
  estado: 'En Comision' | 'En Pleno' | 'Aprobado' | 'Archivado' | 'Observado' | 'Publicado'
  sectorId: string
  autorPrincipal?: Congresista // Autor principal
  autores: Congresista[] // Para compatibilidad hacia atrás, todos los autores
  firmantes?: Congresista[] // Otros firmantes/coautores
  comision: string
  ultimaActualizacion: string
  prioridad: 'Alta' | 'Media' | 'Baja'
  tags: string[]
  tipoMedida: TipoMedida
  tipoProyecto: TipoProyecto
  probabilidadAprobacion: number // 0-100
  enAgenda: boolean
  nivel: 1 | 2 | 3 | 4 | 5 // Nivel de avance del proyecto (1 = inicial, 5 = final)
}

export interface Favorito {
  proyectoId: string
  fechaAgregado: string
  notas?: string
}

export interface LeyAprobada {
  id: string
  numeroLey: string // Ej: "Ley N° 31814"
  titulo: string
  sumilla: string
  resumen?: string
  fechaPublicacion: string // Fecha de publicación en El Peruano
  fechaAprobacion: string // Fecha de aprobación en el Congreso
  fechaPromulgacion?: string // Fecha de promulgación por el Ejecutivo
  sectorId: string
  autorPrincipal?: Congresista
  autores: Congresista[]
  comisionDictaminadora: string
  proyectoOrigenId?: string // ID del proyecto de ley original
  proyectoOrigenNumero?: string // Número del PL original (ej: "PL 1234/2024-CR")
  tags: string[]
  impacto?: 'Alto' | 'Medio' | 'Bajo'
  enlaceElPeruano?: string // URL a El Peruano
  textoCompleto?: string // Contenido o resumen extenso de la ley
  vigencia: 'En vigor' | 'Pendiente reglamentación' | 'Con modificaciones' | 'Derogada'
}

// Umbrales para determinar nivel de actividad
export const ACTIVITY_THRESHOLDS = {
  critico: 15,  // >= 15 proyectos
  alto: 10,     // >= 10 proyectos
  moderado: 5,  // >= 5 proyectos
  bajo: 0       // < 5 proyectos
}

// Tipos para análisis de tweets
export interface Tweet {
  id: string
  texto: string
  fecha: string // ISO 8601 format
  autor: Congresista
  likes: number
  retweets: number
  respuestas: number
  url: string // URL del tweet original
  palabrasClave?: string[]
}

export interface WordFrequency {
  word: string
  frequency: number
  size?: number // Para renderizado en nube
}

export interface TwitterAnalytics {
  tweets: Tweet[]
  wordFrequencies: WordFrequency[]
  totalTweets: number
  periodoAnalisis: {
    desde: string
    hasta: string
  }
}

export interface TweetFilters {
  fechaDesde?: string
  fechaHasta?: string
  sectores: string[]
  partidos: string[]
  legisladores: string[]
}
