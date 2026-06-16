'use client'

import { useState } from 'react'
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Alert {
  id: string
  type: 'estado-cambio' | 'nuevo-proyecto' | 'congresista-actividad'
  title: string
  description: string
  timestamp: string
  read: boolean
  relatedId?: string
}

const alertsData: Alert[] = [
  {
    id: '1',
    type: 'estado-cambio',
    title: 'Cambio de estado en PL favorito',
    description: 'Proyecto de Ley "Reforma tributaria 2024" cambió de estado a: En comisión',
    timestamp: 'Hace 2 horas',
    read: false,
    relatedId: '1'
  },
  {
    id: '2',
    type: 'estado-cambio',
    title: 'Cambio de estado en PL favorito',
    description: 'Proyecto de Ley "Fortalecimiento del sistema sanitario" cambió de estado a: Dictaminado',
    timestamp: 'Hace 5 horas',
    read: false,
    relatedId: '2'
  },
  {
    id: '3',
    type: 'nuevo-proyecto',
    title: 'Nuevo proyecto de ley presentado',
    description: 'Se presentó nuevo PL sobre incentivos de energía renovable en tu sector de interés',
    timestamp: 'Ayer',
    read: true,
    relatedId: '4'
  },
  {
    id: '4',
    type: 'congresista-actividad',
    title: 'Actividad de congresista',
    description: 'Congresista Juan Pérez presentó un nuevo proyecto de ley',
    timestamp: 'Ayer',
    read: true
  },
  {
    id: '5',
    type: 'estado-cambio',
    title: 'Cambio de estado en PL favorito',
    description: 'Proyecto de Ley "Protección del medio ambiente" pasó a: Aprobado',
    timestamp: 'Hace 3 días',
    read: true,
    relatedId: '12'
  }
]

interface AlertsViewProps {
  onBack: () => void
}

export function AlertsView({ onBack }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>(alertsData)

  const toggleRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: !a.read } : a))
  }

  const unreadCount = alerts.filter(a => !a.read).length
  const readAll = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'estado-cambio':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'nuevo-proyecto':
        return <Clock className="h-5 w-5 text-green-500" />
      case 'congresista-actividad':
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'estado-cambio':
        return 'bg-blue-50'
      case 'nuevo-proyecto':
        return 'bg-green-50'
      case 'congresista-actividad':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-2">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={readAll}>
            Marcar todo como leído
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <div className="mx-auto max-w-2xl space-y-3 p-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No hay alertas</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`cursor-pointer transition-all ${
                !alert.read ? getAlertColor(alert.type) : 'bg-background'
              } ${!alert.read ? 'border-primary/20 shadow-sm' : ''}`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${alert.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {alert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!alert.read && (
                    <button
                      onClick={() => toggleRead(alert.id)}
                      className="p-2 hover:bg-black/5 rounded transition-colors"
                      title="Marcar como leído"
                    >
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
