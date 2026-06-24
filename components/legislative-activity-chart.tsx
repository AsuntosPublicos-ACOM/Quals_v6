'use client'

import { useMemo } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Congresista } from '@/lib/types'
import type { LegislativeFilterState } from './legislative-filters'

interface LegislativeActivityChartProps {
  tweets: any[]
  congresistas: Congresista[]
  filters: LegislativeFilterState
}

// Mock data generator para demostración
function generateMockData(congresistas: Congresista[]) {
  return congresistas.slice(0, 50).map(c => ({
    id: c.id,
    nombre: c.nombre,
    sector: c.sector,
    partido: c.partido,
    tweets: Array.from({ length: Math.random() * 50 }, (_, i) => ({
      id: `tweet-${c.id}-${i}`,
      fecha: new Date(2023 + Math.floor(Math.random() * 3), Math.random() * 12, Math.random() * 28),
      content: `Tweet sobre ${c.sector}`,
      congresista_id: c.id,
      congresistaNombre: c.nombre
    })),
    proyectos: Array.from({ length: Math.random() * 8 }, (_, i) => ({
      id: `proyecto-${c.id}-${i}`,
      fechaPresentacion: new Date(2021 + Math.floor(Math.random() * 5), Math.random() * 12, Math.random() * 28),
      nombre: `Proyecto sobre ${c.sector}`
    }))
  }))
}

export function LegislativeActivityChart({ 
  tweets: externalTweets, 
  congresistas,
  filters 
}: LegislativeActivityChartProps) {
  
  const chartData = useMemo(() => {
    // Use mock data if no tweets provided
    const mockCongresistas = generateMockData(congresistas)
    
    // Determine period range - use dateFrom/dateTo or full range by default
    const dateStart = filters.dateFrom || new Date(2020, 0, 1)
    const dateEnd = filters.dateTo || new Date()

    // Apply filters
    let targetCongresistas = mockCongresistas
    if (filters.sectors.length > 0) {
      targetCongresistas = targetCongresistas.filter(c => filters.sectors.includes(c.sector))
    }
    if (filters.partidos.length > 0) {
      targetCongresistas = targetCongresistas.filter(c => filters.partidos.includes(c.partido))
    }
    if (filters.legisladores.length > 0) {
      targetCongresistas = targetCongresistas.filter(c => filters.legisladores.includes(c.id))
    }

    // Get top 10 by tweet count
    const topLegisladores = targetCongresistas
      .map(c => ({
        ...c,
        tweetCount: c.tweets.filter(t => t.fecha >= dateStart && t.fecha <= dateEnd).length,
        proyectosCount: c.proyectos.filter(p => p.fechaPresentacion >= dateStart && p.fechaPresentacion <= dateEnd).length
      }))
      .filter(c => c.tweetCount > 0 || c.proyectosCount > 0)
      .sort((a, b) => b.tweetCount - a.tweetCount)
      .slice(0, 10)

    if (topLegisladores.length === 0) return []

    // Group by semester
    const tweetsBySemester = new Map<string, { sectorTweets: number; otherTweets: number; proyectos: number }>()
    
    topLegisladores.forEach(c => {
      c.tweets.filter(t => t.fecha >= dateStart && t.fecha <= dateEnd).forEach((tweet: any) => {
        const date = new Date(tweet.fecha)
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-S${semester}`
        
        if (!tweetsBySemester.has(semesterKey)) {
          tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
        }
        tweetsBySemester.get(semesterKey)!.sectorTweets += 1
      })

      c.proyectos.filter(p => p.fechaPresentacion >= dateStart && p.fechaPresentacion <= dateEnd).forEach((proyecto: any) => {
        const date = new Date(proyecto.fechaPresentacion)
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-S${semester}`
        
        if (!tweetsBySemester.has(semesterKey)) {
          tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
        }
        tweetsBySemester.get(semesterKey)!.proyectos += 1
      })
    })

    return Array.from(tweetsBySemester.entries())
      .map(([periodo, counts]) => ({
        periodo,
        publicacionesSector: counts.sectorTweets,
        publicacionesOtros: counts.otherTweets,
        proyectosLey: counts.proyectos
      }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo))
  }, [congresistas, filters])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{payload[0]?.payload?.periodo}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Publicaciones (sector): <span className="font-semibold">{payload[0]?.payload?.publicacionesSector}</span></p>
            <p className="text-xs text-muted-foreground">Proyectos de ley: <span className="font-semibold">{payload[0]?.payload?.proyectosLey}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-muted-foreground">
        Sin datos disponibles para los filtros seleccionados
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 40, left: 10, bottom: 50 }}>
        <defs>
          <linearGradient id="colorSector" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="colorOtros" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
        <XAxis 
          dataKey="periodo" 
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          yAxisId="left" 
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: 'Publicaciones', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: 'hsl(var(--foreground))' } }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          label={{ value: 'Proyectos', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 11, fill: 'hsl(var(--foreground))' } }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} />
        <Legend wrapperStyle={{ paddingTop: 20 }} formatter={(value) => (
          <span style={{ fontSize: 12 }}>
            {value === 'publicacionesSector' ? 'Publicaciones (sector)' : 
             value === 'publicacionesOtros' ? 'Publicaciones (otros)' :
             'Proyectos presentados'}
          </span>
        )} />
        <Bar yAxisId="left" dataKey="publicacionesSector" fill="url(#colorSector)" stackId="a" radius={[6, 6, 0, 0]} />
        <Bar yAxisId="left" dataKey="publicacionesOtros" fill="url(#colorOtros)" stackId="a" />
        <Line yAxisId="right" type="natural" dataKey="proyectosLey" stroke="#000000" strokeWidth={3} dot={{ fill: '#000000', r: 5, stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
