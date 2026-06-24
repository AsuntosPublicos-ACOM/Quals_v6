'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, X } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi-select'
import type { Congresista } from '@/lib/types'

interface LegislativeFiltersProps {
  congresistas: Congresista[]
  onFiltersChange: (filters: LegislativeFilterState) => void
}

export interface LegislativeFilterState {
  periodPreset: 'year' | '2021-2025' | 'all'
  dateFrom?: Date
  dateTo?: Date
  sectors: string[]
  partidos: string[]
  legisladores: string[]
}

export function LegislativeFilters({ congresistas, onFiltersChange }: LegislativeFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [periodPreset, setPeriodPreset] = useState<'year' | '2021-2025' | 'all'>('all')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [selectedLegisladores, setSelectedLegisladores] = useState<string[]>([])

  // Extract unique values
  const sectors = useMemo(() => 
    [...new Set(congresistas.map(c => c.sector).filter(Boolean))] as string[]
  , [congresistas])

  const partidos = useMemo(() => 
    [...new Set(congresistas.map(c => c.partido).filter(Boolean))] as string[]
  , [congresistas])

  // Propagate changes
  const handleChange = () => {
    onFiltersChange({
      periodPreset,
      sectors: selectedSectors,
      partidos: selectedPartidos,
      legisladores: selectedLegisladores
    })
  }

  const updateSectors = (newSectors: string[]) => {
    setSelectedSectors(newSectors)
    setTimeout(() => {
      onFiltersChange({
        periodPreset,
        sectors: newSectors,
        partidos: selectedPartidos,
        legisladores: selectedLegisladores
      })
    }, 0)
  }

  const updatePartidos = (newPartidos: string[]) => {
    setSelectedPartidos(newPartidos)
    setTimeout(() => {
      onFiltersChange({
        periodPreset,
        sectors: selectedSectors,
        partidos: newPartidos,
        legisladores: selectedLegisladores
      })
    }, 0)
  }

  const updateLegisladores = (newLegisladores: string[]) => {
    setSelectedLegisladores(newLegisladores)
    setTimeout(() => {
      onFiltersChange({
        periodPreset,
        sectors: selectedSectors,
        partidos: selectedPartidos,
        legisladores: newLegisladores
      })
    }, 0)
  }

  const updatePeriod = (preset: 'year' | '2021-2025' | 'all') => {
    setPeriodPreset(preset)
    setTimeout(() => {
      onFiltersChange({
        periodPreset: preset,
        sectors: selectedSectors,
        partidos: selectedPartidos,
        legisladores: selectedLegisladores
      })
    }, 0)
  }

  const activeFiltersCount = 
    (periodPreset !== 'all' ? 1 : 0) +
    selectedSectors.length +
    selectedPartidos.length +
    selectedLegisladores.length

  const handleClearAll = () => {
    setPeriodPreset('all')
    setSelectedSectors([])
    setSelectedPartidos([])
    setSelectedLegisladores([])
    onFiltersChange({
      periodPreset: 'all',
      sectors: [],
      partidos: [],
      legisladores: []
    })
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Header con toggle */}
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleClearAll()
              }}
              className="h-8 px-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
              title="Limpiar todos los filtros"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Período */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Período</label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={periodPreset === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updatePeriod('year')}
              >
                Último año
              </Button>
              <Button
                variant={periodPreset === '2021-2025' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updatePeriod('2021-2025')}
              >
                2021-2025
              </Button>
              <Button
                variant={periodPreset === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updatePeriod('all')}
              >
                Todo
              </Button>
            </div>
          </div>

          {/* Sector, Partido, Legislador */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Sector</label>
              <MultiSelect
                options={sectors.map(s => ({ value: s, label: s }))}
                selected={selectedSectors}
                onChange={updateSectors}
                placeholder="Seleccionar..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Partido</label>
              <MultiSelect
                options={partidos.map(p => ({ value: p, label: p }))}
                selected={selectedPartidos}
                onChange={updatePartidos}
                placeholder="Seleccionar..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Legislador</label>
              <MultiSelect
                options={congresistas.map(c => ({ value: c.id, label: c.nombre }))}
                selected={selectedLegisladores}
                onChange={updateLegisladores}
                placeholder="Seleccionar..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
