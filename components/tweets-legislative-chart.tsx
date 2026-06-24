'use client'

import { useMemo, useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Congresista, TweetFilters } from '@/lib/types'
import { MultiSelect } from '@/components/ui/multi-select'
import { Button } from '@/components/ui/button'

interface TweetsLegislativeChartProps {
  tweets: any[]
  congresistas: Congresista[]
  filters: TweetFilters
}

type PeriodPreset = 'year' | '2021-2025' | 'all'

export function TweetsLegislativeChart({ tweets, congresistas, filters }: TweetsLegislativeChartProps) {
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('year')
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

  // Filter function based on period preset
  const filterByPeriod = (date: Date): boolean => {
    const year = date.getFullYear()
    if (periodPreset === 'all') return true
    if (periodPreset === 'year') {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      return date >= oneYearAgo
    }
    if (periodPreset === '2021-2025') {
      return year >= 2021 && year <= 2025
    }
    return true
  }

  const chartData = useMemo(() => {
    const tweetsToUse = tweets.length === 0 ? congresistas.flatMap(c => c.tweets || []) : tweets
    
    // Apply period filter first
    const periodFilteredTweets = tweetsToUse.filter((t: any) => filterByPeriod(new Date(t.fecha)))
    
    // Determine if showing individual legislator view or Top 10
    let targetCongresistas: Congresista[] = []
    
    if (selectedLegisladores.length > 0) {
      // Individual legislator view: show that specific legislator
      targetCongresistas = congresistas.filter(c => selectedLegisladores.includes(c.id))
    } else {
      // Default: Top 10 legislators by tweet count about relevant sector
      let candidates = congresistas
      if (selectedSectores.length > 0) {
        candidates = candidates.filter(c => selectedSectores.includes(c.sector))
      }
      if (selectedPartidos.length > 0) {
        candidates = candidates.filter(c => selectedPartidos.includes(c.partido))
      }
      
      // Count tweets per legislator in the period
      const legisladorTweetCounts = candidates.map(c => {
        const cTweets = periodFilteredTweets.filter((t: any) => 
          t.congresistaNombre === c.nombre || t.congresista_id === c.id
        )
        return { congresista: c, tweetCount: cTweets.length }
      })
      
      // Get top 10
      targetCongresistas = legisladorTweetCounts
        .filter(l => l.tweetCount > 0)
        .sort((a, b) => b.tweetCount - a.tweetCount)
        .slice(0, 10)
        .map(l => l.congresista)
    }

    if (targetCongresistas.length === 0) return []

    // Group by semester for target legislators
    const tweetsBySemester = new Map<string, { sectorTweets: number; otherTweets: number; proyectos: number }>()
    
    // Count tweets
    periodFilteredTweets.forEach((tweet: any) => {
      const isSectorTweet = targetCongresistas.some(c => 
        tweet.congresistaNombre === c.nombre || tweet.congresista_id === c.id
      )
      
      if (isSectorTweet) {
        const date = new Date(tweet.fecha)
        const year = date.getFullYear()
        const semester = date.getMonth() < 6 ? 1 : 2
        const semesterKey = `${year}-S${semester}`
        
        if (!tweetsBySemester.has(semesterKey)) {
          tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
        }
        tweetsBySemester.get(semesterKey)!.sectorTweets += 1
      }
    })

    // Count projects
    targetCongresistas.forEach(c => {
      const cProyectos = c.proyectos || []
      cProyectos.forEach((p: any) => {
        const pDate = new Date(p.fechaPresentacion || Date.now())
        if (filterByPeriod(pDate)) {
          const year = pDate.getFullYear()
          const semester = pDate.getMonth() < 6 ? 1 : 2
          const semesterKey = `${year}-S${semester}`
          
          if (!tweetsBySemester.has(semesterKey)) {
            tweetsBySemester.set(semesterKey, { sectorTweets: 0, otherTweets: 0, proyectos: 0 })
          }
          tweetsBySemester.get(semesterKey)!.proyectos += 1
        }
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

    return data
  }, [tweets, congresistas, periodPreset, selectedSectores, selectedPartidos, selectedLegisladores])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-3 shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{payload[0]?.payload?.periodo}</p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Publicaciones (sector): <span className="font-semibold text-foreground">{payload[0]?.payload?.publicacionesSector}</span></p>
            <p className="text-xs text-muted-foreground">Publicaciones (otros): <span className="font-semibold text-foreground">{payload[0]?.payload?.publicacionesOtros}</span></p>
            <p className="text-xs text-muted-foreground">Proyectos de ley: <span className="font-semibold text-foreground">{payload[0]?.payload?.proyectosLey}</span></p>
          </div>
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        {/* Period Filter */}
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium text-foreground">Período:</span>
          <Button 
            variant={periodPreset === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodPreset('year')}
          >
            Último año
          </Button>
          <Button 
            variant={periodPreset === '2021-2025' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodPreset('2021-2025')}
          >
            2021-2025
          </Button>
          <Button 
            variant={periodPreset === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodPreset('all')}
          >
            Todo
          </Button>
        </div>

        {/* Filters */}
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

  const isSinglePeriod = chartData.length === 1

  return (
    <div className="space-y-4">
      {/* Period Filter */}
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-sm font-medium text-foreground">Período:</span>
        <Button 
          variant={periodPreset === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodPreset('year')}
        >
          Último año
        </Button>
        <Button 
          variant={periodPreset === '2021-2025' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodPreset('2021-2025')}
        >
          2021-2025
        </Button>
        <Button 
          variant={periodPreset === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriodPreset('all')}
        >
          Todo
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg border border-border">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">Sector</label>
          <MultiSelect
            options={sectores.map(s => ({ value: s, label: s }))}
            selected={selectedSectores}
            onChange={setSelectedSectores}
            placeholder="Filtrar por sector..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">Partido</label>
          <MultiSelect
            options={partidos.map(p => ({ value: p, label: p }))}
            selected={selectedPartidos}
            onChange={setSelectedPartidos}
            placeholder="Filtrar por partido..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">Legislador</label>
          <MultiSelect
            options={congresistas.map(c => ({ value: c.id, label: c.nombre }))}
            selected={selectedLegisladores}
            onChange={setSelectedLegisladores}
            placeholder="Filtrar por legislador..."
          />
        </div>
      </div>

      {/* Chart */}
      <div className={isSinglePeriod ? "flex justify-center" : ""}>
        <ResponsiveContainer 
          width={isSinglePeriod ? 600 : "100%"} 
          height={420}
        >
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
    </div>
  )
}
