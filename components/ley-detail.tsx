'use client'

import { ArrowLeft, Calendar, Users, Building2, FileText, ExternalLink, Tag, Scale, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { sectores } from '@/lib/data'
import type { LeyAprobada } from '@/lib/types'

interface LeyDetailProps {
  ley: LeyAprobada
  onBack: () => void
}

export function LeyDetail({ ley, onBack }: LeyDetailProps) {
  const sector = sectores.find(s => s.id === ley.sectorId)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-PE', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getVigenciaColor = (vigencia: string): string => {
    const colors: Record<string, string> = {
      'En vigor': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      'Pendiente reglamentación': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
      'Con modificaciones': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'Derogada': 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300',
    }
    return colors[vigencia] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }

  const getImpactoColor = (impacto?: string): string => {
    const colors: Record<string, string> = {
      'Alto': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
      'Medio': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
      'Bajo': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    }
    return impacto ? colors[impacto] || '' : ''
  }

  const getVigenciaIcon = (vigencia: string) => {
    switch (vigencia) {
      case 'En vigor':
        return <CheckCircle className="h-4 w-4" />
      case 'Pendiente reglamentación':
        return <Clock className="h-4 w-4" />
      case 'Derogada':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Scale className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 mt-1">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-sm font-semibold">
              {ley.numeroLey}
            </Badge>
            <Badge className={getVigenciaColor(ley.vigencia)}>
              <span className="flex items-center gap-1.5">
                {getVigenciaIcon(ley.vigencia)}
                {ley.vigencia}
              </span>
            </Badge>
            {ley.impacto && (
              <Badge className={getImpactoColor(ley.impacto)}>
                Impacto {ley.impacto}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">{ley.titulo}</h1>
          <p className="text-muted-foreground">{ley.sumilla}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Fecha de publicación</span>
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(ley.fechaPublicacion)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Fecha de aprobación</span>
            </div>
            <p className="text-sm font-medium text-foreground">{formatDate(ley.fechaAprobacion)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs">Sector</span>
            </div>
            <p className="text-sm font-medium text-foreground">{sector?.name || ley.sectorId}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 px-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Comisión dictaminadora</span>
            </div>
            <p className="text-sm font-medium text-foreground line-clamp-2">{ley.comisionDictaminadora}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen */}
          {ley.resumen && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{ley.resumen}</p>
              </CardContent>
            </Card>
          )}

          {/* Texto completo */}
          {ley.textoCompleto && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contenido de la ley</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line bg-muted/30 p-4 rounded-lg border border-border">
                  {ley.textoCompleto}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Proyecto de origen */}
          {ley.proyectoOrigenNumero && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Proyecto de ley de origen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{ley.proyectoOrigenNumero}</p>
                      <p className="text-xs text-muted-foreground">Proyecto de ley original</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver proyecto
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {ley.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Temas relacionados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ley.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Autores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Autores ({ley.autores.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ley.autorPrincipal && (
                <div className="pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Autor principal</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={ley.autorPrincipal.foto} alt={ley.autorPrincipal.nombre} />
                      <AvatarFallback className="text-xs">
                        {ley.autorPrincipal.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{ley.autorPrincipal.nombre}</p>
                      <p className="text-xs text-muted-foreground">{ley.autorPrincipal.partido}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {ley.autores.filter(a => a.id !== ley.autorPrincipal?.id).length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Coautores</p>
                  <div className="space-y-2">
                    {ley.autores.filter(a => a.id !== ley.autorPrincipal?.id).map((autor) => (
                      <div key={autor.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={autor.foto} alt={autor.nombre} />
                          <AvatarFallback className="text-xs">
                            {autor.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{autor.nombre}</p>
                          <p className="text-xs text-muted-foreground">{autor.partido}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fechas importantes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Cronología
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Aprobación</p>
                    <p className="text-sm font-medium">{formatDate(ley.fechaAprobacion)}</p>
                  </div>
                </div>
                {ley.fechaPromulgacion && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Promulgación</p>
                      <p className="text-sm font-medium">{formatDate(ley.fechaPromulgacion)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Publicación</p>
                    <p className="text-sm font-medium">{formatDate(ley.fechaPublicacion)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enlace El Peruano */}
          {ley.enlaceElPeruano && (
            <Card>
              <CardContent className="pt-4">
                <a
                  href={ley.enlaceElPeruano}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ver en El Peruano
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
