'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { HitoClave } from '@/lib/types'
import { ChevronDown } from 'lucide-react'

interface HitosClaveCardProps {
  hitos: HitoClave[] | undefined
}

const INITIAL_VISIBLE = 3
const TIPO_BADGES: Record<string, { bg: string; text: string }> = {
  votacion: { bg: 'bg-blue-100', text: 'text-blue-800' },
  investigacion: { bg: 'bg-red-100', text: 'text-red-800' },
  entrevista: { bg: 'bg-purple-100', text: 'text-purple-800' },
  evento: { bg: 'bg-green-100', text: 'text-green-800' },
  otro: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    votacion: 'Votación',
    investigacion: 'Investigación',
    entrevista: 'Entrevista',
    evento: 'Evento',
    otro: 'Otro',
  }
  return labels[tipo] || tipo
}

export function HitosClaveCard({ hitos }: HitosClaveCardProps) {
  const [expanded, setExpanded] = useState(false)

  if (!hitos || hitos.length === 0) {
    return null
  }

  // Ordenar por fecha más nueva a más antigua
  const sortedHitos = [...hitos].sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  const visibleHitos = expanded ? sortedHitos : sortedHitos.slice(0, INITIAL_VISIBLE)
  const hasMore = sortedHitos.length > INITIAL_VISIBLE

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hitos clave</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleHitos.map((hito) => (
            <div key={hito.id} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                {/* Vertical line connector */}
                <div className="h-12 w-px bg-border" />
              </div>
              <div className="flex-1 pb-3 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground leading-snug flex-1">
                    {hito.descripcion}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`${TIPO_BADGES[hito.tipo]?.bg} ${TIPO_BADGES[hito.tipo]?.text} whitespace-nowrap text-xs`}
                  >
                    {getTipoLabel(hito.tipo)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(hito.fecha)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4"
          >
            <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded ? 'Mostrar menos' : `Ver ${sortedHitos.length - INITIAL_VISIBLE} más`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
