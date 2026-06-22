'use client'

import { useMemo } from 'react'
import type { Congresista, TweetFilters } from '@/lib/types'

interface PostingFrequencyHeatmapProps {
  tweets: any[]
  congresistas: Congresista[]
  filters: TweetFilters
}

type PostingFrequency = 'Muy activo' | 'Activo regular' | 'Poco activo'
type ProjectCount = 'Pocos (1-5)' | 'Moderados (6-15)' | 'Muchos (16+)'

interface HeatmapData {
  positing: PostingFrequency
  'Pocos (1-5)': number
  'Moderados (6-15)': number
  'Muchos (16+)': number
}

export function PostingFrequencyHeatmap({ tweets, congresistas, filters }: PostingFrequencyHeatmapProps) {
  const heatmapData = useMemo(() => {
    // If no tweets filtered, get top 3 congresistas by total tweet count
    const tweetsToUse = tweets.length === 0 
      ? congresistas.flatMap(c => c.tweets || [])
      : tweets

    // If no tweets, use top 3 by total tweet count
    let congreistasToAnalyze = congresistas
    if (tweets.length === 0) {
      const tweetCountsByIds = new Map<string, number>()
      congresistas.forEach(c => {
        const count = c.tweets?.length || 0
        tweetCountsByIds.set(c.id, count)
      })
      congreistasToAnalyze = congresistas
        .sort((a, b) => (tweetCountsByIds.get(b.id) || 0) - (tweetCountsByIds.get(a.id) || 0))
        .slice(0, 3)
    }

    // Count tweets per legislator
    const tweetCounts: Map<string, number> = new Map()
    tweetsToUse.forEach(tweet => {
      const autorId = tweet.autor?.id || tweet.autorId
      tweetCounts.set(autorId, (tweetCounts.get(autorId) || 0) + 1)
    })

    // Categorize legislators
    const postingFrequency: Map<string, PostingFrequency> = new Map()
    const projectCounts: Map<string, ProjectCount> = new Map()

    congreistasToAnalyze.forEach(c => {
      const tweetCount = tweetCounts.get(c.id) || 0
      const projectCount = c.proyectos?.length || 0

      // Categorize posting frequency
      if (tweetCount > 50) {
        postingFrequency.set(c.id, 'Muy activo')
      } else if (tweetCount >= 20) {
        postingFrequency.set(c.id, 'Activo regular')
      } else {
        postingFrequency.set(c.id, 'Poco activo')
      }

      // Categorize project count
      if (projectCount >= 16) {
        projectCounts.set(c.id, 'Muchos (16+)')
      } else if (projectCount >= 6) {
        projectCounts.set(c.id, 'Moderados (6-15)')
      } else {
        projectCounts.set(c.id, 'Pocos (1-5)')
      }
    })

    // Build heatmap matrix
    const matrix: HeatmapData[] = [
      {
        positing: 'Muy activo',
        'Pocos (1-5)': 0,
        'Moderados (6-15)': 0,
        'Muchos (16+)': 0
      },
      {
        positing: 'Activo regular',
        'Pocos (1-5)': 0,
        'Moderados (6-15)': 0,
        'Muchos (16+)': 0
      },
      {
        positing: 'Poco activo',
        'Pocos (1-5)': 0,
        'Moderados (6-15)': 0,
        'Muchos (16+)': 0
      }
    ]

    // Fill matrix with legislator counts
    congreistasToAnalyze.forEach(c => {
      const freq = postingFrequency.get(c.id)
      const projCount = projectCounts.get(c.id)
      if (freq && projCount) {
        const row = matrix.find(r => r.positing === freq)
        if (row) {
          row[projCount as ProjectCount]++
        }
      }
    })

    return matrix
  }, [tweets, congresistas])

  const getCellColor = (value: number) => {
    if (value === 0) return 'bg-muted/10 hover:bg-muted/20'
    if (value === 1) return 'bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
    if (value === 2) return 'bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
    if (value < 5) return 'bg-cyan-200 dark:bg-cyan-900/40 hover:bg-cyan-300 dark:hover:bg-cyan-900/60'
    return 'bg-blue-500 dark:bg-blue-900/70 hover:bg-blue-600 dark:hover:bg-blue-800'
  }

  const getTextColor = (value: number) => {
    if (value === 0 || value === 1 || value === 2) return 'text-foreground'
    if (value < 5) return 'text-foreground'
    return 'text-white dark:text-slate-100'
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="bg-muted/50 px-4 py-3 text-left text-sm font-semibold text-foreground">Frecuencia de posteos</th>
              <th className="bg-muted/50 px-4 py-3 text-center text-sm font-semibold text-foreground border-l border-border">Pocos (1-5)</th>
              <th className="bg-muted/50 px-4 py-3 text-center text-sm font-semibold text-foreground border-l border-border">Moderados (6-15)</th>
              <th className="bg-muted/50 px-4 py-3 text-center text-sm font-semibold text-foreground border-l border-border">Muchos (16+)</th>
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, rowIdx) => (
              <tr key={row.positing} className={rowIdx < heatmapData.length - 1 ? 'border-b border-border' : ''}>
                <td className="bg-muted/30 px-4 py-3 text-sm font-medium text-foreground">{row.positing}</td>
                {(['Pocos (1-5)', 'Moderados (6-15)', 'Muchos (16+)'] as const).map((colKey) => (
                  <td
                    key={`${row.positing}-${colKey}`}
                    className={`border-l border-border px-4 py-3 text-center font-bold text-base transition-all duration-200 ${getCellColor(row[colKey])} ${getTextColor(row[colKey])}`}
                  >
                    <div className="flex items-center justify-center">
                      <span>{row[colKey]}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Leyenda */}
      <div className="grid grid-cols-4 gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-muted/10"></div>
          <span className="text-muted-foreground">Sin datos</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/30"></div>
          <span className="text-muted-foreground">Bajo (1-2)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-cyan-200 dark:bg-cyan-900/40"></div>
          <span className="text-muted-foreground">Medio (3-4)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-4 h-4 rounded bg-blue-500 dark:bg-blue-900/70"></div>
          <span className="text-muted-foreground">Alto (5+)</span>
        </div>
      </div>
    </div>
  )
}
