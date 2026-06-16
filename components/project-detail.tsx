'use client'

import { ArrowLeft, Star, Calendar, Clock, Users, FileText, Building2, Tag, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { ProyectoLey } from '@/lib/types'
import { sectores } from '@/lib/data'

interface ProjectDetailProps {
  proyecto: ProyectoLey
  isFavorite: boolean
  onToggleFavorite: () => void
  onBack: () => void
}

const estadoStyles: Record<string, string> = {
  'En Comisión': 'bg-info/10 text-info border-info/20',
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

export function ProjectDetail({ proyecto, isFavorite, onToggleFavorite, onBack }: ProjectDetailProps) {
  const sector = sectores.find(s => s.id === proyecto.sectorId)
  
  // Mock firmantes si no existen
  const mockFirmantes = [
    { id: 'f1', nombre: 'Carlos Mendoza López', partido: 'Fuerza Nacional', region: 'Lima' },
    { id: 'f2', nombre: 'Ana Rojas García', partido: 'Accion Popular', region: 'Arequipa' },
    { id: 'f3', nombre: 'José Martínez Flores', partido: 'Alianza para el Progreso', region: 'Trujillo' },
    { id: 'f4', nombre: 'María Fernández Soto', partido: 'Peru Libre', region: 'Cusco' },
    { id: 'f5', nombre: 'Ricardo Huamán Quispe', partido: 'Movimiento Regional', region: 'Puno' },
    { id: 'f6', nombre: 'Patricia Salazar Mendez', partido: 'Accion Popular', region: 'Ica' },
    { id: 'f7', nombre: 'Luis Castillo Rivas', partido: 'Fuerza Nacional', region: 'Piura' },
    { id: 'f8', nombre: 'Gabriela Montoya Torres', partido: 'Renovacion Popular', region: 'Junín' },
  ]
  
  const firmantesDisplay = proyecto.firmantes || mockFirmantes
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const timeline = [
    { date: proyecto.fechaPresentacion, event: 'Proyecto presentado', status: 'completed' },
    { date: proyecto.ultimaActualizacion, event: 'Derivado a comision', status: 'completed' },
    { date: proyecto.ultimaActualizacion, event: proyecto.estado, status: 'current' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={onToggleFavorite}
            className="gap-2"
          >
            <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-muted-foreground">{proyecto.numero}</span>
                <Badge variant="outline" className={estadoStyles[proyecto.estado]}>
                  {proyecto.estado}
                </Badge>
                <Badge className={prioridadStyles[proyecto.prioridad]}>
                  Prioridad {proyecto.prioridad}
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">{proyecto.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Sumilla oficial</h4>
                <p className="text-muted-foreground leading-relaxed">{proyecto.sumilla}</p>
              </div>

              {proyecto.resumen && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Resumen del PL</h4>
                  <p className="text-muted-foreground leading-relaxed">{proyecto.resumen}</p>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Calendar className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de presentacion</p>
                    <p className="font-medium capitalize">{formatDate(proyecto.fechaPresentacion)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Clock className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ultima actualizacion</p>
                    <p className="font-medium capitalize">{formatDate(proyecto.ultimaActualizacion)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Building2 className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comisión</p>
                    <p className="font-medium">{proyecto.comision}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <FileText className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sector</p>
                    <p className="font-medium">{sector?.name || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-foreground">Etiquetas</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(proyecto.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                  {(!proyecto.tags || proyecto.tags.length === 0) && (
                    <p className="text-sm text-muted-foreground">No hay etiquetas</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Linea de tiempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        item.status === 'current' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      {index < timeline.length - 1 && (
                        <div className="absolute top-3 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="font-medium text-foreground">{item.event}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Autor Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Autor Principal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {(proyecto.autorPrincipal || proyecto.autores[0]) && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {(proyecto.autorPrincipal || proyecto.autores[0]).nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{(proyecto.autorPrincipal || proyecto.autores[0]).nombre}</p>
                    <p className="text-sm text-muted-foreground">{(proyecto.autorPrincipal || proyecto.autores[0]).partido}</p>
                    <p className="text-xs text-muted-foreground">{(proyecto.autorPrincipal || proyecto.autores[0]).region}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información oficial */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información oficial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Accede a la información completa de este proyecto en la web del Congreso de la República.</p>
              <Button 
                asChild
                className="w-full justify-start gap-2"
              >
                <a 
                  href={`https://www2.congreso.gob.pe/busca-de-proyectos-de-ley?p=${proyecto.numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver en web del Congreso
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Firmantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Firmantes ({firmantesDisplay.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {firmantesDisplay && firmantesDisplay.length > 0 ? (
                <div className="space-y-2">
                  {firmantesDisplay.map((firmante) => (
                    <div key={firmante.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-secondary-foreground/20 text-secondary-foreground text-xs font-semibold">
                          {firmante.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate text-sm">{firmante.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{firmante.partido}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay firmantes registrados</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
