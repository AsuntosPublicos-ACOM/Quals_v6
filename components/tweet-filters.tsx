'use client'

import { useState } from 'react'
import { X, Calendar, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Badge } from '@/components/ui/badge'
import type { TweetFilters } from '@/lib/types'

interface TweetFiltersProps {
  filters: TweetFilters
  onFiltersChange: (filters: TweetFilters) => void
  partidos: string[]
  legisladores: Array<{ id: string; nombre: string }>
  sectores: Array<{ id: string; name: string }>
}

export function TweetFiltersPanel({
  filters,
  onFiltersChange,
  partidos,
  legisladores,
  sectores
}: TweetFiltersProps) {
  const [fechaDesde, setFechaDesde] = useState(filters.fechaDesde || '')
  const [fechaHasta, setFechaHasta] = useState(filters.fechaHasta || '')
  const [expandedSections, setExpandedSections] = useState({
    fecha: true,
    partido: true,
    sector: true,
    legislador: true
  })

  const handleDateChange = () => {
    onFiltersChange({
      ...filters,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined
    })
  }

  const handlePartidosChange = (valores: string[]) => {
    onFiltersChange({
      ...filters,
      partidos: valores
    })
  }

  const handleSectoresChange = (valores: string[]) => {
    onFiltersChange({
      ...filters,
      sectores: valores
    })
  }

  const handleLegisladoresChange = (valores: string[]) => {
    onFiltersChange({
      ...filters,
      legisladores: valores
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleClearFilters = () => {
    setFechaDesde('')
    setFechaHasta('')
    onFiltersChange({
      fechaDesde: undefined,
      fechaHasta: undefined,
      sectores: [],
      partidos: [],
      legisladores: []
    })
  }

  const activeFilterCount = 
    (fechaDesde ? 1 : 0) + 
    (fechaHasta ? 1 : 0) + 
    filters.partidos.length + 
    filters.sectores.length + 
    filters.legisladores.length

  const hasActiveFilters = activeFilterCount > 0

  return (
    <Card className="col-span-12 lg:col-span-3 border-slate-200 dark:border-slate-700 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Settings2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">Filtros</CardTitle>
              {hasActiveFilters && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  {activeFilterCount} activo{activeFilterCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Limpiar todos los filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Filtro de Fechas */}
        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('fecha')}
            className="w-full flex items-center justify-between group hover:opacity-75 transition-opacity"
          >
            <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
              <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              Período
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {expandedSections.fecha ? '−' : '+'}
            </span>
          </button>
          {expandedSections.fecha && (
            <div className="space-y-2 pl-6">
              <div>
                <label className="text-xs text-muted-foreground font-medium">Desde</label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  onBlur={handleDateChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-medium">Hasta</label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  onBlur={handleDateChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filtro de Partidos */}
        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('partido')}
            className="w-full flex items-center justify-between group hover:opacity-75 transition-opacity"
          >
            <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
              <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <span className="text-base">🏛️</span>
              </div>
              Partido
            </label>
            {filters.partidos.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.partidos.length}
              </Badge>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {expandedSections.partido ? '−' : '+'}
            </span>
          </button>
          {expandedSections.partido && (
            <div className="pl-6">
              <MultiSelect
                options={partidos.map(p => ({ value: p, label: p }))}
                selected={filters.partidos}
                onChange={handlePartidosChange}
                placeholder="Seleccionar partidos..."
              />
            </div>
          )}
        </div>

        {/* Filtro de Sectores */}
        <div className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('sector')}
            className="w-full flex items-center justify-between group hover:opacity-75 transition-opacity"
          >
            <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
              <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <span className="text-base">📊</span>
              </div>
              Sector
            </label>
            {filters.sectores.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.sectores.length}
              </Badge>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {expandedSections.sector ? '−' : '+'}
            </span>
          </button>
          {expandedSections.sector && (
            <div className="pl-6">
              <MultiSelect
                options={sectores.map(s => ({ value: s.id, label: s.name }))}
                selected={filters.sectores}
                onChange={handleSectoresChange}
                placeholder="Seleccionar sectores..."
              />
            </div>
          )}
        </div>

        {/* Filtro de Legisladores */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('legislador')}
            className="w-full flex items-center justify-between group hover:opacity-75 transition-opacity"
          >
            <label className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
              <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                <span className="text-base">👤</span>
              </div>
              Legislador
            </label>
            {filters.legisladores.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {filters.legisladores.length}
              </Badge>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {expandedSections.legislador ? '−' : '+'}
            </span>
          </button>
          {expandedSections.legislador && (
            <div className="pl-6">
              <MultiSelect
                options={legisladores.map(l => ({ value: l.id, label: l.nombre }))}
                selected={filters.legisladores}
                onChange={handleLegisladoresChange}
                placeholder="Seleccionar legisladores..."
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
