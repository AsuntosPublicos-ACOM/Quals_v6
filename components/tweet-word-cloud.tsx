'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WordFrequency } from '@/lib/types'

interface TweetWordCloudProps {
  words: WordFrequency[]
  onWordClick?: (word: string) => void
  selectedWord?: string
}

export function TweetWordCloud({ words: wordsProp, onWordClick, selectedWord }: TweetWordCloudProps) {
  const [hoveredWord, setHoveredWord] = useState<string>()
  const words = Array.isArray(wordsProp) ? wordsProp : []

  const cloudData = useMemo(() => {
    if (words.length === 0) return []

    const maxFreq = Math.max(...words.map(w => w.frequency))
    const minFreq = Math.min(...words.map(w => w.frequency))
    const range = maxFreq - minFreq || 1

    return words.map(word => ({
      ...word,
      fontSize: 13 + ((word.frequency - minFreq) / range) * 48,
      opacity: 0.6 + ((word.frequency - minFreq) / range) * 0.4
    }))
  }, [words])

  // Distribuir palabras en un patrón radial mejorado
  const positionedWords = useMemo(() => {
    return cloudData.map((word, index) => {
      const angle = (index / cloudData.length) * Math.PI * 2
      const baseRadius = 35 + ((word.fontSize - 13) / 48) * 70
      const radius = baseRadius + (Math.random() - 0.5) * 20
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      return { ...word, x, y }
    })
  }, [cloudData])

  const getColorClass = (frequency: number, maxFreq: number, isHovered: boolean) => {
    const ratio = frequency / maxFreq
    
    if (isHovered) {
      if (ratio > 0.75) return 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg'
      if (ratio > 0.5) return 'bg-gradient-to-br from-blue-400 to-blue-300 text-white shadow-lg'
      if (ratio > 0.25) return 'bg-gradient-to-br from-slate-400 to-slate-300 text-white shadow-lg'
      return 'bg-gradient-to-br from-slate-300 to-slate-200 text-white shadow-lg'
    }
    
    if (ratio > 0.75) return 'text-blue-700 dark:text-blue-300'
    if (ratio > 0.5) return 'text-blue-600 dark:text-blue-400'
    if (ratio > 0.25) return 'text-slate-600 dark:text-slate-400'
    return 'text-slate-500 dark:text-slate-500'
  }

  if (words.length === 0) {
    return (
      <Card className="col-span-12 lg:col-span-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">☁️</span>
            Nube de Palabras
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">No hay tweets disponibles</p>
        </CardContent>
      </Card>
    )
  }

  const maxFreq = Math.max(...words.map(w => w.frequency))

  return (
    <Card className="col-span-12 lg:col-span-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">☁️</span>
              Nube de Palabras
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">Haz clic en una palabra para filtrar</p>
          </div>
          {selectedWord && (
            <Badge 
              variant="secondary"
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => onWordClick?.(selectedWord)}
            >
              {selectedWord} ✕
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-slate-50/50 dark:from-slate-900/40 dark:via-blue-900/20 dark:to-slate-900/40 overflow-hidden flex items-center justify-center">
          {/* Efectos de fondo decorativos */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200 via-cyan-200 to-transparent dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-transparent rounded-full blur-3xl opacity-40 animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-200 via-slate-200 to-transparent dark:from-blue-900/30 dark:via-slate-900/20 dark:to-transparent rounded-full blur-3xl opacity-30" />
          </div>

          {/* Contenedor de palabras */}
          <div className="relative w-full h-full flex items-center justify-center">
            {positionedWords.map(word => {
              const isSelected = selectedWord === word.word
              const isHovered = hoveredWord === word.word
              const scale = isSelected ? 1.35 : isHovered ? 1.2 : 1

              return (
                <button
                  key={word.word}
                  onClick={() => onWordClick?.(word.word)}
                  onMouseEnter={() => setHoveredWord(word.word)}
                  onMouseLeave={() => setHoveredWord(undefined)}
                  className={`
                    absolute whitespace-nowrap font-bold transition-all duration-300 ease-out
                    ${isSelected 
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-xl ring-2 ring-blue-300 dark:ring-blue-700 rounded-full px-4 py-2' 
                      : isHovered
                      ? `${getColorClass(word.frequency, maxFreq, true)} rounded-full px-3 py-1.5`
                      : `${getColorClass(word.frequency, maxFreq, false)} hover:drop-shadow-lg`
                    }
                  `}
                  style={{
                    left: `calc(50% + ${word.x}px)`,
                    top: `calc(50% + ${word.y}px)`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    fontSize: `${word.fontSize}px`,
                    opacity: word.opacity,
                    letterSpacing: '-0.3px'
                  }}
                  title={`${word.word} (${word.frequency} tweets)`}
                >
                  {word.word}
                </button>
              )
            })}
          </div>
        </div>

        {/* Estadísticas estilizadas */}
        <div className="mt-6 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-xl border border-blue-200 dark:border-blue-800/50 p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Palabras Únicas</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{words.length}</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-cyan-200 dark:border-cyan-800/50 p-4 bg-gradient-to-br from-cyan-50 to-cyan-50/50 dark:from-cyan-900/20 dark:to-cyan-900/10 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Top Palabra</p>
                <p className="text-lg font-black text-cyan-600 dark:text-cyan-400 mt-2 truncate">{words[0]?.word || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
