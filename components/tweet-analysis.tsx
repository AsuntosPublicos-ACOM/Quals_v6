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
import { TweetsActivityChart } from './tweets-activity-chart'
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
        {/* Resumen de datos - Tarjetas simplificadas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total de publicaciones</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{tweets.length}</p>
          </div>
          <div className="rounded-xl border border-cyan-200 dark:border-cyan-800/50 p-4 bg-gradient-to-br from-cyan-50 to-cyan-50/50 dark:from-cyan-900/20 dark:to-cyan-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Publicaciones filtradas</p>
            <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">{filteredTweets.length}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-4 bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Autores</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{authorCount}</p>
          </div>
        </div>

        {/* Grid principal: Filtros + Nube + Tweets */}
        <div className="grid grid-cols-12 gap-4">
          {/* Filtros - Reordenados */}
          <div className="col-span-12 lg:col-span-3">
            <TweetFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              partidos={partidos}
              legisladores={legisladores}
              sectores={sectores}
              filterOrder={['fechas', 'sectores', 'partidos', 'legisladores']}
            />
          </div>

          {/* Nube de palabras - Ocupa todo el lado derecho */}
          <div className="col-span-12 lg:col-span-9">
            <div className="rounded-lg border border-border bg-card p-6 h-96 lg:h-[500px]">
              <h3 className="text-sm font-semibold mb-4">Nube de palabras</h3>
              <TweetWordCloud
                words={wordFrequencies}
                onWordClick={handleWordClick}
                selectedWord={selectedWord}
              />
            </div>
          </div>
        </div>

        {/* Gráfico: Actividad en X vs Producción Legislativa */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Actividad en X vs Producción legislativa</h3>
            <p className="text-xs text-muted-foreground">Comparativa mensual entre publicaciones en X y proyectos de ley presentados</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <TweetsActivityChart
              tweets={filteredTweets}
              congresistas={congresistas}
              filters={filters}
            />
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
