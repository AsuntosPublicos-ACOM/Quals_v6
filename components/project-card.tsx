'use client'

import { Star, Calendar, Users, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { ProyectoLey } from '@/lib/types'

interface ProjectCardProps {
  proyecto: ProyectoLey
  isFavorite: boolean
  onToggleFavorite: () => void
  onViewDetail: () => void
}

const estadoStyles: Record<string, string> = {
  'En Comision': 'bg-info/10 text-info border-info/20',
  'En Pleno': 'bg-warning/10 text-warning-foreground border-warning/20',
  'Aprobado': 'bg-success/10 text-success border-success/20',
  'Archivado': 'bg-muted text-muted-foreground border-muted',
  'Observado': 'bg-destructive/10 text-destructive border-destructive/20',
  'Publicado': 'bg-accent/10 text-accent border-accent/20',
}

const prioridadStyles: Record<string, string> = {
  'Alta': 'bg-destructive text-destructive-foreground',
  'Media': 'bg-warning text-warning-foreground',
  'Baja': 'bg-muted text-muted-foreground',
}

export function ProjectCard({ proyecto, isFavorite, onToggleFavorite, onViewDetail }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Card className="group transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-mono text-muted-foreground">{proyecto.numero}</span>
              <Badge variant="outline" className={estadoStyles[proyecto.estado]}>
                {proyecto.estado}
              </Badge>
              <Badge className={prioridadStyles[proyecto.prioridad]}>
                {proyecto.prioridad}
              </Badge>
            </div>
            
            <h3 className="mt-2 font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {proyecto.titulo}
            </h3>
            
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {proyecto.sumilla}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(proyecto.fechaPresentacion)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Actualizado {formatDate(proyecto.ultimaActualizacion)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {proyecto.autores.slice(0, 3).map((autor) => (
                <Avatar key={autor.id} className="h-7 w-7 border-2 border-card">
                  <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                    {autor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {proyecto.autores.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{proyecto.autores.length - 3}
              </span>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary"
            onClick={onViewDetail}
          >
            Ver detalle
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {proyecto.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
