'use client'

import { useMemo } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Congresista, TweetFilters } from '@/lib/types'

interface TweetsLegislativeChartProps {
  tweets: any[]
  congresistas: Congresista[]
  filters: TweetFilters
}

export function TweetsLegislativeChart({ tweets, congresistas, filters }: TweetsLegislativeChartProps) {
  const chartData = useMemo(() => {
    // Group tweets by month
    const tweetsByMonth = new Map<string, number>()
    const legislativeByMonth = new Map<string, number>()

    tweets.forEach(tweet => {
      const date = new Date(tweet.fecha)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      tweetsByMonth.set(monthKey, (tweetsByMonth.get(monthKey) || 0) + 1)
    })

    // Mock legislative production by month (in real app, fetch from data)
    congresistas.forEach(c => {
      const proyectos = c.proyectos || []
      proyectos.forEach((p: any) => {
        const date = new Date(p.fechaPresentacion)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        legislativeByMonth.set(monthKey, (legislativeByMonth.get(monthKey) || 0) + 1)
      })
    })

    // Merge data
    const allMonths = new Set([...tweetsByMonth.keys(), ...legislativeByMonth.keys()])
    return Array.from(allMonths)
      .sort()
      .map(month => ({
        month: month.split('-').reverse().join('/'),
        tweets: tweetsByMonth.get(month) || 0,
        proyectos: legislativeByMonth.get(month) || 0
      }))
  }, [tweets, congresistas])

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No hay datos disponibles para mostrar el gráfico
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
        <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
        <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value) => [value, value]}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="tweets"
          fill="hsl(var(--primary))"
          name="Tweets publicados"
          radius={[8, 8, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="proyectos"
          stroke="hsl(var(--chart-1))"
          name="Proyectos de ley"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
