'use client'

import { 
  TrendingUp, TrendingDown, Minus, Heart, GraduationCap, Zap, Truck, Scale, 
  Briefcase, Leaf, ChevronRight, Shield, Building2, TreePine, Palette, 
  Home, Users, Globe, Star
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Sector, NivelActividad } from '@/lib/types'
import { getActivityLevel } from '@/lib/data'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Heart,
  GraduationCap,
  Zap,
  Truck,
  Scale,
  Briefcase,
  Leaf,
  Shield,
  Building2,
  TreePine,
  Palette,
  Home,
  Users,
  Globe,
}

const activityColors: Record<NivelActividad, { bg: string; border: string; badge: string; text: string }> = {
  critico: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-500',
    text: 'text-red-700 dark:text-red-400'
  },
  alto: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-500',
    text: 'text-orange-700 dark:text-orange-400'
  },
  moderado: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    border: 'border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400'
  },
  bajo: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400'
  }
}

const activityLabels: Record<NivelActividad, string> = {
  critico: 'Critico',
  alto: 'Alto',
  moderado: 'Moderado',
  bajo: 'Bajo'
}

interface SectorCardProps {
  sector: Sector
  selectedMonth: string
  previousMonth: string | null
  onClick: () => void
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export function SectorCard({ sector, selectedMonth, previousMonth, onClick, isFavorite = false, onToggleFavorite }: SectorCardProps) {
  const IconComponent = iconMap[sector.icon] || TrendingUp
  
  // Get project count for selected month
  const currentMonthData = sector.monthlyData.find(d => d.month === selectedMonth)
  const currentCount = currentMonthData?.projectCount || 0
  
  // Get project count for previous month
  const previousMonthData = previousMonth 
    ? sector.monthlyData.find(d => d.month === previousMonth)
    : null
  const previousCount = previousMonthData?.projectCount || 0
  
  // Calculate trend
  const trend = previousMonth ? currentCount - previousCount : 0
  const trendPercentage = previousCount > 0 
    ? Math.round((trend / previousCount) * 100) 
    : (currentCount > 0 ? 100 : 0)
  
  // Get activity level and colors
  const activityLevel = getActivityLevel(currentCount)
  const colors = activityColors[activityLevel]

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        colors.bg,
        colors.border
      )}
      onClick={onClick}
    >
      <CardContent className="px-2.5 py-2">
        {/* Row 1: icon + name + star + level badge */}
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white",
            colors.badge
          )}>
            <IconComponent className="h-3.5 w-3.5" />
          </div>
          <p className="flex-1 text-[11px] font-semibold text-foreground leading-tight line-clamp-2 min-w-0">
            {sector.name}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.() }}
            className="shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
            title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Star className={cn("h-3 w-3", isFavorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
          </button>
          <span className={cn(
            "shrink-0 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full text-white",
            colors.badge
          )}>
            {activityLabels[activityLevel]}
          </span>
        </div>

        {/* Row 2: project count (large) + trend % */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className={cn("text-base font-bold leading-none", colors.text)}>
            {currentCount}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">proy.</span>
          {previousMonth && (
            <div className={cn(
              "ml-auto flex shrink-0 items-center gap-0.5 text-[10px] font-semibold",
              trend > 0 ? "text-red-600 dark:text-red-400" :
              trend < 0 ? "text-emerald-600 dark:text-emerald-400" :
              "text-muted-foreground"
            )}>
              {trend > 0 ? <TrendingUp className="h-2.5 w-2.5" /> :
               trend < 0 ? <TrendingDown className="h-2.5 w-2.5" /> :
               <Minus className="h-2.5 w-2.5" />}
              <span>{trend > 0 ? `+${trendPercentage}` : trendPercentage}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
