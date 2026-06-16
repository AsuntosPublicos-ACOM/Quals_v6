'use client'

import { useMemo } from 'react'
import { FileText, Users, Layers, BookOpen, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { proyectos, sectores, congresistas } from '@/lib/data'
import type { ProyectoLey, Congresista, Sector } from '@/lib/types'

const resoluciones = [
  { fecha: '2024-03-15', codigo: 'RS-001-2024-PCM',     institucion: 'PCM',     tipoResolucion: 'Resolución Suprema',        medida: 'Aprueban lineamientos para la implementación del gobierno digital en entidades públicas' },
  { fecha: '2024-03-14', codigo: 'RD-045-2024-MEF',     institucion: 'MEF',     tipoResolucion: 'Resolución Directoral',     medida: 'Establecen disposiciones para la ejecución presupuestal del ejercicio fiscal 2024' },
  { fecha: '2024-03-13', codigo: 'RM-089-2024-MINSA',   institucion: 'MINSA',   tipoResolucion: 'Resolución Ministerial',    medida: 'Aprueban protocolo de atención para enfermedades respiratorias en temporada de invierno' },
  { fecha: '2024-03-12', codigo: 'RVM-023-2024-MINEDU', institucion: 'MINEDU',  tipoResolucion: 'Resolución Viceministerial',medida: 'Modifican cronograma del año escolar 2024 para instituciones educativas públicas' },
  { fecha: '2024-03-11', codigo: 'RS-002-2024-MTPE',    institucion: 'MTPE',    tipoResolucion: 'Resolución Suprema',        medida: 'Aprueban reglamento de la Ley de Teletrabajo para el sector privado' },
  { fecha: '2024-03-10', codigo: 'RD-078-2024-PRODUCE', institucion: 'PRODUCE', tipoResolucion: 'Resolución Directoral',     medida: 'Establecen vedas temporales para especies marinas en la zona norte del país' },
]

const designaciones = [
  { fecha: '2024-03-15', codigo: 'RD-001-2024-PCM',    institucion: 'PCM',     cargo: 'Secretario General',  medida: 'Designan Secretario General de la Presidencia del Consejo de Ministros' },
  { fecha: '2024-03-14', codigo: 'RM-012-2024-MEF',    institucion: 'MEF',     cargo: 'Director General',    medida: 'Designan Director General de Presupuesto Público del MEF' },
  { fecha: '2024-03-13', codigo: 'RD-034-2024-MINSA',  institucion: 'MINSA',   cargo: 'Director Ejecutivo',  medida: 'Designan Director Ejecutivo de la Dirección de Medicamentos, Insumos y Drogas' },
  { fecha: '2024-03-12', codigo: 'RM-067-2024-MINEDU', institucion: 'MINEDU',  cargo: 'Directora de Área',   medida: 'Designan Directora de la Dirección de Educación Básica Regular' },
  { fecha: '2024-03-11', codigo: 'RD-089-2024-MTPE',   institucion: 'MTPE',    cargo: 'Superintendente',     medida: 'Designan Superintendente de SUNAFIL' },
  { fecha: '2024-03-10', codigo: 'RM-045-2024-MIDIS',  institucion: 'MIDIS',   cargo: 'Coordinador Nacional',medida: 'Designan Coordinador Nacional del Programa Qali Warma' },
]

interface SearchResultsProps {
  query: string
  onClear: () => void
  onViewProject: (p: ProyectoLey) => void
  onViewCongresista: (c: Congresista) => void
  onViewSector: (sectorId: string) => void
  onViewElPeruano: () => void
}

export function SearchResults({ query, onClear, onViewProject, onViewCongresista, onViewSector, onViewElPeruano }: SearchResultsProps) {
  const q = query.toLowerCase().trim()

  const matchedProyectos = useMemo(() =>
    proyectos.filter(p =>
      p.numero.toLowerCase().includes(q) ||
      p.titulo.toLowerCase().includes(q) ||
      p.sumilla.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 8),
  [q])

  const matchedCongresistas = useMemo(() =>
    congresistas.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.partido.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    ).slice(0, 6),
  [q])

  const matchedSectores = useMemo(() =>
    sectores.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    ),
  [q])

  const matchedResoluciones = useMemo(() =>
    resoluciones.filter(r =>
      r.codigo.toLowerCase().includes(q) ||
      r.institucion.toLowerCase().includes(q) ||
      r.medida.toLowerCase().includes(q) ||
      r.tipoResolucion.toLowerCase().includes(q)
    ).slice(0, 5),
  [q])

  const matchedDesignaciones = useMemo(() =>
    designaciones.filter(d =>
      d.codigo.toLowerCase().includes(q) ||
      d.institucion.toLowerCase().includes(q) ||
      d.medida.toLowerCase().includes(q) ||
      d.cargo.toLowerCase().includes(q)
    ).slice(0, 5),
  [q])

  const total = matchedProyectos.length + matchedCongresistas.length + matchedSectores.length + matchedResoluciones.length + matchedDesignaciones.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Resultados para <span className="text-primary">&quot;{query}&quot;</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
          <X className="h-4 w-4" />
          Limpiar búsqueda
        </Button>
      </div>

      {total === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No se encontraron resultados para &quot;{query}&quot;</p>
            <p className="text-sm text-muted-foreground mt-1">Intenta con otros términos de búsqueda</p>
          </CardContent>
        </Card>
      )}

      {/* Proyectos de Ley */}
      {matchedProyectos.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Proyectos de Ley
              <Badge variant="secondary" className="ml-auto">{matchedProyectos.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {matchedProyectos.map(p => (
                <button
                  key={p.id}
                  onClick={() => onViewProject(p)}
                  className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-muted-foreground mt-0.5 shrink-0">{p.numero}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{p.titulo}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.sumilla}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 ml-auto">{p.estado}</Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Congresistas */}
      {matchedCongresistas.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Congresistas
              <Badge variant="secondary" className="ml-auto">{matchedCongresistas.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {matchedCongresistas.map(c => (
                <button
                  key={c.id}
                  onClick={() => onViewCongresista(c)}
                  className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{c.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground">{c.partido} · {c.region}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sectores */}
      {matchedSectores.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Sectores
              <Badge variant="secondary" className="ml-auto">{matchedSectores.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {matchedSectores.map(s => (
                <button
                  key={s.id}
                  onClick={() => onViewSector(s.id)}
                  className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* El Peruano */}
      {(matchedResoluciones.length > 0 || matchedDesignaciones.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              El Peruano
              <Badge variant="secondary" className="ml-auto">{matchedResoluciones.length + matchedDesignaciones.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {matchedResoluciones.map(r => (
                <button
                  key={r.codigo}
                  onClick={onViewElPeruano}
                  className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-muted-foreground mt-0.5 shrink-0">{r.codigo}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{r.medida}</p>
                      <p className="text-xs text-muted-foreground">{r.tipoResolucion} · {r.institucion}</p>
                    </div>
                  </div>
                </button>
              ))}
              {matchedDesignaciones.map(d => (
                <button
                  key={d.codigo}
                  onClick={onViewElPeruano}
                  className="w-full text-left px-6 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs text-muted-foreground mt-0.5 shrink-0">{d.codigo}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{d.medida}</p>
                      <p className="text-xs text-muted-foreground">Designación · {d.cargo} · {d.institucion}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
