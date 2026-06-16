'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Search, X, Scale, Calendar, Building2, ChevronUp, ChevronDown } from 'lucide-react'
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
import { leyesAprobadas, sectores } from '@/lib/data'
import { MultiSelect } from '@/components/ui/multi-select'
import { LeyDetail } from '@/components/ley-detail'
import type { LeyAprobada } from '@/lib/types'

interface LeyesListProps {
  onBack: () => void
}

type SortColumn = 'numeroLey' | 'titulo' | 'fechaPublicacion' | 'sectorId' | 'vigencia' | 'impacto'
type SortDirection = 'asc' | 'desc'

export function LeyesList({ onBack }: LeyesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSectores, setSelectedSectores] = useState<string[]>([])
  const [selectedVigencias, setSelectedVigencias] = useState<string[]>([])
  const [selectedImpactos, setSelectedImpactos] = useState<string[]>([])
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [selectedLey, setSelectedLey] = useState<LeyAprobada | null>(null)
  const [sortColumn, setSortColumn] = useState<SortColumn>('fechaPublicacion')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const sectorList = useMemo(() =>
    sectores.map(s => ({ id: s.id, nombre: s.name })).sort((a, b) => a.nombre.localeCompare(b.nombre)),
    []
  )

  const vigencias = ['En vigor', 'Pendiente reglamentación', 'Con modificaciones', 'Derogada']
  const impactos = ['Alto', 'Medio', 'Bajo']

  const filteredLeyes = useMemo<LeyAprobada[]>(() => {
    return leyesAprobadas.filter(ley => {
      const matchesSearch = ley.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ley.numeroLey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ley.sumilla.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = selectedSectores.length === 0 || selectedSectores.includes(ley.sectorId)
      const matchesVigencia = selectedVigencias.length === 0 || selectedVigencias.includes(ley.vigencia)
      const matchesImpacto = selectedImpactos.length === 0 || (ley.impacto && selectedImpactos.includes(ley.impacto))
      const fecha = ley.fechaPublicacion
      const matchesDesde = !fechaDesde || fecha >= fechaDesde
      const matchesHasta = !fechaHasta || fecha <= fechaHasta
      return matchesSearch && matchesSector && matchesVigencia && matchesImpacto && matchesDesde && matchesHasta
    })
  }, [searchQuery, selectedSectores, selectedVigencias, selectedImpactos, fechaDesde, fechaHasta])

  const sortedLeyes = useMemo(() => {
    return [...filteredLeyes].sort((a, b) => {
      let comparison = 0
      switch (sortColumn) {
        case 'numeroLey':
          comparison = a.numeroLey.localeCompare(b.numeroLey)
          break
        case 'titulo':
          comparison = a.titulo.localeCompare(b.titulo)
          break
        case 'fechaPublicacion':
          comparison = a.fechaPublicacion.localeCompare(b.fechaPublicacion)
          break
        case 'sectorId':
          const sectorA = sectores.find(s => s.id === a.sectorId)?.name || ''
          const sectorB = sectores.find(s => s.id === b.sectorId)?.name || ''
          comparison = sectorA.localeCompare(sectorB)
          break
        case 'vigencia':
          comparison = a.vigencia.localeCompare(b.vigencia)
          break
        case 'impacto':
          const impactoOrder = { 'Alto': 3, 'Medio': 2, 'Bajo': 1 }
          comparison = (impactoOrder[a.impacto || 'Bajo'] || 0) - (impactoOrder[b.impacto || 'Bajo'] || 0)
          break
        default:
          comparison = 0
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredLeyes, sortColumn, sortDirection])

  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const SortableHeader = ({ column, children, className }: { column: SortColumn; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <button
        onClick={() => toggleSort(column)}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {children}
        {sortColumn === column && (
          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </button>
    </TableHead>
  )

  if (selectedLey) {
    return (
      <LeyDetail
        ley={selectedLey}
        onBack={() => setSelectedLey(null)}
      />
    )
  }

  const hasActiveFilters = searchQuery !== '' || selectedSectores.length > 0 || selectedVigencias.length > 0 || selectedImpactos.length > 0 || fechaDesde !== '' || fechaHasta !== ''

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSectores([])
    setSelectedVigencias([])
    setSelectedImpactos([])
    setFechaDesde('')
    setFechaHasta('')
  }

  const getVigenciaColor = (vigencia: string): string => {
    const colors: Record<string, string> = {
      'En vigor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      'Pendiente reglamentación': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      'Con modificaciones': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'Derogada': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
    }
    return colors[vigencia] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }

  const getImpactoColor = (impacto?: string): string => {
    const colors: Record<string, string> = {
      'Alto': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      'Medio': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      'Bajo': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    }
    return impacto ? colors[impacto] || '' : ''
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
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Leyes Aprobadas</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Búsqueda y filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2 text-sm bg-background">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar por título, número o sumilla..."
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

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sector</label>
              <MultiSelect
                options={sectorList.map(s => ({ value: s.id, label: s.nombre }))}
                selected={selectedSectores}
                onChange={setSelectedSectores}
                placeholder="Todos los sectores"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Vigencia</label>
              <MultiSelect
                options={vigencias.map(v => ({ value: v, label: v }))}
                selected={selectedVigencias}
                onChange={setSelectedVigencias}
                placeholder="Todas las vigencias"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Impacto</label>
              <MultiSelect
                options={impactos.map(i => ({ value: i, label: i }))}
                selected={selectedImpactos}
                onChange={setSelectedImpactos}
                placeholder="Todos los impactos"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Leyes ({sortedLeyes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <SortableHeader column="numeroLey" className="w-[140px]">N° de Ley</SortableHeader>
                  <SortableHeader column="titulo" className="min-w-[300px]">Título</SortableHeader>
                  <SortableHeader column="sectorId" className="w-[150px]">Sector</SortableHeader>
                  <SortableHeader column="fechaPublicacion" className="w-[120px]">Publicación</SortableHeader>
                  <SortableHeader column="vigencia" className="w-[180px]">Vigencia</SortableHeader>
                  <SortableHeader column="impacto" className="w-[100px]">Impacto</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLeyes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No se encontraron leyes con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLeyes.map((ley) => {
                    const sector = sectores.find(s => s.id === ley.sectorId)
                    return (
                      <TableRow
                        key={ley.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedLey(ley)}
                      >
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {ley.numeroLey.replace('Ley N° ', '')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm text-foreground line-clamp-2">
                              {ley.titulo}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {ley.sumilla}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{sector?.name || ley.sectorId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{formatDate(ley.fechaPublicacion)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getVigenciaColor(ley.vigencia)}>
                            {ley.vigencia}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {ley.impacto && (
                            <Badge className={getImpactoColor(ley.impacto)}>
                              {ley.impacto}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
