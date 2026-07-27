'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface ProcessTimelineProps {
  phases: {
    id: string
    label: string
    count: number
  }[]
  title?: string
  description?: string
}

export function ProcessTimeline({ phases, title = 'Fases del proceso legislativo', description }: ProcessTimelineProps) {
  const totalProjects = phases.reduce((sum, phase) => sum + phase.count, 0)
  
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timeline visual */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {phases.map((phase, index) => (
              <div key={phase.id} className="flex items-center gap-2 min-w-max">
                {/* Phase node */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex-col">
                    <p className="text-2xl font-bold text-primary">{phase.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {((phase.count / totalProjects) * 100).toFixed(0)}%
                    </p>
                  </div>
                  <p className="text-xs font-medium text-foreground text-center max-w-[100px] leading-tight">
                    {phase.label}
                  </p>
                </div>

                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-6 bg-gradient-to-r from-primary/50 to-primary/20"></div>
                    <ChevronRight className="h-4 w-4 text-primary/50" />
                    <div className="h-0.5 w-6 bg-gradient-to-r from-primary/20 to-primary/50"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="pt-4 border-t border-border/50">
            <div className="grid grid-cols-4 gap-3">
              {phases.map((phase) => (
                <div key={phase.id} className="text-center p-2">
                  <p className="text-xs text-muted-foreground mb-1">{phase.label}</p>
                  <p className="text-lg font-bold text-foreground">{phase.count}</p>
                  <p className="text-xs text-muted-foreground">
                    {((phase.count / totalProjects) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total info */}
          <div className="text-center pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Total de proyectos: <span className="font-semibold text-foreground">{totalProjects}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
