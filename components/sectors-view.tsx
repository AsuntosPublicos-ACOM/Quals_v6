'use client'

import { useState } from 'react'
import { Calendar, Info, FileText, CheckCircle, BookOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Card, CardContent } from '@/components/ui/card'
import { SectorCard } from './sector-card'
import { SectorDetailView } from './sector-detail-view'
import { ProjectDetail } from './project-detail'
import { sectores, availableMonths, getPreviousMonth, getMonthLabel, proyectos } from '@/lib/data'
import type { ProyectoLey, Sector } from '@/lib/types'

interface SectorsViewProps {
  searchQuery: string
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onViewStateChange?: (viewState: 'grid' | 'sector' | 'detail') => void
  onBackToHome?: () => void
  initialSectorId?: string
  favoriteSectors?: string[]
  onToggleFavoriteSector?: (sectorId: string) => void
}

type ViewState = 'grid' | 'sector' | 'detail'

export function SectorsView({ searchQuery, favorites, onToggleFavorite, onViewStateChange, onBackToHome, initialSectorId, favoriteSectors = [], onToggleFavoriteSector }: SectorsViewProps) {
  const initialSector = initialSectorId ? (sectores.find(s => s.id === initialSectorId) ?? null) : null
  const [viewState, setViewState] = useState<ViewState>(initialSector ? 'sector' : 'grid')
  const [selectedSector, setSelectedSector] = useState<Sector | null>(initialSector)
  const [selectedProject, setSelectedProject] = useState<ProyectoLey | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0].value)
  const [dateMode, setDateMode] = useState<'month' | 'period'>('month')
  const [periodStart, setPeriodStart] = useState<string>('')
  const [periodEnd, setPeriodEnd] = useState<string>('')

  // Notify parent of view state changes
  const handleViewStateChange = (newState: ViewState) => {
    setViewState(newState)
    onViewStateChange?.(newState)
  }

  const previousMonth = getPreviousMonth(selectedMonth)

  const handleSectorClick = (sector: Sector) => {
    setSelectedSector(sector)
    handleViewStateChange('sector')
  }

  const handleProjectClick = (proyecto: ProyectoLey) => {
    setSelectedProject(proyecto)
    handleViewStateChange('detail')
  }

  const handleBack = () => {
    if (viewState === 'detail') {
      setSelectedProject(null)
      handleViewStateChange('sector')
    } else if (viewState === 'sector') {
      setSelectedSector(null)
      handleViewStateChange('grid')
      onBackToHome?.()
    }
  }

  const filteredSectors = sectores.filter(sector =>
    sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const favoriteSectorsList = filteredSectors.filter(s => favoriteSectors.includes(s.id))
  const otherSectorsList = filteredSectors.filter(s => !favoriteSectors.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name))

  // Helper: check if a date string (YYYY-MM-DD or YYYY-MM) is within the active range
  const dateInRange = (dateStr: string): boolean => {
    if (dateMode === 'month') {
      const [year, month] = selectedMonth.split('-')
      return dateStr.startsWith(`${year}-${month}`)
    }
    if (!periodStart && !periodEnd) return true
    const d = dateStr.length === 7 ? `${dateStr}-01` : dateStr
    if (periodStart && d < periodStart) return false
    if (periodEnd && d > periodEnd) return false
    return true
  }

  // Calculate totals for active period
  const totalProjectsThisMonth = sectores.reduce((sum, sector) => {
    if (dateMode === 'month') {
      const monthData = sector.monthlyData.find(d => d.month === selectedMonth)
      return sum + (monthData?.projectCount || 0)
    }
    return sum + sector.monthlyData
      .filter(d => dateInRange(d.month))
      .reduce((s, d) => s + d.projectCount, 0)
  }, 0)

  // Project detail view
  if (viewState === 'detail' && selectedProject) {
    return (
      <ProjectDetail
        proyecto={selectedProject}
        isFavorite={favorites.includes(selectedProject.id)}
        onToggleFavorite={() => onToggleFavorite(selectedProject.id)}
        onBack={handleBack}
      />
    )
  }

  // Sector detail view with sub-tabs
  if (viewState === 'sector' && selectedSector) {
    return (
      <SectorDetailView
        sector={selectedSector}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onBack={handleBack}
        onViewProject={handleProjectClick}
      />
    )
  }

  // Main grid view
  return (
    <div className="space-y-6">
      {/* Header with Date Selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Actividad legislativa por sector — {totalProjectsThisMonth} proyectos
          {dateMode === 'month' ? ` en ${getMonthLabel(selectedMonth)}` : periodStart || periodEnd ? ` en el período seleccionado` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />

          {/* Toggle Mes / Período */}
          <div className="flex rounded-md border border-border overflow-hidden text-xs font-medium">
            <button
              onClick={() => setDateMode('month')}
              className={`px-3 py-1.5 transition-colors ${dateMode === 'month' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              Mes
            </button>
            <button
              onClick={() => setDateMode('period')}
              className={`px-3 py-1.5 transition-colors ${dateMode === 'period' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
            >
              Período
            </button>
          </div>

          {/* Month selector */}
          {dateMode === 'month' && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[170px] h-8 text-sm">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Period inputs */}
          {dateMode === 'period' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={periodStart}
                onChange={e => setPeriodStart(e.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">a</span>
              <input
                type="date"
                value={periodEnd}
                onChange={e => setPeriodEnd(e.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Proyectos de ley este mes</p>
              <p className="text-2xl font-bold text-foreground">{totalProjectsThisMonth}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dictámenes este mes</p>
              <p className="text-2xl font-bold text-foreground">
              {proyectos.filter(p => dateInRange(p.ultimaActualizacion) && p.estado === 'En Pleno').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Leyes este mes</p>
              <p className="text-2xl font-bold text-foreground">
              {proyectos.filter(p => dateInRange(p.ultimaActualizacion) && p.estado === 'Aprobado').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Nivel de actividad:</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>El nivel se determina por la cantidad de proyectos presentados en el mes seleccionado</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-xs text-muted-foreground">Critico (15+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-500"></span>
            <span className="text-xs text-muted-foreground">Alto (10-14)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs text-muted-foreground">Moderado (5-9)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-muted-foreground">Bajo (0-4)</span>
          </div>
        </div>
      </div>

      {/* Sectors Grid */}
      {filteredSectors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron sectores que coincidan con tu busqueda
        </div>
      ) : (
        <div className="space-y-6">
          {favoriteSectorsList.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Mis sectores favoritos
              </p>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {favoriteSectorsList.map((sector) => (
                  <SectorCard
                    key={sector.id}
                    sector={sector}
                    selectedMonth={selectedMonth}
                    previousMonth={previousMonth}
                    onClick={() => handleSectorClick(sector)}
                    isFavorite={true}
                    onToggleFavorite={() => onToggleFavoriteSector?.(sector.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {favoriteSectorsList.length > 0 && (
              <p className="text-sm font-medium text-muted-foreground">Todos los sectores</p>
            )}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {otherSectorsList.map((sector) => (
                <SectorCard
                  key={sector.id}
                  sector={sector}
                  selectedMonth={selectedMonth}
                  previousMonth={previousMonth}
                  onClick={() => handleSectorClick(sector)}
                  isFavorite={false}
                  onToggleFavorite={() => onToggleFavoriteSector?.(sector.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
