'use client'

import { useState } from 'react'
import { Star, Search, ArrowLeft, X, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectDetail } from './project-detail'
import { proyectos, sectores, congresistas } from '@/lib/data'
import { MultiSelect } from '@/components/ui/multi-select'
import { SortableHead } from '@/components/ui/sortable-head'
import { useSortableTable } from '@/hooks/use-sortable-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import type { ProyectoLey } from '@/lib/types'

interface FavoritesViewProps {
  favorites: string[]
  onToggleFavorite: (id: string) => void
  favoriteCongresistas?: string[]
  onToggleFavoriteCongresista?: (id: string) => void
  onBack: () => void
}

const estadoStyles: Record<string, string> = {
  'En Comision': 'bg-info/10 text-info border-info/20',
  'En Pleno': 'bg-warning/10 text-warning-foreground border-warning/20',
  'Aprobado': 'bg-success/10 text-success border-success/20',
  'Archivado': 'bg-muted text-muted-foreground border-muted',
  'Observado': 'bg-destructive/10 text-destructive border-destructive/20',
  'Publicado': 'bg-accent/10 text-accent border-accent/20',
}

const getProbabilidad = (prob: number, estado: string) => {
  if (estado === 'Aprobado' || estado === 'Archivado') return null
  if (prob >= 67) return { label: 'Alta', className: 'text-emerald-600 dark:text-emerald-400' }
  if (prob >= 34) return { label: 'Media', className: 'text-yellow-600 dark:text-yellow-400' }
  return { label: 'Baja', className: 'text-red-600 dark:text-red-400' }
}

