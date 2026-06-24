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
  dateFrom?: Date
  dateTo?: Date
  sectors: string[]
  partidos: string[]
  legisladores: string[]
}

export function LegislativeFilters({ congresistas, onFiltersChange }: LegislativeFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [dateError, setDateError] = useState<string>('')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [selectedLegisladores, setSelectedLegisladores] = useState<string[]>([])

  // Parse dd/mm/yyyy to Date
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null
    const parts = dateStr.split('/')
    if (parts.length !== 3) return null
    const [day, month, year] = parts.map(Number)
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    if (day < 1 || day > 31 || month < 1 || month > 12) return null
    const date = new Date(year, month - 1, day)
    if (date.getDate() !== day) return null // Invalid day for month
    return date
  }

  // Format Date to dd/mm/yyyy
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Validate date range
  const validateDateRange = (from: string, to: string) => {
    if (!from && !to) {
      setDateError('')
      return true
    }
    if (from && to) {
      const fromDate = parseDate(from)
      const toDate = parseDate(to)
      if (!fromDate || !toDate) {
        setDateError('Formato de fecha inválido. Use dd/mm/aaaa')
        return false
      }
      if (toDate < fromDate) {
        setDateError('Hasta no puede ser anterior a Desde')
        return false
      }
    }
    setDateError('')
    return true
  }

  // Extract unique values
  const sectors = useMemo(() => 
    [...new Set(congresistas.map(c => c.sector).filter(Boolean))] as string[]
  , [congresistas])

  const partidos = useMemo(() => 
    [...new Set(congresistas.map(c => c.partido).filter(Boolean))] as string[]
  , [congresistas])

  // Update date fields with validation
  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    if (validateDateRange(value, dateTo)) {
      const fromDate = value ? parseDate(value) : undefined
      const toDate = dateTo ? parseDate(dateTo) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: selectedSectors,
        partidos: selectedPartidos,
        legisladores: selectedLegisladores
      })
    }
  }

  const handleDateToChange = (value: string) => {
    setDateTo(value)
    if (validateDateRange(dateFrom, value)) {
      const fromDate = dateFrom ? parseDate(dateFrom) : undefined
      const toDate = value ? parseDate(value) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: selectedSectors,
        partidos: selectedPartidos,
        legisladores: selectedLegisladores
      })
    }
  }

  const updateSectors = (newSectors: string[]) => {
    setSelectedSectors(newSectors)
    setTimeout(() => {
      const fromDate = dateFrom ? parseDate(dateFrom) : undefined
      const toDate = dateTo ? parseDate(dateTo) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: newSectors,
        partidos: selectedPartidos,
        legisladores: selectedLegisladores
      })
    }, 0)
  }

  const updatePartidos = (newPartidos: string[]) => {
    setSelectedPartidos(newPartidos)
    setTimeout(() => {
      const fromDate = dateFrom ? parseDate(dateFrom) : undefined
      const toDate = dateTo ? parseDate(dateTo) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: selectedSectors,
        partidos: newPartidos,
        legisladores: selectedLegisladores
      })
    }, 0)
  }

  const updateLegisladores = (newLegisladores: string[]) => {
    setSelectedLegisladores(newLegisladores)
    setTimeout(() => {
      const fromDate = dateFrom ? parseDate(dateFrom) : undefined
      const toDate = dateTo ? parseDate(dateTo) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: selectedSectors,
        partidos: selectedPartidos,
        legisladores: newLegisladores
      })
    }, 0)
  }

  const activeFiltersCount = 
    (dateFrom || dateTo ? 1 : 0) +
    selectedSectors.length +
    selectedPartidos.length +
    selectedLegisladores.length

  const handleClearAll = () => {
    setDateFrom('')
    setDateTo('')
    setDateError('')
    setSelectedSectors([])
    setSelectedPartidos([])
    setSelectedLegisladores([])
    onFiltersChange({
      dateFrom: undefined,
      dateTo: undefined,
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
          {/* Período - Rango de fechas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Período</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="dateFrom" className="text-xs text-muted-foreground">Desde</label>
                <input
                  id="dateFrom"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  onBlur={() => validateDateRange(dateFrom, dateTo)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Fecha desde"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="dateTo" className="text-xs text-muted-foreground">Hasta</label>
                <input
                  id="dateTo"
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  onBlur={() => validateDateRange(dateFrom, dateTo)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Fecha hasta"
                />
              </div>
            </div>
            {dateError && (
              <p className="text-xs text-red-600 dark:text-red-400">{dateError}</p>
            )}
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
