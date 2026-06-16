'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, MapPin, Briefcase, Award, BarChart3, Star, Search, X, Twitter, MessageCircle, Repeat2, Heart, ExternalLink, FileText, Filter } from 'lucide-react'
import { WordCloud } from '@/components/word-cloud'
import { ExportWordModal } from '@/components/export-word-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getCongresistaTotalStats } from '@/lib/congresistas-utils'
import { proyectos, sectores } from '@/lib/data'
import type { Congresista, ProyectoLey } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSortableTable } from '@/hooks/use-sortable-table'
import { SortableHead } from '@/components/ui/sortable-head'
import { MultiSelect } from '@/components/ui/multi-select'
import { Input } from '@/components/ui/input'

interface CongresistDetailProps {
  congresista: Congresista
  onBack: () => void
  onViewProject?: (proyecto: ProyectoLey) => void
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const PREVIEW_CHAR_LIMIT = 400

// Mock tweets data with topics
const mockTweets = [
  {
    id: '1',
    url: 'https://twitter.com/i/web/status/1',
    texto: `Presentamos hoy el proyecto de ley que busca fortalecer la transparencia en la gestión pública. Es momento de que las instituciones rindan cuentas a la ciudadanía. #TransparenciaPública #CongresoPerú`,
    fecha: '2024-03-15T14:30:00',
    likes: 234,
    retweets: 89,
    respuestas: 45,
    topics: ['transparencia', 'gestión pública', 'instituciones'],
  },
  {
    id: '2',
    url: 'https://twitter.com/i/web/status/2',
    texto: `En reunión con representantes de la sociedad civil para escuchar sus propuestas sobre el proyecto de reforma educativa. El diálogo es fundamental para construir mejores políticas públicas.`,
    fecha: '2024-03-14T10:15:00',
    likes: 156,
    retweets: 42,
    respuestas: 28,
    topics: ['educación', 'sociedad civil', 'reforma'],
  },
  {
    id: '3',
    url: 'https://twitter.com/i/web/status/3',
    texto: `Mañana sesión importante en la Comisión. Estaremos debatiendo temas cruciales para el desarrollo del país. Los invito a seguir la transmisión en vivo por el canal del Congreso.`,
    fecha: '2024-03-13T18:45:00',
    likes: 98,
    retweets: 31,
    respuestas: 15,
    topics: ['comisión', 'desarrollo', 'congreso'],
  },
  {
    id: '4',
    url: 'https://twitter.com/i/web/status/4',
    texto: `Aprobamos en primera votación la ley de protección al consumidor financiero. Un paso importante para defender los derechos de todos los peruanos frente a abusos bancarios. #DerechosDelConsumidor`,
    fecha: '2024-03-12T16:20:00',
    likes: 312,
    retweets: 124,
    respuestas: 67,
    topics: ['consumidor', 'finanzas', 'derechos'],
  },
  {
    id: '5',
    url: 'https://twitter.com/i/web/status/5',
    texto: `Visitamos hospitales en las zonas rurales de Arequipa. La salud debe llegar a todos los rincones del país. Presentaremos iniciativas para mejorar la infraestructura de salud regional.`,
    fecha: '2024-03-11T09:45:00',
    likes: 189,
    retweets: 56,
    respuestas: 34,
    topics: ['salud', 'infraestructura', 'regiones'],
  },
  {
    id: '6',
    url: 'https://twitter.com/i/web/status/6',
    texto: `La economía del país necesita reactivarse. Proponemos medidas para facilitar la formalización de las MYPES y generar más empleos. El trabajo digno es un derecho fundamental.`,
    fecha: '2024-03-10T11:30:00',
    likes: 267,
    retweets: 98,
    respuestas: 52,
    topics: ['economía', 'empleo', 'MYPES'],
  },
  {
    id: '7',
    url: 'https://twitter.com/i/web/status/7',
    texto: `Importante avance en la lucha contra la corrupción. El proyecto de ley de transparencia patrimonial ya tiene dictamen favorable. Seguimos trabajando por un Perú más justo.`,
    fecha: '2024-03-09T14:15:00',
    likes: 445,
    retweets: 187,
    respuestas: 89,
    topics: ['corrupción', 'transparencia', 'justicia'],
  },
  {
    id: '8',
    url: 'https://twitter.com/i/web/status/8',
    texto: `Reunión con el sector educativo para discutir el presupuesto del próximo año. La educación debe ser prioridad nacional. Nuestros niños merecen mejores oportunidades.`,
    fecha: '2024-03-08T10:00:00',
    likes: 178,
    retweets: 45,
    respuestas: 23,
    topics: ['educación', 'presupuesto', 'niños'],
  },
  {
    id: '9',
    url: 'https://twitter.com/i/web/status/9',
    texto: `Felicitaciones a nuestros deportistas peruanos que representan al país con orgullo. El deporte forma ciudadanos y construye comunidad. #OrgulloPeruano`,
    fecha: '2024-03-07T18:00:00',
    likes: 523,
    retweets: 234,
    respuestas: 45,
    topics: ['deporte', 'ciudadanía', 'comunidad'],
  },
  {
    id: '10',
    url: 'https://twitter.com/i/web/status/10',
    texto: `La seguridad ciudadana es responsabilidad de todos. Trabajamos en conjunto con la Policía Nacional para implementar medidas efectivas contra la delincuencia.`,
    fecha: '2024-03-06T15:30:00',
    likes: 356,
    retweets: 145,
    respuestas: 78,
    topics: ['seguridad', 'delincuencia', 'policía'],
  },
]

// Extract word frequencies from tweets for the word cloud
function extractWordFrequencies(tweets: typeof mockTweets): { text: string; value: number }[] {
  const wordCount = new Map<string, number>()
  
  // Common Spanish stopwords to filter out
  const stopwords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
    'a', 'en', 'por', 'para', 'con', 'sin', 'sobre', 'entre', 'que', 'es',
    'son', 'ser', 'y', 'o', 'pero', 'más', 'menos', 'como', 'se', 'su', 'sus',
    'mi', 'mis', 'tu', 'tus', 'nos', 'nuestro', 'nuestra', 'este', 'esta',
    'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella', 'lo',
    'le', 'les', 'me', 'te', 'nos', 'os', 'ya', 'muy', 'todo', 'toda', 'todos',
    'todas', 'hay', 'ha', 'han', 'hemos', 'he', 'sido', 'fue', 'fueron', 'era',
    'eran', 'será', 'serán', 'siendo', 'estar', 'está', 'están', 'estamos',
    'hoy', 'mañana', 'ayer', 'ahora', 'siempre', 'nunca', 'también', 'así',
    'bien', 'mal', 'aquí', 'allí', 'donde', 'cuando', 'quien', 'cual', 'cuales',
    'qué', 'cómo', 'cuándo', 'dónde', 'porque', 'aunque', 'desde', 'hasta',
    'cada', 'otro', 'otra', 'otros', 'otras', 'mismo', 'misma', 'mismos', 'mismas'
  ])
  
  tweets.forEach(tweet => {
    // Add topic words with higher weight
    tweet.topics.forEach(topic => {
      const normalizedTopic = topic.toLowerCase()
      wordCount.set(normalizedTopic, (wordCount.get(normalizedTopic) || 0) + 3)
    })
    
    // Extract words from tweet text
    const words = tweet.texto
      .toLowerCase()
      .replace(/[#@]/g, '') // Remove hashtag and mention symbols
      .replace(/[^\wáéíóúñü\s]/g, '') // Keep only alphanumeric and Spanish chars
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopwords.has(word))
    
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1)
    })
  })
  
  // Convert to array and sort by frequency
  return Array.from(wordCount.entries())
    .filter(([_, count]) => count >= 2) // Only words that appear at least twice
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30) // Top 30 words
    .map(([text, value]) => ({ text, value }))
}

