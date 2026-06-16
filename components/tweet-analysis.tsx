'use client'

import { useState, useEffect, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import type { Congresista, Sector, TweetFilters } from '@/lib/types'
import { fetchMultipleCongresistaTweets } from '@/lib/twitter-service'
import { filterTweetsByFilters, generateWordFrequencies } from '@/lib/tweet-utils'
import { TweetFiltersPanel } from './tweet-filters'
import { TweetWordCloud } from './tweet-word-cloud'
import { TweetList } from './tweet-list'

interface TweetAnalysisProps {
  congresistas: Congresista[]
  sectores: Sector[]
}

export function TweetAnalysis({ congresistas, sectores }: TweetAnalysisProps) {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TweetFilters>({
    fechaDesde: undefined,
    fechaHasta: undefined,
    sectores: [],
    partidos: [],
    legisladores: []
  })
  const [selectedWord, setSelectedWord] = useState<string>()

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
    <div className="space-y-6">
      {/* Resumen de datos - Tarjetas mejoradas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{tweets.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">tweets disponibles</p>
        </div>
        <div className="rounded-xl border border-cyan-200 dark:border-cyan-800/50 p-4 bg-gradient-to-br from-cyan-50 to-cyan-50/50 dark:from-cyan-900/20 dark:to-cyan-900/10 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Filtrados</p>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{filteredTweets.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">en resultados</p>
        </div>
        <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 p-4 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Palabras</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{wordFrequencies.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">únicas detectadas</p>
        </div>
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-4 bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">Autores</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{congresistas.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">legisladores</p>
        </div>
      </div>

      {/* Grid principal: Filtros + Nube + Tweets */}
      <div className="grid grid-cols-12 gap-4">
        {/* Filtros */}
        <TweetFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          partidos={partidos}
          legisladores={legisladores}
          sectores={sectores}
        />

        {/* Nube de palabras y lista de tweets */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-4">
          <TweetWordCloud
            words={wordFrequencies}
            onWordClick={handleWordClick}
            selectedWord={selectedWord}
          />
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
      </div>
    </div>
  )
}
