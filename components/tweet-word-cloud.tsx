'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import type { WordFrequency } from '@/lib/types'

interface TweetWordCloudProps {
  words: WordFrequency[]
  onWordClick?: (word: string) => void
  selectedWord?: string
}

export function TweetWordCloud({ words, onWordClick, selectedWord }: TweetWordCloudProps) {
  const [hoveredWord, setHoveredWord] = useState<string>()

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
      <div className="h-full flex items-center justify-center min-h-96 rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">No hay tweets disponibles</p>
      </div>
    )
  }

  const maxFreq = Math.max(...words.map(w => w.frequency))

  return (
    <div className="relative w-full h-full rounded-lg border border-border bg-card p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Haz clic en una palabra para filtrar</p>
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
      
      <div className="relative flex-1 rounded-lg bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-slate-50/50 dark:from-slate-900/20 dark:via-blue-900/10 dark:to-slate-900/20 overflow-hidden flex items-center justify-center min-h-80">
        {/* Efectos de fondo decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-200 via-cyan-200 to-transparent dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-200 via-slate-200 to-transparent dark:from-blue-900/20 dark:via-slate-900/10 dark:to-transparent rounded-full blur-3xl opacity-20" />
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
    </div>
  )
}
