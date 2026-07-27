'use client'

import { useState } from 'react'
import { X, Calendar, Settings2, BarChart3, Building2, User } from 'lucide-react'
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
  filterOrder?: ('fechas' | 'sectores' | 'partidos' | 'legisladores')[]
}

export function TweetFiltersPanel({
  filters,
  onFiltersChange,
  partidos,
  legisladores,
  sectores,
  filterOrder = ['fechas', 'partidos', 'sectores', 'legisladores']
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
    <Card className="border border-border">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold">Filtros</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-7 px-2 text-xs"
              title="Limpiar filtros"
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {filterOrder.includes('fechas') && (
          <>
            {/* Filtro de Fechas */}
            <div className="space-y-2 pb-3 border-b border-border">
              <button
                onClick={() => toggleSection('fecha')}
                className="w-full flex items-center justify-between text-sm font-medium hover:opacity-70 transition-opacity"
              >
                <span>Período</span>
                <span className="text-xs text-muted-foreground">
                  {expandedSections.fecha ? '−' : '+'}
                </span>
              </button>
              {expandedSections.fecha && (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Desde</label>
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      onBlur={handleDateChange}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Hasta</label>
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      onBlur={handleDateChange}
                      className="w-full px-2 py-1.5 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {filterOrder.includes('sectores') && (
          <>
            {/* Filtro de Sectores */}
            <div className="space-y-2 pb-3 border-b border-border">
              <button
                onClick={() => toggleSection('sector')}
                className="w-full flex items-center justify-between text-sm font-medium hover:opacity-70 transition-opacity"
              >
                <span>Sector</span>
                <span className="text-xs text-muted-foreground">
                  {expandedSections.sector ? '−' : '+'}
                </span>
              </button>
              {expandedSections.sector && (
                <div>
                  <MultiSelect
                    options={sectores.map(s => ({ value: s.id, label: s.name }))}
                    selected={filters.sectores}
                    onChange={handleSectoresChange}
                    placeholder="Seleccionar..."
                  />
                </div>
              )}
            </div>
          </>
        )}

        {filterOrder.includes('partidos') && (
          <>
            {/* Filtro de Partidos */}
            <div className="space-y-2 pb-3 border-b border-border">
              <button
                onClick={() => toggleSection('partido')}
                className="w-full flex items-center justify-between text-sm font-medium hover:opacity-70 transition-opacity"
              >
                <span>Partido</span>
                <span className="text-xs text-muted-foreground">
                  {expandedSections.partido ? '−' : '+'}
                </span>
              </button>
              {expandedSections.partido && (
                <div>
                  <MultiSelect
                    options={partidos.map(p => ({ value: p, label: p }))}
                    selected={filters.partidos}
                    onChange={handlePartidosChange}
                    placeholder="Seleccionar..."
                  />
                </div>
              )}
            </div>
          </>
        )}

        {filterOrder.includes('legisladores') && (
          <>
            {/* Filtro de Legisladores */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('legislador')}
                className="w-full flex items-center justify-between text-sm font-medium hover:opacity-70 transition-opacity"
              >
                <span>Legislador</span>
                <span className="text-xs text-muted-foreground">
                  {expandedSections.legislador ? '−' : '+'}
                </span>
              </button>
              {expandedSections.legislador && (
                <div>
                  <MultiSelect
                    options={legisladores.map(l => ({ value: l.id, label: l.nombre }))}
                    selected={filters.legisladores}
                    onChange={handleLegisladoresChange}
                    placeholder="Seleccionar legisladores..."
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
