'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Star, Filter, X, ChevronDown, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SortableHead } from '@/components/ui/sortable-head'
import { useSortableTable } from '@/hooks/use-sortable-table'
import { NetworkGraph } from '@/components/network-graph'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  proyectos, 
  congresistas, 
  comisiones, 
  partidos,
  sectores,
  availableMonths, 
  getMonthLabel,
  getTipoMedidaLabel,
} from '@/lib/data'
import { getSectorCongresistas } from '@/lib/congresistas-utils'
import { CongresistDetail } from './congresista-detail'
import { MultiSelect } from '@/components/ui/multi-select'
import type { Sector, ProyectoLey, Congresista, SectorCongresista } from '@/lib/types'

interface SectorDetailViewProps {
  sector: Sector
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onBack: () => void
  onViewProject: (proyecto: ProyectoLey) => void
}

type ProjectTab = 'todos' | 'proyectos' | 'dictamenes' | 'agenda' | 'leyes'

export function SectorDetailView({ 
  sector, 
  favorites, 
  onToggleFavorite, 
  onBack,
  onViewProject 
}: SectorDetailViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'produccion' | 'congresistas' | 'redes'>('produccion')
  const [selectedCongresista, setSelectedCongresista] = useState<Congresista | null>(null)
  const [projectTab, setProjectTab] = useState<ProjectTab>('todos')
  
  // Filters
  const [autorFilter, setAutorFilter] = useState<string[]>([])
  const [comisionFilter, setComisionFilter] = useState<string[]>([])
  const [estadoFilter, setEstadoFilter] = useState<string[]>([])
  const [tipoProyectoFilter, setTipoProyectoFilter] = useState<string[]>([])
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')

  // Get sector projects and congresspeople
  const sectorProjects = useMemo(() => {
    return proyectos.filter(p => p.sectorId === sector.id)
  }, [sector.id])

  const sectorCongresistas = useMemo(() => {
    const result = getSectorCongresistas(sector.id)
    return result
  }, [sector.id])

  // Chart data - reverse to show oldest first
  const chartData = useMemo(() => {
    return [...sector.monthlyData].reverse().map(data => {
      const [year, month] = data.month.split('-')
      const agendaCount = sectorProjects.filter(p =>
        p.enAgenda && p.ultimaActualizacion.startsWith(`${year}-${month}`)
      ).length
      return {
        month: getMonthLabel(data.month).split(' ')[0],
        proyectos: data.projectCount,
        dictamenes: data.dictamenCount,
        leyes: data.leyCount,
        agenda: agendaCount,
      }
    })
  }, [sector.monthlyData, sectorProjects])

  // Filtered projects based on tab and filters
  const filteredProjects = useMemo(() => {
    let filtered = [...sectorProjects]

    // Tab filter
    switch (projectTab) {
      case 'proyectos':
        filtered = filtered.filter(p => p.tipoMedida === 'proyecto_ley')
        break
      case 'dictamenes':
        filtered = filtered.filter(p => p.tipoMedida === 'dictamen')
        break
      case 'agenda':
        filtered = filtered.filter(p => p.enAgenda)
        break
      case 'leyes':
        filtered = filtered.filter(p => p.tipoMedida === 'ley_aprobada')
        break
    }

    // Additional filters
    if (autorFilter.length > 0) {
      filtered = filtered.filter(p =>
        p.autores.some(a => autorFilter.includes(a.id))
      )
    }

    if (comisionFilter.length > 0) {
      filtered = filtered.filter(p => comisionFilter.includes(p.comision))
    }

    if (estadoFilter.length > 0) {
      filtered = filtered.filter(p => estadoFilter.includes(p.estado))
    }

    if (tipoProyectoFilter.length > 0) {
      filtered = filtered.filter(p => tipoProyectoFilter.includes(p.tipoProyecto))
    }

    if (fechaDesde) {
      filtered = filtered.filter(p => p.fechaPresentacion >= fechaDesde)
    }

    if (fechaHasta) {
      filtered = filtered.filter(p => p.fechaPresentacion <= fechaHasta)
    }

    return filtered
  }, [sectorProjects, projectTab, autorFilter, comisionFilter, estadoFilter, tipoProyectoFilter, fechaDesde, fechaHasta])

  const { sort: sortProyectos, toggleSort: toggleSortProyectos, sortedData: sortedProyectos } = useSortableTable(filteredProjects)
  const { sort: sortCongresistas, toggleSort: toggleSortCongresistas, sortedData: sortedCongresistas } = useSortableTable(sectorCongresistas)

  const hasActiveFilters = useMemo(() => {
    return (
      autorFilter.length > 0 ||
      comisionFilter.length > 0 ||
      estadoFilter.length > 0 ||
      tipoProyectoFilter.length > 0 ||
      fechaDesde !== '' ||
      fechaHasta !== ''
    )
  }, [autorFilter, comisionFilter, estadoFilter, tipoProyectoFilter, fechaDesde, fechaHasta])

  const clearFilters = () => {
    setAutorFilter([])
    setComisionFilter([])
    setEstadoFilter([])
    setTipoProyectoFilter([])
    setFechaDesde('')
    setFechaHasta('')
  }

  const handleFilterByCongresista = (congresistId: string) => {
    setActiveSubTab('produccion')
    setAutorFilter([congresistId])
  }

  const getProbabilidad = (prob: number, estado?: string): { label: string; className: string } => {
    if (estado === 'Aprobado' || estado === 'Archivado') {
      return { label: '', className: '' }
    }
    if (prob >= 67) return { label: 'Alta', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' }
    if (prob >= 34) return { label: 'Media', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' }
    return { label: 'Baja', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' }
  }

  const getEstadoColor = (estado: string): string => {
    const colors: Record<string, string> = {
      'En Comisión': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'En Pleno': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'Aprobado': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      'Publicado': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      'Archivado': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
      'Observado': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    }
    return colors[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }

  // Early return for congressperson detail view
  if (selectedCongresista) {
    return (
      <CongresistDetail 
        congresista={selectedCongresista}
        onBack={() => setSelectedCongresista(null)}
        onViewProject={onViewProject}
      />
    )
  }

  // Main sector detail view
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl font-bold text-foreground">{sector.name}</h1>
      </div>

      {/* Sub-tabs */}
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as typeof activeSubTab)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="produccion">Producción</TabsTrigger>
          <TabsTrigger value="congresistas">Congresistas</TabsTrigger>
          <TabsTrigger value="redes">Análisis de Redes</TabsTrigger>
        </TabsList>

        {/* Producción Tab */}
        <TabsContent value="produccion" className="space-y-6 mt-6">
          {/* Top Row: Chart + Trends */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Line Chart - Takes more space */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Evolución Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="proyectos"
                        name="Proyectos de Ley"
                        stroke="#3b5bdb"
                        strokeWidth={2.5}
                        dot={{ fill: '#3b5bdb', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="dictamenes"
                        name="Dictámenes"
                        stroke="#0ca678"
                        strokeWidth={2.5}
                        dot={{ fill: '#0ca678', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="leyes"
                        name="Leyes Aprobadas"
                        stroke="#e8590c"
                        strokeWidth={2.5}
                        dot={{ fill: '#e8590c', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="agenda"
                        name="En Agenda"
                        stroke="#9c36b5"
                        strokeWidth={2.5}
                        strokeDasharray="5 3"
                        dot={{ fill: '#9c36b5', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Trends Panel */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Temas Predominantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sector.trends.map((trend, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {trend.tema}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trend.frecuencia} proyectos
                        </p>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        trend.tendencia === 'subiendo' ? "text-emerald-600 dark:text-emerald-400" :
                        trend.tendencia === 'bajando' ? "text-red-600 dark:text-red-400" :
                        "text-muted-foreground"
                      )}>
                        {trend.tendencia === 'subiendo' ? (
                          <><TrendingUp className="h-3.5 w-3.5" /><span>Subiendo</span></>
                        ) : trend.tendencia === 'bajando' ? (
                          <><TrendingDown className="h-3.5 w-3.5" /><span>Bajando</span></>
                        ) : (
                          <><Minus className="h-3.5 w-3.5" /><span>Estable</span></>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Table Section */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base font-semibold">Detalle de Proyectos</CardTitle>
                
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                        {hasActiveFilters && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                            !
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filtros</h4>
                          {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                              <X className="h-4 w-4 mr-1" />
                              Limpiar
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Autor</Label>
                            <MultiSelect
                              options={congresistas.map(c => ({ value: c.id, label: c.nombre }))}
                              selected={autorFilter}
                              onChange={setAutorFilter}
                              placeholder="Todos los autores"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">Comisión</Label>
                            <MultiSelect
                              options={comisiones.map(c => ({ value: c, label: c }))}
                              selected={comisionFilter}
                              onChange={setComisionFilter}
                              placeholder="Todas"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">Estado</Label>
                            <MultiSelect
                              options={[
                                { value: 'En Comisión', label: 'En Comisión' },
                                { value: 'En Pleno', label: 'En Pleno' },
                                { value: 'Aprobado', label: 'Aprobado' },
                                { value: 'Publicado', label: 'Publicado' },
                                { value: 'Observado', label: 'Observado' },
                                { value: 'Archivado', label: 'Archivado' },
                              ]}
                              selected={estadoFilter}
                              onChange={setEstadoFilter}
                              placeholder="Todos"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs">Tipo de Proyecto</Label>
                            <MultiSelect
                              options={[
                                { value: 'regulatorio', label: 'Regulatorio' },
                                { value: 'no_regulatorio', label: 'No Regulatorio' },
                              ]}
                              selected={tipoProyectoFilter}
                              onChange={setTipoProyectoFilter}
                              placeholder="Todos"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Fecha desde</Label>
                              <Input 
                                type="date" 
                                className="h-8 text-xs"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Fecha hasta</Label>
                              <Input 
                                type="date" 
                                className="h-8 text-xs"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Project Type Tabs */}
              <Tabs value={projectTab} onValueChange={(v) => setProjectTab(v as ProjectTab)} className="mt-4">
                <TabsList className="h-9">
                  <TabsTrigger value="todos" className="text-xs px-3">
                    Todos ({sectorProjects.length})
                  </TabsTrigger>
                  <TabsTrigger value="proyectos" className="text-xs px-3">
                    Proyectos de Ley ({sectorProjects.filter(p => p.tipoMedida === 'proyecto_ley').length})
                  </TabsTrigger>
                  <TabsTrigger value="dictamenes" className="text-xs px-3">
                    Dictámenes ({sectorProjects.filter(p => p.tipoMedida === 'dictamen').length})
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="text-xs px-3">
                    En Agenda ({sectorProjects.filter(p => p.enAgenda).length})
                  </TabsTrigger>
                  <TabsTrigger value="leyes" className="text-xs px-3">
                    Leyes Aprobadas ({sectorProjects.filter(p => p.tipoMedida === 'ley_aprobada').length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[36px]" />
                      <SortableHead column="numero" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[110px]">ID</SortableHead>
                      <SortableHead column="titulo" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[220px]">Medida</SortableHead>
                      <SortableHead column="probabilidadAprobacion" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[72px] text-center">Prob.</SortableHead>
                      <SortableHead column="comision" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[150px]">Comisión</SortableHead>
                      <SortableHead column="autores[0].nombre" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[160px]">Proponente</SortableHead>
                      <SortableHead column="autores[0].partido" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[130px]">Bancada</SortableHead>
                      {projectTab === 'todos' && (
                        <SortableHead column="estado" sort={sortProyectos} onSort={toggleSortProyectos} className="w-[110px]">Estado</SortableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={projectTab === 'todos' ? 8 : 7} className="h-24 text-center text-muted-foreground">
                          No se encontraron proyectos con los filtros seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedProyectos
                        .filter((proyecto): proyecto is ProyectoLey => proyecto != null && proyecto.numero != null)
                        .map((proyecto) => (
                        <TableRow 
                          key={proyecto.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => onViewProject(proyecto)}
                        >
                          {/* Favorito */}
                          <TableCell className="p-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation()
                                onToggleFavorite(proyecto.id)
                              }}
                            >
                              <Star
                                className={cn(
                                  "h-3.5 w-3.5",
                                  favorites.includes(proyecto.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                )}
                              />
                            </Button>
                          </TableCell>
                          {/* ID */}
                          <TableCell className="font-mono text-xs">
                            <Button
                              variant="link"
                              className="h-auto p-0 text-primary hover:underline text-xs"
                              onClick={() => onViewProject(proyecto)}
                            >
                              {proyecto.numero}
                            </Button>
                          </TableCell>
                          {/* Medida */}
                          <TableCell className="max-w-[220px]">
                            <p className="text-xs font-medium line-clamp-2 leading-snug">
                              {proyecto.titulo}
                            </p>
                          </TableCell>
                          {/* Probabilidad */}
                          <TableCell className="text-center">
                            {(() => {
                              const p = getProbabilidad(proyecto.probabilidadAprobacion, proyecto.estado)
                              return (
                                <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full", p.className)}>
                                  {p.label}
                                </span>
                              )
                            })()}
                          </TableCell>
                          {/* Comisión */}
                          <TableCell className="text-xs text-muted-foreground max-w-[150px]">
                            <span className="line-clamp-1">{proyecto.comision}</span>
                          </TableCell>
                          {/* Proponente */}
                          <TableCell className="text-xs max-w-[160px]">
                            <span className="line-clamp-1">{proyecto.autores[0]?.nombre}</span>
                            {proyecto.autores.length > 1 && (
                              <span className="text-muted-foreground"> +{proyecto.autores.length - 1}</span>
                            )}
                          </TableCell>
                          {/* Partido */}
                          <TableCell className="text-xs max-w-[130px]">
                            <span className="line-clamp-1">{proyecto.autores[0]?.partido}</span>
                          </TableCell>
                          {/* Estado - solo en tab Todos */}
                          {projectTab === 'todos' && (
                            <TableCell>
                              <Badge className={cn("text-[10px] whitespace-nowrap", getEstadoColor(proyecto.estado))}>
                                {proyecto.estado}
                              </Badge>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Congresistas Tab */}
        <TabsContent value="congresistas" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <SortableHead column="congresista.nombre" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[200px]">Nombre</SortableHead>
                      <SortableHead column="congresista.partido" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[130px]">Bancada</SortableHead>
                      <SortableHead column="congresista.region" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[120px]">Región</SortableHead>
                      <SortableHead column="proyectosCount" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[100px] text-center">Proy. de Ley</SortableHead>
                      <SortableHead column="porcentajeAprobacion" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[100px] text-center">% Aprobación</SortableHead>
                      <SortableHead column="congresista.cargo" sort={sortCongresistas} onSort={toggleSortCongresistas} className="w-[150px]">Cargo</SortableHead>
                      <TableHead className="w-[200px]">Top Comisiones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectorCongresistas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No hay congresistas en este sector
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedCongresistas.map((item) => (
                        <TableRow key={item.congresista.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Button
                              variant="link"
                              className="h-auto p-0 justify-start text-primary hover:underline"
                              onClick={() => setSelectedCongresista(item.congresista)}
                            >
                              {item.congresista.nombre}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-[10px]">{item.congresista.partido}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.congresista.region}
                          </TableCell>
                          <TableCell className="text-center font-semibold text-primary">
                            {item.proyectosCount}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm font-medium">{item.porcentajeAprobacion}%</span>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.congresista.cargo || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.congresista.topComisiónes?.slice(0, 2).map((comision) => {
                                const sectorName = sectores.find(s => s.id === comision.sectorId)?.name || 'Sector'
                                return (
                                  <Badge
                                    key={comision.sectorId}
                                    className="text-[10px] bg-primary/20 text-primary"
                                  >
                                    {sectorName.split(' ')[0]}
                                  </Badge>
                                )
                              })}
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

        {/* Redes Tab */}
        <TabsContent value="redes" className="mt-6">
          <NetworkGraph sectorId={sector.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
