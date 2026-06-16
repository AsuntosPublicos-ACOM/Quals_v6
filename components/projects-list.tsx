'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Search, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { proyectos, sectores } from '@/lib/data'
import { MultiSelect } from '@/components/ui/multi-select'
import { SortableHead } from '@/components/ui/sortable-head'
import { useSortableTable } from '@/hooks/use-sortable-table'
import { ProjectDetail } from '@/components/project-detail'
import type { ProyectoLey } from '@/lib/types'

interface ProjectsListProps {
  onBack: () => void
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export function ProjectsList({ onBack, favorites, onToggleFavorite }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const [selectedEstados, setSelectedEstados] = useState<string[]>([])
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoLey | null>(null)

  const sectorList = useMemo(() =>
    sectores.map(s => ({ id: s.id, nombre: s.name })).sort((a, b) => a.nombre.localeCompare(b.nombre)),
    []
  )

  const estados = ['En Comisión', 'En Pleno', 'Aprobado', 'Archivado', 'Observado', 'Publicado']

  const filteredProjects = useMemo<ProyectoLey[]>(() => {
    return proyectos.filter(p => {
      const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.numero.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = selectedSectores.length === 0 || selectedSectores.includes(p.sectorId)
      const matchesEstado = selectedEstados.length === 0 || selectedEstados.includes(p.estado)
      const fecha = p.fechaPresentacion
      const matchesDesde = !fechaDesde || fecha >= fechaDesde
      const matchesHasta = !fechaHasta || fecha <= fechaHasta
      return matchesSearch && matchesSector && matchesEstado && matchesDesde && matchesHasta
    })
  }, [searchQuery, selectedSectores, selectedEstados, fechaDesde, fechaHasta])

  const { sort, toggleSort, sortedData: sortedProjects } = useSortableTable(filteredProjects, { column: 'fechaPresentacion', direction: 'desc' })

  if (selectedProyecto) {
    return (
      <ProjectDetail
        proyecto={selectedProyecto}
        isFavorite={favorites.includes(selectedProyecto.id)}
        onToggleFavorite={() => onToggleFavorite(selectedProyecto.id)}
        onBack={() => setSelectedProyecto(null)}
      />
    )
  }

  const hasActiveFilters = searchQuery !== '' || selectedSectores.length > 0 || selectedEstados.length > 0 || fechaDesde !== '' || fechaHasta !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSectores([])
    setSelectedEstados([])
    setFechaDesde('')
    setFechaHasta('')
  }

  const getEstadoColor = (estado: string): string => {
    const colors: Record<string, string> = {
      'En Comision': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'En Pleno': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'Aprobado': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      'Publicado': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
      'Archivado': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
      'Observado': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    }
    return colors[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Proyectos de Ley</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Busqueda y filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar por titulo o numero..."
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

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sector / Comision</label>
              <MultiSelect
                options={sectorList.map(s => ({ value: s.id, label: s.nombre }))}
                selected={selectedSectores}
                onChange={setSelectedSectores}
                placeholder="Todos los sectores"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estado</label>
              <MultiSelect
                options={estados.map(e => ({ value: e, label: e }))}
                selected={selectedEstados}
                onChange={setSelectedEstados}
                placeholder="Todos los estados"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background outline-none focus:ring-1 focus:ring-ring"
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
          <CardTitle className="text-lg">
            Proyectos ({filteredProjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[40px]"></TableHead>
                  <SortableHead column="numero" sort={sort} onSort={toggleSort} className="w-[100px]">Numero</SortableHead>
                  <SortableHead column="titulo" sort={sort} onSort={toggleSort} className="w-[280px]">Titulo</SortableHead>
                  <SortableHead column="fechaPresentacion" sort={sort} onSort={toggleSort} className="w-[110px]">Fecha</SortableHead>
                  <SortableHead column="comision" sort={sort} onSort={toggleSort} className="w-[140px]">Comision</SortableHead>
                  <SortableHead column="estado" sort={sort} onSort={toggleSort} className="w-[100px]">Estado</SortableHead>
                  <SortableHead column="probabilidadAprobacion" sort={sort} onSort={toggleSort} className="w-[70px] text-center">Prob.</SortableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron proyectos
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProjects.map((proyecto) => (
                    <TableRow key={proyecto.id} className="hover:bg-muted/50">
                      <TableCell className="pr-0">
                        <button
                          onClick={() => onToggleFavorite(proyecto.id)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                          title={favorites.includes(proyecto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                        >
                          <Star className={`h-3.5 w-3.5 ${favorites.includes(proyecto.id) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                        </button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <button
                          onClick={() => setSelectedProyecto(proyecto)}
                          className="text-primary hover:underline cursor-pointer"
                        >
                          {proyecto.numero}
                        </button>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="line-clamp-2">{proyecto.titulo}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(proyecto.fechaPresentacion)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {proyecto.comision}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${getEstadoColor(proyecto.estado)}`}>
                          {proyecto.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {proyecto.estado === 'Aprobado' || proyecto.estado === 'Archivado' ? (
                          ''
                        ) : proyecto.probabilidadAprobacion >= 67 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Alta</span>
                        ) : proyecto.probabilidadAprobacion >= 34 ? (
                          <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Med</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 font-semibold">Baja</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