export function FavoritesView({
  favorites,
  onToggleFavorite,
  favoriteCongresistas = [],
  onToggleFavoriteCongresista,
  onBack,
}: FavoritesViewProps) {
  const [selectedProject, setSelectedProject] = useState<ProyectoLey | null>(null)

  // PL filters
  const [plSearch, setPlSearch] = useState('')
  const [selectedEstados, setSelectedEstados] = useState<string[]>([])
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const [selectedTipoMedida, setSelectedTipoMedida] = useState<string[]>([])
  const [selectedRelevancia, setSelectedRelevancia] = useState<string[]>([])

  // Congresista filters
  const [congSearch, setCongSearch] = useState('')

  // PL data
  const favoriteProjects = proyectos.filter(p => favorites.includes(p.id))
  const estados = [...new Set(favoriteProjects.map(p => p.estado))]
  const sectorOptions = sectores.map(s => ({ value: s.id, label: s.name }))

  const tipoMedidaOptions = [
    { value: 'proyecto_ley', label: 'Proyecto de Ley' },
    { value: 'dictamen', label: 'Dictamen' },
    { value: 'ley_aprobada', label: 'Ley Aprobada' },
  ]
  const relevanciaOptions = [
    { value: 'Alta', label: 'Alta' },
    { value: 'Media', label: 'Media' },
    { value: 'Baja', label: 'Baja' },
  ]

  const [selectedNivel, setSelectedNivel] = useState<number | null>(null)

  const filteredPL = favoriteProjects.filter(p => {
    const q = plSearch.toLowerCase()
    const matchesSearch = !q || p.titulo.toLowerCase().includes(q) || p.numero.toLowerCase().includes(q) || p.sumilla.toLowerCase().includes(q)
    const matchesEstado = selectedEstados.length === 0 || selectedEstados.includes(p.estado)
    const matchesSector = selectedSectores.length === 0 || selectedSectores.includes(p.sectorId)
    const matchesNivel = selectedNivel === null || (p.nivel ?? 1) >= selectedNivel
    const matchesTipoMedida = selectedTipoMedida.length === 0 || selectedTipoMedida.includes(p.tipoMedida)
    const matchesRelevancia = selectedRelevancia.length === 0 || selectedRelevancia.includes(p.prioridad)
    return matchesSearch && matchesEstado && matchesSector && matchesNivel && matchesTipoMedida && matchesRelevancia
  })

  const { sort: plSort, toggleSort: togglePlSort, sortedData: sortedPL } = useSortableTable(filteredPL, { column: 'fechaPresentacion', direction: 'desc' })

  // Timeline phases for legislative process with colors (mutually exclusive)
  // Count projects by state to ensure each project is counted only once
  const plCount = favoriteProjects.filter(p => !p.estado || p.estado === 'Presentado' || p.estado === 'Nuevo').length
  const dictamenCount = favoriteProjects.filter(p => p.estado === 'En Comisión').length
  const debateCount = favoriteProjects.filter(p => p.estado === 'En Pleno').length
  const aprobadaCount = favoriteProjects.filter(p => p.estado === 'Aprobado').length
  const otherCount = favoriteProjects.length - (plCount + dictamenCount + debateCount + aprobadaCount)
  
  const timelinePhases = [
    { 
      id: 'pl', 
      label: 'PL', 
      count: plCount,
      textColor: 'text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-400 dark:border-sky-500',
      progressColor: 'bg-sky-500',
      lightBg: 'bg-sky-50 dark:bg-sky-950/40'
    },
    { 
      id: 'dictamen', 
      label: 'Dictámenes', 
      count: dictamenCount,
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-400 dark:border-green-500',
      progressColor: 'bg-green-500',
      lightBg: 'bg-green-50 dark:bg-green-950/40'
    },
    { 
      id: 'debate', 
      label: 'En agenda/debate', 
      count: debateCount,
      textColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'border-amber-400 dark:border-amber-500',
      progressColor: 'bg-amber-500',
      lightBg: 'bg-amber-50 dark:bg-amber-950/40'
    },
    { 
      id: 'aprobada', 
      label: 'Ley aprobada', 
      count: aprobadaCount,
      textColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-400 dark:border-purple-500',
      progressColor: 'bg-purple-500',
      lightBg: 'bg-purple-50 dark:bg-purple-950/40'
    },
    ...(otherCount > 0 ? [{
      id: 'otro',
      label: 'Otros',
      count: otherCount,
      textColor: 'text-slate-600 dark:text-slate-400',
      borderColor: 'border-slate-400 dark:border-slate-500',
      progressColor: 'bg-slate-500',
      lightBg: 'bg-slate-50 dark:bg-slate-950/40'
    }] : [])
  ]

  // Congresista data
  const favoriteCongList = congresistas.filter(c => favoriteCongresistas.includes(c.id))

  const filteredCong = favoriteCongList.filter(c => {
    const q = congSearch.toLowerCase()
    return !q || c.nombre.toLowerCase().includes(q) || c.partido.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)
  })

  const { sort: congSort, toggleSort: toggleCongSort, sortedData: sortedCong } = useSortableTable(filteredCong, { column: 'nombre', direction: 'asc' })

  const hasPlFilters = plSearch || selectedEstados.length > 0 || selectedSectores.length > 0 || selectedTipoMedida.length > 0 || selectedRelevancia.length > 0

  if (selectedProject) {
    return (
      <ProjectDetail
        proyecto={selectedProject}
        isFavorite={favorites.includes(selectedProject.id)}
        onToggleFavorite={() => onToggleFavorite(selectedProject.id)}
        onBack={() => setSelectedProject(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Star className="h-6 w-6 fill-warning text-warning" />
            Mis Favoritos
          </h2>
          <p className="text-muted-foreground text-sm">
            {favorites.length} proyecto{favorites.length !== 1 ? 's' : ''} · {favoriteCongresistas.length} congresista{favoriteCongresistas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <Tabs defaultValue="proyectos">
        <TabsList>
          <TabsTrigger value="proyectos" className="gap-2">
            Proyectos de Ley
            {favorites.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">{favorites.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="congresistas" className="gap-2">
            Congresistas
            {favoriteCongresistas.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">{favoriteCongresistas.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Proyectos de Ley Tab ── */}
        <TabsContent value="proyectos" className="mt-6 space-y-4">
          {favorites.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Empty>
                <EmptyMedia variant="icon"><Star className="h-6 w-6" /></EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>Sin proyectos favoritos</EmptyTitle>
                  <EmptyDescription>Agrega proyectos de ley a tus favoritos para hacer seguimiento</EmptyDescription>
                </EmptyHeader>
                <EmptyContent><Button onClick={onBack}>Explorar proyectos</Button></EmptyContent>
              </Empty>
            </div>
          ) : (
            <>
              {/* Timeline - Horizontal Process with improved design */}
              <div className="rounded-lg border border-border bg-card p-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-8">Fases del proceso legislativo</p>
                
                {/* Timeline Container */}
                <div className="space-y-8">
                  {/* Nodes Row */}
                  <div className="flex items-center justify-between gap-2 px-2">
                    {timelinePhases.map((phase, i) => {
                      const totalProjects = favoriteProjects.length
                      const percentage = totalProjects > 0 ? Math.round((phase.count / totalProjects) * 100) : 0
                      return (
                        <div key={phase.id} className="flex flex-col items-center flex-1">
                          {/* Circle Node */}
                          <div className={`w-20 h-20 rounded-full ${phase.lightBg} border-4 ${phase.borderColor} flex items-center justify-center mb-4 shadow-sm`}>
                            <div className={`text-2xl font-bold text-center ${phase.textColor}`}>
                              {phase.count}
                            </div>
                          </div>
                          
                          {/* Phase Label and Percentage */}
                          <div className="text-center min-h-12 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-foreground">{phase.label}</p>
                            <p className="text-xs font-medium text-muted-foreground">{percentage}%</p>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-12 h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
                            <div 
                              className={`h-full ${phase.progressColor} rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          
                          {/* Connector */}
                          {i < timelinePhases.length - 1 && (
                            <div className="absolute w-8 h-0.5 bg-muted mt-10 ml-10 transform translate-x-20" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Horizontal connector line */}
                  <div className="flex items-center justify-between px-2 -mt-6">
                    {timelinePhases.map((_, i) => (
                      <div key={i} className="flex-1">
                        {i < timelinePhases.length - 1 && (
                          <div className="h-0.5 bg-muted mx-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por título, número o sumilla..." value={plSearch} onChange={e => setPlSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="w-44">
                  <MultiSelect options={estados.map(e => ({ value: e, label: e }))} selected={selectedEstados} onChange={setSelectedEstados} placeholder="Estado" />
                </div>
                <div className="w-48">
                  <MultiSelect options={sectorOptions} selected={selectedSectores} onChange={setSelectedSectores} placeholder="Sector" />
                </div>
                <div className="w-44">
                  <MultiSelect options={tipoMedidaOptions} selected={selectedTipoMedida} onChange={setSelectedTipoMedida} placeholder="Tipo de resolución" />
                </div>
                <div className="w-36">
                  <MultiSelect options={relevanciaOptions} selected={selectedRelevancia} onChange={setSelectedRelevancia} placeholder="Relevancia" />
                </div>
                {hasPlFilters && (
                  <Button variant="ghost" size="sm" onClick={() => { setPlSearch(''); setSelectedEstados([]); setSelectedSectores([]); setSelectedTipoMedida([]); setSelectedRelevancia([]) }} className="gap-1 text-muted-foreground">
                    <X className="h-3.5 w-3.5" />Limpiar
                  </Button>
                )}
                <span className="text-sm text-muted-foreground ml-auto">{sortedPL.length} resultado{sortedPL.length !== 1 ? 's' : ''}</span>
              </div>

              {sortedPL.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No se encontraron proyectos con los filtros aplicados</div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <SortableHead column="numero" sort={plSort} onSort={togglePlSort} className="w-[120px]">ID</SortableHead>
                        <SortableHead column="titulo" sort={plSort} onSort={togglePlSort}>Título</SortableHead>
                        <SortableHead column="estado" sort={plSort} onSort={togglePlSort} className="w-[120px]">Estado</SortableHead>
                        <SortableHead column="sectorId" sort={plSort} onSort={togglePlSort} className="w-[120px]">Sector</SortableHead>
                        <SortableHead column="nivel" sort={plSort} onSort={togglePlSort} className="w-[110px]">Nivel de avance</SortableHead>
                        <SortableHead column="tipoMedida" sort={plSort} onSort={togglePlSort} className="w-[120px]">Tipo</SortableHead>
                        <SortableHead column="prioridad" sort={plSort} onSort={togglePlSort} className="w-[100px]">Relevancia</SortableHead>
                        <SortableHead column="probabilidadAprobacion" sort={plSort} onSort={togglePlSort} className="w-[80px]">Prob.</SortableHead>
                        <SortableHead column="fechaPresentacion" sort={plSort} onSort={togglePlSort} className="w-[110px]">Presentación</SortableHead>
                        <TableHead className="w-[48px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPL.map((proyecto) => {
                        const prob = getProbabilidad(proyecto.probabilidadAprobacion, proyecto.estado)
                        const sector = sectores.find(s => s.id === proyecto.sectorId)
                        return (
                          <TableRow key={proyecto.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedProject(proyecto)}>
                            <TableCell className="font-mono text-xs text-primary hover:underline">{proyecto.numero}</TableCell>
                            <TableCell className="text-sm font-medium">{proyecto.titulo}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${estadoStyles[proyecto.estado] ?? ''}`}>{proyecto.estado}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{sector?.name ?? '—'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(n => (
                                  <div
                                    key={n}
                                    className={`h-2 w-4 rounded-sm ${n <= (proyecto.nivel ?? 1) ? 'bg-primary' : 'bg-muted'}`}
                                  />
                                ))}
                                <span className="ml-1 text-xs text-muted-foreground">{proyecto.nivel ?? 1}/5</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {proyecto.tipoMedida === 'proyecto_ley' ? 'Proyecto de Ley' : proyecto.tipoMedida === 'dictamen' ? 'Dictamen' : 'Ley Aprobada'}
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs font-semibold ${
                                proyecto.prioridad === 'Alta' ? 'text-emerald-600 dark:text-emerald-400' :
                                proyecto.prioridad === 'Media' ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>{proyecto.prioridad}</span>
                            </TableCell>
                            <TableCell className="text-xs font-semibold">
                              {prob ? <span className={prob.className}>{prob.label}</span> : '—'}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(proyecto.fechaPresentacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onToggleFavorite(proyecto.id) }}>
                                <Star className="h-4 w-4 fill-warning text-warning" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Congresistas Tab ── */}
        <TabsContent value="congresistas" className="mt-6 space-y-4">
          {favoriteCongresistas.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Empty>
                <EmptyMedia variant="icon"><Users className="h-6 w-6" /></EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>Sin congresistas favoritos</EmptyTitle>
                  <EmptyDescription>Marca congresistas con la estrella para seguirlos desde aquí</EmptyDescription>
                </EmptyHeader>
                <EmptyContent><Button onClick={onBack}>Ver congresistas</Button></EmptyContent>
              </Empty>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por nombre, bancada o región..." value={congSearch} onChange={e => setCongSearch(e.target.value)} className="pl-9" />
                </div>
                {congSearch && (
                  <Button variant="ghost" size="sm" onClick={() => setCongSearch('')} className="gap-1 text-muted-foreground">
                    <X className="h-3.5 w-3.5" />Limpiar
                  </Button>
                )}
                <span className="text-sm text-muted-foreground ml-auto">{sortedCong.length} resultado{sortedCong.length !== 1 ? 's' : ''}</span>
              </div>

              {sortedCong.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No se encontraron congresistas con los filtros aplicados</div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <SortableHead column="nombre" sort={congSort} onSort={toggleCongSort} className="w-[220px]">Nombre</SortableHead>
                        <SortableHead column="partido" sort={congSort} onSort={toggleCongSort} className="w-[160px]">Bancada</SortableHead>
                        <SortableHead column="region" sort={congSort} onSort={toggleCongSort} className="w-[130px]">Región</SortableHead>
                        <SortableHead column="proyectosCount" sort={congSort} onSort={toggleCongSort} className="w-[100px]">Proyectos</SortableHead>
                        <TableHead className="w-[48px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCong.map((c) => (
                        <TableRow key={c.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary/10 text-xs">
                                  {c.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{c.nombre}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.partido}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{c.region}</TableCell>
                          <TableCell className="text-xs text-center font-semibold">{c.proyectosCount}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleFavoriteCongresista?.(c.id)}>
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
