'use client'

import { useState, useEffect, useMemo } from 'react'
import { Loader2, ChevronDown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Congresista, Sector, TweetFilters } from '@/lib/types'
import { fetchMultipleCongresistaTweets } from '@/lib/twitter-service'
import { filterTweetsByFilters, generateWordFrequencies } from '@/lib/tweet-utils'
import { TweetFiltersPanel } from './tweet-filters'
import { TweetWordCloud } from './tweet-word-cloud'
import { TweetList } from './tweet-list'
import { TweetsLegislativeChart } from './tweets-legislative-chart'
import { PostingFrequencyHeatmap } from './posting-frequency-heatmap'

interface TweetAnalysisProps {
  congresistas: Congresista[]
  sectores: Sector[]
}

export function TweetAnalysis({ congresistas, sectores }: TweetAnalysisProps) {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('actividad-x')
  const [filters, setFilters] = useState<TweetFilters>({
    fechaDesde: undefined,
    fechaHasta: undefined,
    sectores: [],
    partidos: [],
    legisladores: []
  })
  const [selectedWord, setSelectedWord] = useState<string>()
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Cargar tweets al montar el componente
  useEffect(() => {
    const loadTweets = async () => {
      try {
        setLoading(true)
        const allTweets = await fetchMultipleCongresistaTweets(congresistas)
        setTweets(allTweets)
      } catch (error) {
        console.error('Error loading tweets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTweets()
  }, [congresistas])

  // Filtrar tweets según filtros activos
  const filteredTweets = useMemo(() => {
    let filtered = filterTweetsByFilters(tweets, filters)

    // Filtrar por palabra seleccionada si hay una
    if (selectedWord) {
      filtered = filtered.filter(tweet =>
        tweet.texto.toLowerCase().includes(selectedWord.toLowerCase())
      )
    }

    return filtered
  }, [tweets, filters, selectedWord])

  // Generar frecuencias de palabras a partir de tweets filtrados
  const wordFrequencies = useMemo(() => {
    return generateWordFrequencies(filteredTweets)
  }, [filteredTweets])

  // Obtener lista única de partidos
  const partidos = useMemo(() => {
    return Array.from(new Set(congresistas.map(c => c.partido))).sort()
  }, [congresistas])

  // Obtener lista de legisladores con sus IDs
  const legisladores = useMemo(() => {
    return congresistas.map(c => ({ id: c.id, nombre: c.nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [congresistas])

  // Obtener autores de los tweets filtrados
  const authorCount = useMemo(() => {
    const authors = new Set(filteredTweets.map(t => t.autor?.id || t.autorId))
    return authors.size
  }, [filteredTweets])

  const handleWordClick = (word: string) => {
    setSelectedWord(selectedWord === word ? undefined : word)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando tweets...</span>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="actividad-x">Actividad en X</TabsTrigger>
        <TabsTrigger value="produccion-legislativa">Producción legislativa/redes</TabsTrigger>
      </TabsList>

      {/* TAB 1: ACTIVIDAD EN X */}
      <TabsContent value="actividad-x" className="space-y-6">
        {/* Filtros + Nube juntos en una sección */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Filtros - Izquierda (50%) */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Filtros</h3>
              <TweetFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                partidos={partidos}
                legisladores={legisladores}
                sectores={sectores}
                filterOrder={['fechas', 'sectores', 'partidos', 'legisladores']}
              />
            </div>

            {/* Nube de palabras - Derecha (50%) */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Nube de palabras</h3>
              <div className="h-full">
                <TweetWordCloud
                  words={wordFrequencies}
                  onWordClick={handleWordClick}
                  selectedWord={selectedWord}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tweets - Full width abajo */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-sm font-semibold mb-4">Tweets</h3>
          <TweetList
            tweets={filteredTweets}
            highlightWord={selectedWord}
            emptyMessage={
              selectedWord
                ? `No hay tweets que contengan "${selectedWord}"`
                : 'No hay tweets disponibles con los filtros seleccionados'
            }
          />
        </div>
      </TabsContent>

      {/* TAB 2: PRODUCCIÓN LEGISLATIVA/REDES */}
      <TabsContent value="produccion-legislativa" className="space-y-8">
        {/* Filtros colapsables */}
        <div className="space-y-2 pb-6 border-b border-border/50">
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="flex items-center justify-between w-full hover:opacity-75 transition-opacity"
          >
            <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
            <ChevronDown 
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                filtersExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {filtersExpanded && (
            <div className="pt-4 animate-in fade-in-50 duration-200">
              <TweetFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                partidos={partidos}
                legisladores={legisladores}
                sectores={sectores}
                filterOrder={['fechas', 'sectores', 'partidos', 'legisladores']}
              />
            </div>
          )}
        </div>

        {/* Gráfico 1: Tweets vs Producción Legislativa */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Actividad en redes vs Producción legislativa</h3>
            <p className="text-xs text-muted-foreground">Comparativa mensual entre publicaciones en X y proyectos de ley presentados</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <TweetsLegislativeChart
              tweets={filteredTweets}
              congresistas={congresistas}
              filters={filters}
            />
          </div>
        </div>

        {/* Gráfico 2: Heatmap de Frecuencia de Posteos vs Proyectos */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Correlación: Frecuencia de posteos vs Proyectos presentados</h3>
            <p className="text-xs text-muted-foreground">Matriz que muestra la relación entre actividad en redes y producción legislativa por congresista</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <PostingFrequencyHeatmap
              tweets={filteredTweets}
              congresistas={congresistas}
              filters={filters}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
