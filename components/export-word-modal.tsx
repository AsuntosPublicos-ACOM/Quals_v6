'use client'

import { useState } from 'react'
import { FileText, Download, FileType } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { exportCongresistToWord, EXPORT_SECTIONS, type ExportSection } from '@/lib/export-word'
import { exportCongresistToPdf } from '@/lib/export-pdf'
import type { Congresista, ProyectoLey } from '@/lib/types'

interface ExportWordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  congresista: Congresista
  projects: ProyectoLey[]
  coautores: Array<{ nombre: string; partido: string; count: number }>
  stats: { proyectosCount: number; leyesAprobadas: number; porcentajeAprobacion: number }
}

type ExportFormat = 'word' | 'pdf'

const FORMAT_OPTIONS: { id: ExportFormat; label: string; ext: string; icon: React.ReactNode }[] = [
  {
    id: 'word',
    label: 'Word (.docx)',
    ext: 'Editable en Microsoft Word',
    icon: <FileText className="h-4 w-4 text-blue-600" />,
  },
  {
    id: 'pdf',
    label: 'PDF (.pdf)',
    ext: 'Listo para compartir e imprimir',
    icon: <FileType className="h-4 w-4 text-red-500" />,
  },
]

export function ExportWordModal({
  open,
  onOpenChange,
  congresista,
  projects,
  coautores,
  stats,
}: ExportWordModalProps) {
  const [format, setFormat] = useState<ExportFormat>('word')
  const [selected, setSelected] = useState<ExportSection[]>(EXPORT_SECTIONS.map(s => s.id))
  const [loading, setLoading] = useState(false)

  function toggle(id: ExportSection) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id],
    )
  }

  async function handleExport() {
    if (selected.length === 0) return
    setLoading(true)
    try {
      if (format === 'word') {
        await exportCongresistToWord(congresista, projects, coautores, stats, selected)
      } else {
        await exportCongresistToPdf(congresista, projects, coautores, stats, selected)
      }
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar perfil
          </DialogTitle>
          <DialogDescription>
            Elige el formato y las secciones que quieres incluir.
          </DialogDescription>
        </DialogHeader>

        {/* Format selector */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Formato</p>
          <div className="grid grid-cols-2 gap-2">
            {FORMAT_OPTIONS.map(f => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-md border text-left transition-colors ${
                  format === f.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/40'
                }`}
              >
                <span className="mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{f.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{f.ext}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Section selector */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Secciones</p>
          <div className="space-y-1.5">
            {EXPORT_SECTIONS.map(section => {
              const isSelected = selected.includes(section.id)
              return (
                <button
                  key={section.id}
                  onClick={() => toggle(section.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-md border text-sm transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border text-muted-foreground hover:border-muted-foreground/40'
                  }`}
                >
                  <span>{section.label}</span>
                  <span
                    className={`h-4 w-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-primary border-primary' : 'border-border'
                    }`}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
                        <path d="M1 4l2.5 3L9 1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {selected.length} de {EXPORT_SECTIONS.length} secciones
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleExport}
              disabled={selected.length === 0 || loading}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              {loading ? 'Generando…' : `Exportar ${format === 'word' ? 'Word' : 'PDF'}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
