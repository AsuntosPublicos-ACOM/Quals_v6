'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { MultiSelect } from '@/components/ui/multi-select'
import type { Congresista } from '@/lib/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export interface HeatmapFilterState {
  dateFrom?: Date
  dateTo?: Date
  sectors: string[]
}

interface HeatmapFiltersProps {
  congresistas: Congresista[]
  onFiltersChange: (filters: HeatmapFilterState) => void
}

export function HeatmapFilters({ congresistas, onFiltersChange }: HeatmapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [dateError, setDateError] = useState<string>('')
  const [selectedSectors, setSelectedSectors] = useState<string[]>([])

  // Parse dd/mm/yyyy to Date
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null
    const parts = dateStr.split('/')
    if (parts.length !== 3) return null
    const [day, month, year] = parts.map(Number)
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    if (day < 1 || day > 31 || month < 1 || month > 12) return null
    const date = new Date(year, month - 1, day)
    if (date.getDate() !== day) return null
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

  // Extract unique sectors
  const sectors = useMemo(
    () => [...new Set(congresistas.map(c => c.sector).filter(Boolean))] as string[],
    [congresistas]
  )

  const activeFiltersCount = (dateFrom || dateTo ? 1 : 0) + selectedSectors.length

  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    if (validateDateRange(value, dateTo)) {
      const fromDate = value ? parseDate(value) : undefined
      const toDate = dateTo ? parseDate(dateTo) : undefined
      onFiltersChange({
        dateFrom: fromDate,
        dateTo: toDate,
        sectors: selectedSectors
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
        sectors: selectedSectors
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
        sectors: newSectors
      })
    }, 0)
  }

  const handleClearAll = () => {
    setDateFrom('')
    setDateTo('')
    setDateError('')
    setSelectedSectors([])
    onFiltersChange({
      dateFrom: undefined,
      dateTo: undefined,
      sectors: []
    })
  }

  return (
    <div className="space-y-3 pb-3 border-b border-border/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full hover:opacity-75 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
              {activeFiltersCount} activo{activeFiltersCount > 1 ? 's' : ''}
            </span>
          )}
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
              className="h-7 px-2 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in-50 duration-200">
          {/* Período */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Período</label>
            <div className="grid grid-cols-2 gap-2">
              {/* Desde */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-normal text-xs h-8"
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {dateFrom ? dateFrom : 'Desde'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom ? parseDate(dateFrom) || undefined : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleDateFromChange(formatDate(date))
                      }
                    }}
                    disabled={(date) => {
                      if (dateTo) {
                        const toDate = parseDate(dateTo)
                        return toDate ? date > toDate : false
                      }
                      return false
                    }}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>

              {/* Hasta */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-normal text-xs h-8"
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {dateTo ? dateTo : 'Hasta'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo ? parseDate(dateTo) || undefined : undefined}
                    onSelect={(date) => {
                      if (date) {
                        handleDateToChange(formatDate(date))
                      }
                    }}
                    disabled={(date) => {
                      if (dateFrom) {
                        const fromDate = parseDate(dateFrom)
                        return fromDate ? date < fromDate : false
                      }
                      return false
                    }}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {dateError && (
              <p className="text-xs text-red-600 dark:text-red-400">{dateError}</p>
            )}
          </div>

          {/* Sector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Sector</label>
            <MultiSelect
              options={sectors.map(s => ({ id: s, label: s }))}
              selected={selectedSectors}
              onSelectionChange={updateSectors}
              placeholder="Seleccionar..."
            />
          </div>
        </div>
      )}
    </div>
  )
}
