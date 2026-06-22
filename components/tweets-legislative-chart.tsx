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
    // If no tweets filtered, use all tweets
    const tweetsToUse = tweets.length === 0 ? congresistas.flatMap(c => c.tweets || []) : tweets
    
    // Group tweets by month
    const tweetsByMonth = new Map<string, number>()
    const legislativeByMonth = new Map<string, number>()

    tweetsToUse.forEach(tweet => {
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{payload[0]?.payload?.month}</p>
          <div className="space-y-1">
            {payload.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}:</span>
                <span className="text-xs font-semibold text-foreground">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        No hay datos disponibles para mostrar el gráfico
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 40, left: 10, bottom: 50 }}>
        <defs>
          <linearGradient id="colorTweets" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="hsl(var(--border))" 
          vertical={false}
          opacity={0.5}
        />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          yAxisId="left" 
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: 'Publicaciones en X', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: 'hsl(var(--foreground))' } }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: 'Proyectos de ley', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 11, fill: 'hsl(var(--foreground))' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
        <Legend 
          wrapperStyle={{ paddingTop: 20 }}
          iconType="square"
          formatter={(value) => (
            <span style={{ fontSize: 12, color: 'hsl(var(--foreground))' }}>
              {value === 'tweets' ? 'Publicaciones en X' : 'Proyectos presentados'}
            </span>
          )}
        />
        <Bar
          yAxisId="left"
          dataKey="tweets"
          fill="url(#colorTweets)"
          name="tweets"
          radius={[6, 6, 0, 0]}
          opacity={0.9}
        />
        <Line
          yAxisId="right"
          type="natural"
          dataKey="proyectos"
          stroke="hsl(var(--destructive))"
          name="proyectos"
          strokeWidth={3}
          dot={{ fill: 'hsl(var(--destructive))', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          activeDot={{ r: 7 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