// Get unique topics from tweets
function getUniqueTweets(tweets: typeof mockTweets): string[] {
  const topics = new Set<string>()
  tweets.forEach(tweet => {
    tweet.topics.forEach(topic => topics.add(topic))
  })
  return Array.from(topics).sort()
}

interface TwitterActivitySectionProps {
  congresista: Congresista
  selectedTopic: string | null
  onTopicSelect: (topic: string | null) => void
}

function TwitterActivitySection({ congresista, selectedTopic, onTopicSelect }: TwitterActivitySectionProps) {
  const wordCloudData = useMemo(() => extractWordFrequencies(mockTweets), [])
  const allTopics = useMemo(() => getUniqueTweets(mockTweets), [])
  
  const filteredTweets = useMemo(() => {
    if (!selectedTopic) return mockTweets
    return mockTweets.filter(tweet => 
      tweet.topics.some(t => t.toLowerCase() === selectedTopic.toLowerCase()) ||
      tweet.texto.toLowerCase().includes(selectedTopic.toLowerCase())
    )
  }, [selectedTopic])

  const handleWordClick = (word: string) => {
    if (selectedTopic === word) {
      onTopicSelect(null)
    } else {
      onTopicSelect(word)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Twitter className="h-4 w-4 text-sky-500" />
          <CardTitle className="text-base">Actividad en X (Twitter)</CardTitle>
        </div>
        <a
          href={`https://twitter.com/${congresista.nombre.toLowerCase().replace(/\s+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          Ver perfil completo
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Word Cloud Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">Nube de palabras</h4>
            <p className="text-xs text-muted-foreground">Haz clic en una palabra para filtrar</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <WordCloud 
              words={wordCloudData} 
              onWordClick={handleWordClick}
              selectedWord={selectedTopic}
            />
          </div>
        </div>

        {/* Topic Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filtrar por tema:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTopicSelect(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                !selectedTopic
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              Todos
            </button>
            {allTopics.map(topic => (
              <button
                key={topic}
                onClick={() => onTopicSelect(selectedTopic === topic ? null : topic)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize",
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Tweets List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Tweets recientes
              {selectedTopic && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({filteredTweets.length} sobre &ldquo;{selectedTopic}&rdquo;)
                </span>
              )}
            </h4>
          </div>
          
          <div className="divide-y divide-border">
            {filteredTweets.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No se encontraron tweets sobre este tema
              </div>
            ) : (
              filteredTweets.map((tweet) => (
                <div key={tweet.id} className="py-3 first:pt-0 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-sm text-foreground leading-relaxed">{tweet.texto}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tweet.topics.map(topic => (
                        <button
                          key={topic}
                          onClick={() => onTopicSelect(selectedTopic === topic ? null : topic)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-medium transition-colors capitalize",
                            selectedTopic === topic
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(tweet.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="text-[11px]">{tweet.respuestas}</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Repeat2 className="h-3.5 w-3.5" />
                        <span className="text-[11px]">{tweet.retweets}</span>
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Heart className="h-3.5 w-3.5" />
                        <span className="text-[11px]">{tweet.likes}</span>
                      </span>
                    </div>
                    <a
                      href={tweet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-sky-500 hover:underline"
                    >
                      Ver en X
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          Los tweets se actualizan automáticamente desde la API de X. Última actualización: hace 5 minutos.
        </p>
      </CardContent>
    </Card>
  )
}

function PerfilCualitativoCard({ texto }: { texto: string }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = texto.length > PREVIEW_CHAR_LIMIT

  const parrafos = texto.split('\n\n')

  // Build preview: include paragraphs until we exceed the char limit
  let previewParrafos: string[] = []
  let charCount = 0
  for (const p of parrafos) {
    if (charCount + p.length > PREVIEW_CHAR_LIMIT && previewParrafos.length > 0) break
    previewParrafos.push(p)
    charCount += p.length
  }

  const displayed = expanded || !isLong ? parrafos : previewParrafos

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Perfil cualitativo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayed.map((parrafo, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {parrafo}
            </p>
          ))}
          {!expanded && isLong && (
            <p className="text-sm text-muted-foreground leading-relaxed">…</p>
          )}
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </CardContent>
    </Card>
  )
}

export function CongresistDetail({ congresista, onBack, onViewProject }: CongresistDetailProps) {
  const [sharedPopup, setSharedPopup] = useState<{ nombre: string; proyectos: ProyectoLey[] } | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)

  // Projects table filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([])
  const [selectedEstados, setSelectedEstados] = useState<string[]>([])
  const [selectedProbabilidad, setSelectedProbabilidad] = useState<string[]>([])
  const [selectedTipoAutor, setSelectedTipoAutor] = useState<string[]>([])
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedTweetTopic, setSelectedTweetTopic] = useState<string | null>(null)
  // Mock specific data for María Elena Torres (ID: '1')
  const isMariaTorres = congresista.id === '1' || congresista.nombre === 'Maria Elena Torres'
  
  const stats = useMemo(() => {
    if (isMariaTorres) {
      return {
        proyectosCount: 16,
        leyesAprobadas: 3,
        porcentajeAprobacion: 19,
        topSectores: [
          { sectorId: 'economia', sectorName: 'Economía', count: 6 },
          { sectorId: 'derechos', sectorName: 'Derechos del Consumidor', count: 4 },
          { sectorId: 'trabajo', sectorName: 'Trabajo', count: 3 },
        ]
      }
    }
    return getCongresistaTotalStats(congresista.id)
  }, [congresista.id, isMariaTorres])

  // Get all projects for this congressperson
  const congresistProjects = useMemo(() => {
    if (isMariaTorres) {
      // Mock 16 projects for María Elena Torres
      const mockProjects = [
        { id: 'm001', numero: '12345-2022-CR', titulo: 'Ley de Protección de Derechos del Consumidor en Transacciones Digitales', comision: 'Economía', sectorId: 'economia', estado: 'Aprobado', probabilidadAprobacion: 85, fechaPresentacion: '2022-03-15', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Fuerza Nacional', region: 'Lima' }] },
        { id: 'm002', numero: '12346-2022-CR', titulo: 'Modificación del Código de Protección al Consumidor', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'Aprobado', probabilidadAprobacion: 90, fechaPresentacion: '2022-04-10', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Fuerza Nacional', region: 'Lima' }] },
        { id: 'm003', numero: '12347-2022-CR', titulo: 'Regulación de Servicios Financieros en Plataformas Virtuales', comision: 'Economía', sectorId: 'economia', estado: 'En Pleno', probabilidadAprobacion: 75, fechaPresentacion: '2022-05-20', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Fuerza Nacional', region: 'Lima' }] },
        { id: 'm004', numero: '12348-2022-CR', titulo: 'Fortalecimiento de la Superintendencia de Economía', comision: 'Economía', sectorId: 'economia', estado: 'En Comisión', probabilidadAprobacion: 60, fechaPresentacion: '2022-06-05', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Fuerza Nacional', region: 'Lima' }] },
        { id: 'm005', numero: '12349-2022-CR', titulo: 'Ley de Protección al Consumidor en Servicios de Telecomunicaciones', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'Aprobado', probabilidadAprobacion: 88, fechaPresentacion: '2022-07-12', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Fuerza Nacional', region: 'Lima' }] },
        { id: 'm006', numero: '12350-2023-CR', titulo: 'Regulación de Comercio Electrónico', comision: 'Economía', sectorId: 'economia', estado: 'En Comisión', probabilidadAprobacion: 70, fechaPresentacion: '2023-01-08', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm007', numero: '12351-2023-CR', titulo: 'Protección de Datos Personales en Consumo', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'En Pleno', probabilidadAprobacion: 72, fechaPresentacion: '2023-02-14', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm008', numero: '12352-2023-CR', titulo: 'Estándares de Calidad en Servicios Financieros', comision: 'Economía', sectorId: 'economia', estado: 'En Comisión', probabilidadAprobacion: 55, fechaPresentacion: '2023-03-10', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm009', numero: '12353-2023-CR', titulo: 'Defensa del Consumidor en Seguros', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'En Comisión', probabilidadAprobacion: 65, fechaPresentacion: '2023-04-05', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm010', numero: '12354-2023-CR', titulo: 'Reforma Tributaria para MYPES', comision: 'Trabajo', sectorId: 'trabajo', estado: 'Archivado', probabilidadAprobacion: 25, fechaPresentacion: '2023-05-18', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm011', numero: '12355-2023-CR', titulo: 'Inclusión Financiera para Emprendedores', comision: 'Economía', sectorId: 'economia', estado: 'En Comisión', probabilidadAprobacion: 68, fechaPresentacion: '2023-06-22', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Accion Popular', region: 'Lima' }] },
        { id: 'm012', numero: '12356-2024-CR', titulo: 'Protección de Consumidores Vulnerables', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'En Pleno', probabilidadAprobacion: 80, fechaPresentacion: '2024-01-09', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Alianza para el Progreso', region: 'Lima' }] },
        { id: 'm013', numero: '12357-2024-CR', titulo: 'Modernización del Sistema de Crédito', comision: 'Economía', sectorId: 'economia', estado: 'En Comisión', probabilidadAprobacion: 62, fechaPresentacion: '2024-02-01', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Alianza para el Progreso', region: 'Lima' }] },
        { id: 'm014', numero: '12358-2024-CR', titulo: 'Regulación de Plataformas de Compra y Venta', comision: 'Derechos del Consumidor', sectorId: 'derechos', estado: 'En Comisión', probabilidadAprobacion: 58, fechaPresentacion: '2024-02-15', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Alianza para el Progreso', region: 'Lima' }] },
        { id: 'm015', numero: '12359-2024-CR', titulo: 'Promoción de Ahorro en Familia Peruana', comision: 'Trabajo', sectorId: 'trabajo', estado: 'En Comisión', probabilidadAprobacion: 50, fechaPresentacion: '2024-03-05', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Alianza para el Progreso', region: 'Lima' }] },
        { id: 'm016', numero: '12360-2024-CR', titulo: 'Acceso a Servicios Financieros en Zonas Rurales', comision: 'Trabajo', sectorId: 'trabajo', estado: 'En Comisión', probabilidadAprobacion: 55, fechaPresentacion: '2024-03-20', autores: [{ id: 'cong002', nombre: 'María Elena Torres', partido: 'Alianza para el Progreso', region: 'Lima' }] },
      ]
      return mockProjects as any
    }
    return proyectos.filter(p => p.autores.some(a => a.id === congresista.id))
  }, [congresista.id, isMariaTorres])

  // Derived filter options from actual projects
  const comisionOptions = useMemo(() =>
    [...new Set(congresistProjects.map(p => p.comision).filter(Boolean))].sort().map(c => ({ label: c!, value: c! }))
  , [congresistProjects])

  const estadoOptions = useMemo(() =>
    [...new Set(congresistProjects.map(p => p.estado))].sort().map(e => ({ label: e, value: e }))
  , [congresistProjects])

  const probabilidadOptions = [
    { label: 'Alta (67–100%)', value: 'alta' },
    { label: 'Media (34–66%)', value: 'media' },
    { label: 'Baja (0–33%)', value: 'baja' },
  ]

  const tipoAutorOptions = [
    { label: 'Autor principal', value: 'principal' },
    { label: 'Firmante', value: 'firmante' },
  ]

  const filteredProjects = useMemo(() => {
    return congresistProjects.filter(p => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || p.numero.toLowerCase().includes(q) || p.titulo.toLowerCase().includes(q)
      const matchesComision = selectedComisiones.length === 0 || selectedComisiones.includes(p.comision ?? '')
      const matchesEstado = selectedEstados.length === 0 || selectedEstados.includes(p.estado)
      const matchesProbabilidad = selectedProbabilidad.length === 0 || selectedProbabilidad.some(v => {
        if (v === 'alta') return p.probabilidadAprobacion >= 67
        if (v === 'media') return p.probabilidadAprobacion >= 34 && p.probabilidadAprobacion < 67
        return p.probabilidadAprobacion < 34
      })
      const esPrincipal = (p as any).autorPrincipal?.id === congresista.id
      const matchesTipoAutor = selectedTipoAutor.length === 0 || selectedTipoAutor.some(v =>
        (v === 'principal' && esPrincipal) || (v === 'firmante' && !esPrincipal)
      )
      const matchesFechaDesde = !fechaDesde || p.fechaPresentacion >= fechaDesde
      const matchesFechaHasta = !fechaHasta || p.fechaPresentacion <= fechaHasta
      return matchesSearch && matchesComision && matchesEstado && matchesProbabilidad && matchesTipoAutor && matchesFechaDesde && matchesFechaHasta
    })
  }, [congresistProjects, searchQuery, selectedComisiones, selectedEstados, selectedProbabilidad, selectedTipoAutor, fechaDesde, fechaHasta, congresista.id])

  const hasFilters = !!(searchQuery || selectedComisiones.length > 0 || selectedEstados.length > 0 || selectedProbabilidad.length > 0 || selectedTipoAutor.length > 0 || fechaDesde || fechaHasta)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedComisiones([])
    setSelectedEstados([])
    setSelectedProbabilidad([])
    setSelectedTipoAutor([])
    setFechaDesde('')
    setFechaHasta('')
  }

  // Sortable table for projects
  const { sort: projectsSort, toggleSort: toggleProjectsSort, sortedData: sortedProjects } = useSortableTable(
    filteredProjects,
    { column: 'fechaPresentacion', direction: 'desc' }
  )

  // Projects by sector chart data
  const sectorChartData = useMemo(() => {
    const sectorCounts = new Map<string, number>()
    congresistProjects.forEach(p => {
      const sectorName = sectores.find(s => s.id === p.sectorId)?.name || p.sectorId
      sectorCounts.set(sectorName, (sectorCounts.get(sectorName) || 0) + 1)
    })
    return Array.from(sectorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ nombre: name, proyectos: count }))
  }, [congresistProjects])

  // Projects by status chart data
  const statusChartData = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    congresistProjects.forEach(p => {
      statusCounts[p.estado] = (statusCounts[p.estado] || 0) + 1
    })
    return Object.entries(statusCounts)
      .map(([estado, count]) => ({ estado, count }))
  }, [congresistProjects])

  // Get linked congresspeople (coauthors)
  const linkedCongresistas = useMemo(() => {
    const coauthorMap = new Map<string, { congresista: any; projectCount: number; sharedProjects: ProyectoLey[] }>()
    
    congresistProjects.forEach(proyecto => {
      proyecto.autores.forEach(autor => {
        if (autor.id === congresista.id) return
        
        if (!coauthorMap.has(autor.id)) {
          coauthorMap.set(autor.id, { congresista: autor, projectCount: 0, sharedProjects: [] })
        }
        const entry = coauthorMap.get(autor.id)!
        entry.projectCount++
        entry.sharedProjects.push(proyecto)
      })
    })
    
    return Array.from(coauthorMap.values())
      .sort((a, b) => b.projectCount - a.projectCount)
      .slice(0, 10)
  }, [congresistProjects, congresista.id])

  // Mock party history for María Elena Torres
  const partieHistory = isMariaTorres 
    ? [
        { partido: 'Fuerza Nacional', fechaInicio: '2020-09', fechaFin: '2022-04' },
        { partido: 'Accion Popular', fechaInicio: '2022-05', fechaFin: '2023-08' },
        { partido: 'Alianza para el Progreso', fechaInicio: '2023-09', fechaFin: undefined },
      ]
    : congresista.partidosHistoria || [
        { partido: congresista.partido, fechaInicio: '2024-01', fechaFin: undefined },
      ]

  // Mock positions history for María Elena Torres
  const positionsHistory = isMariaTorres
    ? [
        { cargo: 'Vicepresidenta del Congreso', fechaInicio: '2020-09', fechaFin: '2021-08' },
        { cargo: 'Miembro Comisión de Economía', fechaInicio: '2020-09', fechaFin: '2022-02' },
        { cargo: 'Presidenta de la Comisión de Economía', fechaInicio: '2022-03', fechaFin: '2023-09' },
        { cargo: 'Miembro Comisión de Derechos del Consumidor', fechaInicio: '2023-09', fechaFin: undefined },
        { cargo: 'Presidenta de la Comisión de Derechos del Consumidor', fechaInicio: '2023-10', fechaFin: undefined },
      ]
    : congresista.cargosHistoria || (congresista.cargo ? [
        { cargo: congresista.cargo, fechaInicio: '2024-01', fechaFin: undefined }
      ] : [])

  const getPartidoColor = (partido: string) => {
    const colors: Record<string, string> = {
      'Partido Popular': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'Alianza para el Progreso': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      'Fuerza Nacional': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      'Union por el Peru': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'Movimiento Regional': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      'Accion Popular': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
      'Peru Libre': 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200',
      'Renovacion Popular': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
    }
    return colors[partido] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header + KPIs */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Name / meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{congresista.nombre}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="ml-2 gap-1.5 text-xs h-7 px-2.5 shrink-0"
            >
              <FileText className="h-3.5 w-3.5" />
              Exportar Word
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm ml-11">
            <Badge className={cn('text-xs font-medium', getPartidoColor(congresista.partido))}>
              {congresista.partido}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {congresista.region}
            </div>
            {congresista.cargo && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                {congresista.cargo}
              </div>
            )}
          </div>
        </div>

        {/* KPI cards inline to the right - solo mostrar para diputados */}
        {congresista.tipo === 'diputado' && (
          <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0">
            <Card className="min-w-[140px]">
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-[11px] text-muted-foreground leading-tight mb-1">Proyectos presentados</p>
                <p className="text-2xl font-bold text-foreground">{stats.proyectosCount}</p>
              </CardContent>
            </Card>
            <Card className="min-w-[130px]">
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-[11px] text-muted-foreground leading-tight mb-1">Leyes aprobadas</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.leyesAprobadas}</p>
              </CardContent>
            </Card>
            <Card className="min-w-[120px]">
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-[11px] text-muted-foreground leading-tight mb-1">Tasa aprobación</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.porcentajeAprobacion}%</p>
              </CardContent>
            </Card>
            <Card className="min-w-[160px]">
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-[11px] text-muted-foreground leading-tight mb-2">Top comisiones</p>
                <div className="space-y-0.5">
                  {stats.topSectores.slice(0, 3).map((sector) => (
                    <div key={sector.sectorId} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-foreground line-clamp-1">{sector.sectorName}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">{sector.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Parties and Positions History */}
      <div className={`grid gap-6 ${congresista.tipo === 'diputado' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Party History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de partidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {partieHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-2 border-b border-border last:border-b-0">
                  <p className="font-medium text-sm text-foreground">{item.partido}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.fechaInicio} {item.fechaFin ? `- ${item.fechaFin}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Positions History - solo para diputados */}
        {congresista.tipo === 'diputado' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cargos en el Congreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {positionsHistory.length > 0 ? (
                positionsHistory.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 p-2 border-b border-border last:border-b-0">
                    <p className="font-medium text-sm text-foreground flex items-center gap-2 min-w-0">
                      <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{item.cargo}</span>
                    </p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.fechaInicio} {item.fechaFin ? `- ${item.fechaFin}` : ''}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin cargos registrados</p>
              )}
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Perfil Cualitativo */}
      {congresista.perfilCualitativo && (
        <PerfilCualitativoCard texto={congresista.perfilCualitativo} />
      )}

      {/* Charts - solo para diputados */}
      {congresista.tipo === 'diputado' && (
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Proyectos por sector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyectos regulatorios por sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorChartData} margin={{ top: 8, right: 12, left: -8, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="proyectos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estado de proyectos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Proyectos regulatorios por estado</CardTitle>
          </CardHeader>
          <CardContent>
            {statusChartData && statusChartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ estado, count }) => `${estado}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} proyectos`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      )}

      {/* Projects Table - solo para diputados */}
      {congresista.tipo === 'diputado' && (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proyectos regulatorios presentados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Free text search */}
            <div className="relative w-52">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por ID o medida…"
                className="pl-8 h-8 text-sm"
              />
            </div>
            {/* Comisión */}
            <div className="w-44">
              <MultiSelect options={comisionOptions} selected={selectedComisiones} onChange={setSelectedComisiones} placeholder="Comisión" />
            </div>
            {/* Estado */}
            <div className="w-36">
              <MultiSelect options={estadoOptions} selected={selectedEstados} onChange={setSelectedEstados} placeholder="Estado" />
            </div>
            {/* Probabilidad */}
            <div className="w-40">
              <MultiSelect options={probabilidadOptions} selected={selectedProbabilidad} onChange={setSelectedProbabilidad} placeholder="Probabilidad" />
            </div>
            {/* Tipo de autor */}
            <div className="w-40">
              <MultiSelect options={tipoAutorOptions} selected={selectedTipoAutor} onChange={setSelectedTipoAutor} placeholder="Tipo de autor" />
            </div>
            {/* Date range */}
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">a</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground h-8 px-2">
                <X className="h-3.5 w-3.5" />
                Limpiar
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHead column="numero" sort={projectsSort} onSort={toggleProjectsSort} className="w-[80px]">ID</SortableHead>
                  <SortableHead column="titulo" sort={projectsSort} onSort={toggleProjectsSort} className="w-[250px]">Medida</SortableHead>
                  <SortableHead column="comision" sort={projectsSort} onSort={toggleProjectsSort} className="w-[120px]">Comisión</SortableHead>
                  <SortableHead column="estado" sort={projectsSort} onSort={toggleProjectsSort} className="w-[100px]">Estado</SortableHead>
                  <SortableHead column="probabilidadAprobacion" sort={projectsSort} onSort={toggleProjectsSort} className="w-[80px] text-center">Prob.</SortableHead>
                  <TableHead className="w-[110px]">Tipo de autor</TableHead>
                  <SortableHead column="fechaPresentacion" sort={projectsSort} onSort={toggleProjectsSort} className="w-[100px]">Presentación</SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No hay proyectos registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProjects.map((proyecto) => (
                    <TableRow key={proyecto.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-primary hover:underline text-xs"
                          onClick={() => onViewProject?.(proyecto)}
                        >
                          {proyecto.numero}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium line-clamp-2 leading-snug">
                          {proyecto.titulo}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="line-clamp-1">{proyecto.comision}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className="text-[10px] whitespace-nowrap bg-primary/20 text-primary">
                          {proyecto.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium">
                        {proyecto.estado === 'Aprobado' || proyecto.estado === 'Archivado' ? (
                          ''
                        ) : proyecto.probabilidadAprobacion >= 67 ? (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-1 rounded text-[10px] font-semibold">
                            Alta
                          </span>
                        ) : proyecto.probabilidadAprobacion >= 34 ? (
                          <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-1 rounded text-[10px] font-semibold">
                            Media
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 px-2 py-1 rounded text-[10px] font-semibold">
                            Baja
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {proyecto.autorPrincipal?.id === congresista.id ? (
                          <Badge className="text-[10px] bg-primary/20 text-primary">Autor principal</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">Firmante</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(proyecto.fechaPresentacion).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Congresistas vinculados - solo para diputados */}
      {congresista.tipo === 'diputado' && (
      <Card>
        <CardHeader>
            <CardTitle className="text-base">Congresistas coautores o firmantes en PL</CardTitle>
        </CardHeader>
        <CardContent>
          {linkedCongresistas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay congresistas coautores registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Partido</TableHead>
                    <TableHead className="text-center">Proyectos compartidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedCongresistas.map((item) => (
                    <TableRow key={item.congresista.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">
                        {item.congresista.nombre}
                      </TableCell>
                      <TableCell>
                        <Badge className="text-[10px]">
                          {item.congresista.partido}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        <button
                          onClick={() => setSharedPopup({ nombre: item.congresista.nombre, proyectos: item.sharedProjects })}
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {item.projectCount}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Actividad en X (Twitter) con Word Cloud y filtros */}
      <TwitterActivitySection
        congresista={congresista}
        selectedTopic={selectedTweetTopic}
        onTopicSelect={setSelectedTweetTopic}
      />
    </div>

    {/* Export Word Modal */}
    <ExportWordModal
      open={exportModalOpen}
      onOpenChange={setExportModalOpen}
      congresista={congresista}
      projects={congresistProjects}
      coautores={linkedCongresistas.map(c => ({
        nombre: c.congresista.nombre,
        partido: c.congresista.partido,
        count: c.projectCount,
      }))}
      stats={stats}
    />

    {/* Shared projects popup */}
    <Dialog open={!!sharedPopup} onOpenChange={(open) => !open && setSharedPopup(null)}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            Proyectos de ley compartidos con {sharedPopup?.nombre}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Lista de proyectos de ley en los que ambos congresistas participan como coautores
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[110px]">ID</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead className="w-[110px]">Estado</TableHead>
              <TableHead className="w-[72px] text-center">Prob.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sharedPopup?.proyectos.map((proyecto) => (
              <TableRow
                key={proyecto.numero}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => { onViewProject?.(proyecto); setSharedPopup(null) }}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{proyecto.numero}</TableCell>
                <TableCell className="text-sm">{proyecto.titulo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px]">{proyecto.estado}</Badge>
                </TableCell>
                <TableCell className="text-center text-xs font-semibold">
                  {proyecto.estado === 'Aprobado' || proyecto.estado === 'Archivado' ? (
                    ''
                  ) : proyecto.probabilidadAprobacion >= 67 ? (
                    <span className="text-emerald-600">Alta</span>
                  ) : proyecto.probabilidadAprobacion >= 34 ? (
                    <span className="text-yellow-600">Media</span>
                  ) : (
                    <span className="text-red-600">Baja</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
    </>
  )
}
