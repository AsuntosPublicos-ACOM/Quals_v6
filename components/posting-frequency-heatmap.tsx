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
    // Count tweets per legislator
    const tweetCounts: Map<string, number> = new Map()
    tweets.forEach(tweet => {
      const autorId = tweet.autor?.id || tweet.autorId
      tweetCounts.set(autorId, (tweetCounts.get(autorId) || 0) + 1)
    })

    // Categorize legislators
    const postingFrequency: Map<string, PostingFrequency> = new Map()
    const projectCounts: Map<string, ProjectCount> = new Map()

    congresistas.forEach(c => {
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
    congresistas.forEach(c => {
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
    if (value === 0) return 'bg-muted/20'
    if (value < 3) return 'bg-blue-100 dark:bg-blue-900/30'
    if (value < 7) return 'bg-blue-300 dark:bg-blue-700/60'
    return 'bg-blue-600 dark:bg-blue-900'
  }

  const getTextColor = (value: number) => {
    if (value < 7) return 'text-foreground'
    return 'text-white'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-border bg-muted/50 p-3 text-left font-semibold">Frecuencia de posteos</th>
            <th className="border border-border bg-muted/50 p-3 text-center font-semibold">Pocos (1-5)</th>
            <th className="border border-border bg-muted/50 p-3 text-center font-semibold">Moderados (6-15)</th>
            <th className="border border-border bg-muted/50 p-3 text-center font-semibold">Muchos (16+)</th>
          </tr>
        </thead>
        <tbody>
          {heatmapData.map((row) => (
            <tr key={row.positing}>
              <td className="border border-border bg-muted/30 p-3 font-medium">{row.positing}</td>
              {(['Pocos (1-5)', 'Moderados (6-15)', 'Muchos (16+)'] as const).map((colKey) => (
                <td
                  key={`${row.positing}-${colKey}`}
                  className={`border border-border p-3 text-center font-semibold transition-colors ${getCellColor(row[colKey])} ${getTextColor(row[colKey])}`}
                >
                  {row[colKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
