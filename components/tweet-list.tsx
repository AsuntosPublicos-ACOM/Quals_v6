'use client'

import { Heart, MessageCircle, Repeat2, Share, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Tweet } from '@/lib/types'
import { formatNumber, formatDate, getInitials } from '@/lib/tweet-utils'

interface TweetListProps {
  tweets: Tweet[]
  highlightWord?: string
  emptyMessage?: string
}

export function TweetList({ 
  tweets, 
  highlightWord, 
  emptyMessage = 'No hay tweets disponibles con los filtros seleccionados' 
}: TweetListProps) {
  const highlightText = (text: string, word?: string) => {
    if (!word) return text

    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    if (!regex.test(text)) return text

    return text.split(regex).map((part, index, arr) => {
      if (index === arr.length - 1) return part
      return (
        <>
          {part}
          <span className="bg-amber-200 dark:bg-amber-900/50 font-semibold">
            {text.match(regex)?.[index]}
          </span>
        </>
      )
    })
  }

  if (tweets.length === 0) {
    return (
      <Card className="col-span-12 lg:col-span-6">
        <CardHeader>
          <CardTitle>Tweets</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground text-center">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  const PARTY_COLORS: Record<string, string> = {
    'Fuerza Nacional': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    'Accion Popular': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    'Peru Libre': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    'Alianza para el Progreso': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'Movimiento Regional': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    'Renovacion Popular': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    'default': 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
  }

  const getPartyColor = (partido: string): string => PARTY_COLORS[partido] || PARTY_COLORS.default

  return (
    <Card className="col-span-12 lg:col-span-6 overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <div>
            <CardTitle className="text-lg">Tweets</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {tweets.length} resultados encontrados
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="space-y-3 h-96 overflow-y-auto pr-2">
          {tweets.map(tweet => (
            <div
              key={tweet.id}
              className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-all duration-200 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-900/50 dark:to-transparent"
            >
              {/* Encabezado: Avatar, nombre, partido, fecha */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                    {getInitials(tweet.autor.nombre)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{tweet.autor.nombre}</span>
                    <Badge variant="outline" className={`text-xs ${getPartyColor(tweet.autor.partido)}`}>
                      {tweet.autor.partido}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(tweet.fecha)}
                    </span>
                  </div>
                  {tweet.autor.cargo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {tweet.autor.cargo}
                    </p>
                  )}
                </div>

                {/* Botón para abrir en Twitter */}
                <a
                  href={tweet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-muted-foreground hover:text-blue-500 transition-colors"
                  title="Abrir en Twitter/X"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Contenido del tweet */}
              <p className="text-sm leading-relaxed mb-3 text-slate-700 dark:text-slate-300">
                {highlightText(tweet.texto, highlightWord)}
              </p>

              {/* Palabras clave (si están disponibles) */}
              {tweet.palabrasClave && tweet.palabrasClave.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tweet.palabrasClave.slice(0, 5).map(palabra => (
                    <Badge key={palabra} variant="secondary" className="text-xs">
                      #{palabra}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Métricas: likes, retweets, respuestas */}
              <div className="flex items-center gap-6 text-xs text-muted-foreground pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
                  <Heart className="h-4 w-4" />
                  <span>{formatNumber(tweet.likes)}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>{formatNumber(tweet.respuestas)}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-green-500 cursor-pointer transition-colors">
                  <Repeat2 className="h-4 w-4" />
                  <span>{formatNumber(tweet.retweets)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
