'use client'

import { useEffect, useState } from 'react'
import { Download, Presentation, FileText, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DASHBOARD_SECTIONS, PERIODO, type DashboardSection } from '@/lib/dashboard-data'
import { exportDashboardToPptx, exportWeeklyReportToWord } from '@/lib/export-dashboard'

export type DashboardExportMode = 'ppt' | 'reporte'

interface ExportDashboardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: DashboardExportMode
}

const MODE_COPY: Record<
  DashboardExportMode,
  { title: string; description: string; cta: string; icon: typeof Presentation }
> = {
  ppt: {
    title: 'Exportar presentación',
    description: 'Genera un PPTX con una diapositiva por sección del tablero.',
    cta: 'Exportar PPT',
    icon: Presentation,
  },
  reporte: {
    title: 'Reporte semanal',
    description: 'Genera un documento Word con el resumen ejecutivo de la semana.',
    cta: 'Generar reporte',
    icon: FileText,
  },
}

export function ExportDashboardModal({ open, onOpenChange, mode }: ExportDashboardModalProps) {
  const copy = MODE_COPY[mode]
  const [selected, setSelected] = useState<DashboardSection[]>(DASHBOARD_SECTIONS.map((s) => s.id))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) setError(null)
  }, [open])

  function toggle(id: DashboardSection) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  async function handleExport() {
    if (selected.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const ordered = DASHBOARD_SECTIONS.filter((s) => selected.includes(s.id)).map((s) => s.id)
      if (mode === 'ppt') {
        await exportDashboardToPptx(ordered)
      } else {
        await exportWeeklyReportToWord(ordered)
      }
      onOpenChange(false)
    } catch (err) {
      console.log('[v0] Error al exportar dashboard:', err)
      setError('No se pudo generar el archivo. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <copy.icon className="h-4 w-4" />
            {copy.title}
          </DialogTitle>
          <DialogDescription>
            {copy.description} Periodo: {PERIODO}.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Secciones a incluir
          </p>
          <div className="flex flex-col gap-1.5">
            {DASHBOARD_SECTIONS.map((section) => {
              const isSelected = selected.includes(section.id)
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between rounded-md border px-3.5 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-muted-foreground/40'
                  }`}
                >
                  <span>{section.label}</span>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                      isSelected ? 'border-primary bg-primary' : 'border-border'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            {selected.length} de {DASHBOARD_SECTIONS.length} secciones
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleExport}
              disabled={selected.length === 0 || loading}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {loading ? 'Generando…' : copy.cta}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
