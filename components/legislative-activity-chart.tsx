'use client'

import { useMemo, useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Congresista } from '@/lib/types'
import type { ChartActivityFilterState } from './chart-activity-filters'
import { ChartActivityFilters } from './chart-activity-filters'

interface LegislativeActivityChartProps {
  tweets: any[]
  congresistas: Congresista[]
}

// Mock data generator con datos realistas
function generateMockData(congresistas: Congresista[]) {
  const sectors = ['Salud', 'Educación', 'Economía', 'Infraestructura', 'Agricultura', 'Energía']
  const tweetCountMap: Record<string, number> = {}
  
  return congresistas.slice(0, 30).map(c => {
    const sector = sectors[Math.floor(Math.random() * sectors.length)]
    const tweetCount = Math.floor(Math.random() * 60) + 10
    tweetCountMap[c.id] = tweetCount
    
    return {
      id: c.id,
      nombre: c.nombre,
      sector: sector,
      partido: c.partido,
      tweets: Array.from({ length: tweetCount }, (_, i) => {
        const isRelevant = Math.random() > 0.3 // 70% de tweets relevantes al sector
        return {
          id: `tweet-${c.id}-${i}`,
          fecha: new Date(2021 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          content: isRelevant ? `Tweet sobre ${sector}` : `Tweet sobre otros temas`,
          congresista_id: c.id,
          congresistaNombre: c.nombre,
          sector: sector,
          isRelevant: isRelevant
        }
      }),
      proyectos: Array.from({ length: Math.floor(Math.random() * 12) + 2 }, (_, i) => ({
        id: `proyecto-${c.id}-${i}`,
        fechaPresentacion: new Date(2021 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        nombre: `Proyecto sobre ${sector}`,
        sector: sector
      }))
    }
  })
}

export function LegislativeActivityChart({ 
  tweets: externalTweets, 
  congresistas
}: LegislativeActivityChartProps) {
  const [filters, setFilters] = useState<ChartActivityFilterState>({
    dateFrom: undefined,
    dateTo: undefined,
    sectors: [],
    partidos: [],
    legisladores: []
  })
  
  const chartData = useMemo(() => {
    // Use mock data
    const mockCongresistas = generateMockData(congresistas)
    
    // Determine period range - use dateFrom/dateTo or full range by default
    const dateStart = filters.dateFrom || new Date(2021, 0, 1)
    const dateEnd = filters.dateTo || new Date()

    // Apply filters
    let targetCongresistas = mockCongresistas
    if (filters.legisladores.length > 0) {
      // Individual view when legislator is selected
      targetCongresistas = targetCongresistas.filter(c => filters.legisladores.includes(c.id))
    }
    if (filters.sectors.length > 0) {
      targetCongresistas = targetCongresistas.filter(c => filters.sectors.includes(c.sector))
    }
    if (filters.partidos.length > 0) {
      targetCongresistas = targetCongresistas.filter(c => filters.partidos.includes(c.partido))
    }

    // Get top 10 by tweet count (or specific legislator)
    const topLegisladores = targetCongresistas
      .map(c => ({
        ...c,
        tweetCount: c.tweets.filter(t => {
          const tDate = new Date(t.fecha)
          return tDate >= dateStart && tDate <= dateEnd
        }).length,
        proyectosCount: c.proyectos.filter(p => {
          const pDate = new Date(p.fechaPresentacion)
          return pDate >= dateStart && pDate <= dateEnd
        }).length
      }))
      .filter(c => c.tweetCount > 0 || c.proyectosCount > 0)
      .sort((a, b) => b.tweetCount - a.tweetCount)
      .slice(0, filters.legisladores.length > 0 ? undefined : 10)

    if (topLegisladores.length === 0) return null

    // Group by semester
    const tweetsBySemester = new Map<string, { sectorTweets: number; otherTweets: number; proyectos: number }>()
    
    topLegisladores.forEach(c => {
      c.tweets.filter(t => {
        const tDate = new Date(t.fecha)
        return tDate >= dateStart && tDate <= dateEnd
      }).forEach((tweet: any) => {
        const date = new Date(tweet.fecha)
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-${semester}`
        
        if (!tweetsBySemester.has(semesterKey)) {
          tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
        }
        
        // Count tweets as relevant or other based on isRelevant flag
        if (tweet.isRelevant) {
          tweetsBySemester.get(semesterKey)!.sectorTweets += 1
        } else {
          tweetsBySemester.get(semesterKey)!.otherTweets += 1
        }
      })

      c.proyectos.filter(p => {
        const pDate = new Date(p.fechaPresentacion)
        return pDate >= dateStart && pDate <= dateEnd
      }).forEach((proyecto: any) => {
        const date = new Date(proyecto.fechaPresentacion)
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-${semester}`
        
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

  if (!chartData) {
    return (
      <div className="space-y-4">
        <ChartActivityFilters
          congresistas={congresistas}
          onFiltersChange={setFilters}
        />
        <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">
          Sin datos disponibles para los filtros seleccionados
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ChartActivityFilters
        congresistas={congresistas}
        onFiltersChange={setFilters}
      />
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
    </div>
  )
}
