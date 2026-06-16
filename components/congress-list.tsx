'use client'

import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Search, X, Star, Users, Building2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { congresistas, sectores } from '@/lib/data'
import { CongresistDetail } from './congresista-detail'
import { TweetAnalysis } from './tweet-analysis'
import { MultiSelect } from '@/components/ui/multi-select'
import { SortableHead } from '@/components/ui/sortable-head'
import { useSortableTable } from '@/hooks/use-sortable-table'
import type { Congresista, TipoLegislador } from '@/lib/types'

interface CongressListProps {
  onBack: () => void
  favoriteCongresistas?: string[]
  onToggleFavoriteCongresista?: (id: string) => void
}

// Colores por partido
const PARTY_COLORS: Record<string, string> = {
  'Fuerza Nacional': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  'Accion Popular': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Peru Libre': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  'Alianza para el Progreso': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Movimiento Regional': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  'Renovacion Popular': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'default': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
}

const getPartyColor = (partido: string): string => PARTY_COLORS[partido] || PARTY_COLORS.default

export function CongressList({ onBack, favoriteCongresistas = [], onToggleFavoriteCongresista }: CongressListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [selectedRegiones, setSelectedRegiones] = useState<string[]>([])
  const [selectedComisiones, setSelectedComisiones] = useState<string[]>([])
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const [selectedCongresista, setSelectedCongresista] = useState<Congresista | null>(null)
  const [activeTab, setActiveTab] = useState<TipoLegislador | 'analisis'>('diputado')

  // Limpiar filtros de comisiones y sectores al cambiar de pestaña
  useEffect(() => {
    setSelectedComisiones([])
    setSelectedSectores([])
  }, [activeTab])

  const partidos = useMemo(() => 
    Array.from(new Set(congresistas.map(c => c.partido))).sort(),
    []
  )

  const regions = useMemo(() =>
    Array.from(new Set(congresistas.map(c => c.region))).sort(),
    []
  )

  const comisiones = useMemo(() =>
    Array.from(new Set(congresistas.flatMap(c => c.topComisiones?.flatMap(com => com.comisiones) || []))).sort(),
    []
  )

  const sectoresUnicos = useMemo(() =>
    Array.from(new Set(congresistas.flatMap(c => c.topComisiones?.map(com => com.sectorId) || []))).sort(),
    []
  )

  const filteredCongresistas = useMemo<Congresista[]>(() => {
    // Solo filtrar por tipo si activeTab es 'diputado' o 'senador'
    const matchesTipo = activeTab === 'analisis' || congresistas.filter(c => c.tipo === activeTab)
    
    return congresistas.filter(c => {
      const isTipoCorrect = activeTab === 'analisis' || c.tipo === activeTab
      const matchesSearch = c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPartido = selectedPartidos.length === 0 || selectedPartidos.includes(c.partido)
      const matchesRegion = selectedRegiones.length === 0 || selectedRegiones.includes(c.region)
      const matchesComisión = selectedComisiones.length === 0 ||
        c.topComisiones?.some(com => com.comisiones.some(co => selectedComisiones.includes(co)))
      const matchesSector = selectedSectores.length === 0 ||
        c.topComisiones?.some(com => selectedSectores.includes(com.sectorId))
      return isTipoCorrect && matchesSearch && matchesPartido && matchesRegion && matchesComisión && matchesSector
    })
  }, [searchQuery, selectedPartidos, selectedRegiones, selectedComisiones, selectedSectores, activeTab])

  const { sort, toggleSort, sortedData: sortedCongresistas } = useSortableTable(filteredCongresistas)

  const hasActiveFilters = searchQuery !== '' || selectedPartidos.length > 0 || selectedRegiones.length > 0 || selectedComisiones.length > 0 || selectedSectores.length > 0

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedPartidos([])
    setSelectedRegiones([])
    setSelectedComisiones([])
    setSelectedSectores([])
  }

  if (selectedCongresista) {
    return (
      <CongresistDetail
        congresista={selectedCongresista}
        onBack={() => setSelectedCongresista(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Legisladores</h1>
      </div>

      {/* Tabs principales: Diputados, Senadores, Análisis de Tuits */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TipoLegislador | 'analisis')} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="diputado" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Diputados
          </TabsTrigger>
          <TabsTrigger value="senador" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Senadores
          </TabsTrigger>
          <TabsTrigger value="analisis" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Análisis de Tuits
          </TabsTrigger>
        </TabsList>

        {/* Contenido de Diputados y Senadores */}
        <TabsContent value="diputado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Búsqueda y filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm bg-background">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className={`grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Bancada</label>
                  <MultiSelect
                    options={partidos.map(p => ({ value: p, label: p }))}
                    selected={selectedPartidos}
                    onChange={setSelectedPartidos}
                    placeholder="Todas las bancadas"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Región</label>
                  <MultiSelect
                    options={regions.map(r => ({ value: r, label: r }))}
                    selected={selectedRegiones}
                    onChange={setSelectedRegiones}
                    placeholder="Todas las regiones"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Comisión</label>
                  <MultiSelect
                    options={comisiones.map(c => ({ value: c, label: c }))}
                    selected={selectedComisiones}
                    onChange={setSelectedComisiones}
                    placeholder="Todas las comisiones"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Sector</label>
                  <MultiSelect
                    options={sectoresUnicos.map(id => ({ value: id, label: sectores.find(s => s.id === id)?.name ?? id }))}
                    selected={selectedSectores}
                    onChange={setSelectedSectores}
                    placeholder="Todos los sectores"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-3 w-3 mr-1" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Diputados ({filteredCongresistas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[36px]" />
                      <TableHead className="w-[50px]" />
                      <SortableHead column="nombre" sort={sort} onSort={toggleSort} className="w-[200px]">Nombre</SortableHead>
                      <SortableHead column="partido" sort={sort} onSort={toggleSort} className="w-[150px]">Bancada</SortableHead>
                      <SortableHead column="region" sort={sort} onSort={toggleSort} className="w-[120px]">Región</SortableHead>
                      <TableHead className="w-[200px]">Comisiones actuales</TableHead>
                      <SortableHead column="proyectosCount" sort={sort} onSort={toggleSort} className="w-[100px] text-center">PL presentados</SortableHead>
                      <SortableHead column="leyesAprobadas" sort={sort} onSort={toggleSort} className="w-[100px] text-center">N° leyes aprobadas</SortableHead>
                      <TableHead className="w-[200px]">Top 3 sectores</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCongresistas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                          No se encontraron diputados
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedCongresistas.map((congresista) => (
                        <TableRow key={congresista.id} className="hover:bg-muted/50">
                          <TableCell className="pr-0">
                            <button
                              onClick={() => onToggleFavoriteCongresista?.(congresista.id)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title={favoriteCongresistas.includes(congresista.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                              <Star className={`h-3.5 w-3.5 ${favoriteCongresistas.includes(congresista.id) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                            </button>
                          </TableCell>
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-xs">
                                {congresista.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => setSelectedCongresista(congresista)}
                              className="font-medium text-primary hover:underline cursor-pointer"
                            >
                              {congresista.nombre}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${getPartyColor(congresista.partido)}`}>
                              {congresista.partido}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {congresista.region}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {congresista.topComisiones?.flatMap(c => c.comisiones).slice(0, 3).map((comision, idx) => (
                                <Badge key={idx} variant="outline" className="text-[9px]">
                                  {comision.replace('Comisión de ', '').replace('Comisión ', '')}
                                </Badge>
                              )) || <span className="text-xs text-muted-foreground">-</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            <button
                              onClick={() => setSelectedCongresista(congresista)}
                              className="text-primary hover:underline cursor-pointer"
                            >
                              {congresista.proyectosCount || 0}
                            </button>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            <button
                              onClick={() => setSelectedCongresista(congresista)}
                              className="text-primary hover:underline cursor-pointer"
                            >
                              {congresista.leyesAprobadas ?? 0}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {congresista.topComisiones?.slice(0, 3).map((comision) => {
                                const sectorName = sectores.find(s => s.id === comision.sectorId)?.name
                                return (
                                  <Badge key={comision.sectorId} variant="secondary" className="text-[9px]">
                                    {sectorName}
                                  </Badge>
                                )
                              }) || <span className="text-xs text-muted-foreground">—</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenido de Senadores */}
        <TabsContent value="senador" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Búsqueda y filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm bg-background">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className={`grid gap-3 grid-cols-1 sm:grid-cols-2`}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Bancada</label>
                  <MultiSelect
                    options={partidos.map(p => ({ value: p, label: p }))}
                    selected={selectedPartidos}
                    onChange={setSelectedPartidos}
                    placeholder="Todas las bancadas"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Región</label>
                  <MultiSelect
                    options={regions.map(r => ({ value: r, label: r }))}
                    selected={selectedRegiones}
                    onChange={setSelectedRegiones}
                    placeholder="Todas las regiones"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-3 w-3 mr-1" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Senadores ({filteredCongresistas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[36px]" />
                      <TableHead className="w-[50px]" />
                      <SortableHead column="nombre" sort={sort} onSort={toggleSort} className="w-[200px]">Nombre</SortableHead>
                      <SortableHead column="partido" sort={sort} onSort={toggleSort} className="w-[150px]">Bancada</SortableHead>
                      <SortableHead column="region" sort={sort} onSort={toggleSort} className="w-[120px]">Región</SortableHead>
                      <TableHead className="w-[200px]">Top 3 sectores</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCongresistas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No se encontraron senadores
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedCongresistas.map((congresista) => (
                        <TableRow key={congresista.id} className="hover:bg-muted/50">
                          <TableCell className="pr-0">
                            <button
                              onClick={() => onToggleFavoriteCongresista?.(congresista.id)}
                              className="p-1 rounded hover:bg-muted transition-colors"
                              title={favoriteCongresistas.includes(congresista.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                            >
                              <Star className={`h-3.5 w-3.5 ${favoriteCongresistas.includes(congresista.id) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                            </button>
                          </TableCell>
                          <TableCell>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-xs">
                                {congresista.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-between gap-3">
                              <button
                                onClick={() => setSelectedCongresista(congresista)}
                                className="font-medium text-primary hover:underline cursor-pointer"
                              >
                                {congresista.nombre}
                              </button>
                              {congresista.interesesPrincipales && congresista.interesesPrincipales.length > 0 && (
                                <div className="flex gap-1 flex-shrink-0">
                                  {congresista.interesesPrincipales.map((interes, idx) => (
                                    <Badge key={idx} variant="outline" className="text-[9px] whitespace-nowrap">
                                      {interes}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] ${getPartyColor(congresista.partido)}`}>
                              {congresista.partido}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {congresista.region}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {congresista.topComisiones?.slice(0, 3).map((comision) => {
                                const sectorName = sectores.find(s => s.id === comision.sectorId)?.name
                                return (
                                  <Badge key={comision.sectorId} variant="secondary" className="text-[9px]">
                                    {sectorName}
                                  </Badge>
                                )
                              }) || <span className="text-xs text-muted-foreground">—</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contenido de Análisis de Tuits */}
        <TabsContent value="analisis">
          <TweetAnalysis congresistas={congresistas} sectores={sectores} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
