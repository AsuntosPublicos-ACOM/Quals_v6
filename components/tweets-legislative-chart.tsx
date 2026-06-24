'use client'

import { useMemo, useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import type { Congresista, TweetFilters } from '@/lib/types'
import { MultiSelect } from '@/components/ui/multi-select'

interface TweetsLegislativeChartProps {
  tweets: any[]
  congresistas: Congresista[]
  filters: TweetFilters
}

export function TweetsLegislativeChart({ tweets, congresistas, filters }: TweetsLegislativeChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [selectedLegisladores, setSelectedLegisladores] = useState<string[]>([])

  // Get unique sectors, partidos
  const sectores = useMemo(() => 
    [...new Set(congresistas.map(c => c.sector).filter(Boolean))] as string[]
  , [congresistas])

  const partidos = useMemo(() => 
    [...new Set(congresistas.map(c => c.partido).filter(Boolean))] as string[]
  , [congresistas])

  const chartData = useMemo(() => {
    // If no tweets filtered, use all tweets
    const tweetsToUse = tweets.length === 0 ? congresistas.flatMap(c => c.tweets || []) : tweets
    
    // Filter congresistas by selected filters
    let filteredCongresistas = congresistas
    if (selectedSectores.length > 0) {
      filteredCongresistas = filteredCongresistas.filter(c => selectedSectores.includes(c.sector))
    }
    if (selectedPartidos.length > 0) {
      filteredCongresistas = filteredCongresistas.filter(c => selectedPartidos.includes(c.partido))
    }
    if (selectedLegisladores.length > 0) {
      filteredCongresistas = filteredCongresistas.filter(c => selectedLegisladores.includes(c.id))
    }

    // Get top 10 by tweets volume by sector (default view)
    const legisladoresBySector = new Map<string, { name: string; sector: string; tweetCount: number; proyectosCount: number }>()
    
    filteredCongresistas.forEach(c => {
      const cTweets = tweetsToUse.filter((t: any) => t.congresistaNombre === c.nombre || t.congresista_id === c.id)
      const cProyectos = c.proyectos || []
      const sector = c.sector || 'Sin sector'
      
      if (!legisladoresBySector.has(c.id)) {
        legisladoresBySector.set(c.id, {
          name: c.nombre,
          sector,
          tweetCount: cTweets.length,
          proyectosCount: cProyectos.length
        })
      }
    })

    // Group tweets by semester
    const tweetsBySemester = new Map<string, { sectorTweets: number; otherTweets: number; proyectos: number }>()
    
    tweetsToUse.forEach((tweet: any) => {
      const date = new Date(tweet.fecha)
      const year = date.getFullYear()
      const semester = date.getMonth() < 6 ? 1 : 2
      const semesterKey = `${year}-S${semester}`
      
      if (!tweetsBySemester.has(semesterKey)) {
        tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
      }
      
      const isSectorTweet = filteredCongresistas.some(c => 
        tweet.congresistaNombre === c.nombre || tweet.congresista_id === c.id
      )
      const data = tweetsBySemester.get(semesterKey)!
      if (isSectorTweet) {
        data.sectorTweets += 1
      } else {
        data.otherTweets += 1
      }
    })

    // Add legislative projects by semester
    filteredCongresistas.forEach(c => {
      const cProyectos = c.proyectos || []
      cProyectos.forEach((p: any) => {
        const date = new Date(p.fechaPresentacion || Date.now())
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-S${semester}`
        
        if (!tweetsBySemester.has(semesterKey)) {
          tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
        }
        tweetsBySemester.get(semesterKey)!.proyectos += 1
      })
    })

    // Convert to array and sort
    const data = Array.from(tweetsBySemester.entries())
      .map(([periodo, counts]) => ({
        periodo,
        publicacionesSector: counts.sectorTweets,
        publicacionesOtros: counts.otherTweets,
        proyectosLey: counts.proyectos
      }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo))

    return data.length > 0 ? data : []
  }, [tweets, congresistas, selectedSectores, selectedPartidos, selectedLegisladores])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{payload[0]?.payload?.periodo}</p>
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
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelect
            options={sectores.map(s => ({ value: s, label: s }))}
            selected={selectedSectores}
            onChange={setSelectedSectores}
            placeholder="Filtrar por sector..."
          />
          <MultiSelect
            options={partidos.map(p => ({ value: p, label: p }))}
            selected={selectedPartidos}
            onChange={setSelectedPartidos}
            placeholder="Filtrar por partido..."
          />
          <MultiSelect
            options={congresistas.map(c => ({ value: c.id, label: c.nombre }))}
            selected={selectedLegisladores}
            onChange={setSelectedLegisladores}
            placeholder="Filtrar por legislador..."
          />
        </div>
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          Sin datos disponibles para los filtros seleccionados
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg border border-border">
        <MultiSelect
          options={sectores.map(s => ({ value: s, label: s }))}
          selected={selectedSectores}
          onChange={setSelectedSectores}
          placeholder="Filtrar por sector..."
        />
        <MultiSelect
          options={partidos.map(p => ({ value: p, label: p }))}
          selected={selectedPartidos}
          onChange={setSelectedPartidos}
          placeholder="Filtrar por partido..."
        />
        <MultiSelect
          options={congresistas.map(c => ({ value: c.id, label: c.nombre }))}
          selected={selectedLegisladores}
          onChange={setSelectedLegisladores}
          placeholder="Filtrar por legislador..."
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={420}>
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
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
            opacity={0.5}
          />
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
            label={{ value: 'Publicaciones en redes', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11, fill: 'hsl(var(--foreground))' } }}
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
                {value === 'publicacionesSector' ? 'Publicaciones (sector)' : 
                 value === 'publicacionesOtros' ? 'Publicaciones (otros)' :
                 'Proyectos presentados'}
              </span>
            )}
          />
          <Bar
            yAxisId="left"
            dataKey="publicacionesSector"
            fill="url(#colorSector)"
            name="publicacionesSector"
            stackId="a"
            radius={[6, 6, 0, 0]}
            opacity={0.9}
          />
          <Bar
            yAxisId="left"
            dataKey="publicacionesOtros"
            fill="url(#colorOtros)"
            name="publicacionesOtros"
            stackId="a"
            opacity={0.6}
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="proyectosLey"
            stroke="#000000"
            name="proyectosLey"
            strokeWidth={3}
            dot={{ fill: '#000000', r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
