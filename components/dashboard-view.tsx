'use client'

import { useMemo, useState } from 'react'
import {
  FileText,
  Target,
  Landmark,
  Activity,
  BellRing,
  ArrowUp,
  Minus,
  Info,
  ArrowRight,
  Users,
  Scale,
  TrendingUp,
  Building2,
  Bus,
  Leaf,
  FileDown,
  CalendarDays,
  Filter,
  Clock,
  ArrowLeft,
  ChevronDown,
  Star,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ACTUALIZADO,
  evolucion,
  filtrarProyectos,
  filtrosDef,
  filtrosIniciales,
  kpis,
  nivelesTema,
  proyectosTransversales,
  series,
  temas,
  topCongresistas,
  type Estado,
  type FiltroKey,
  type IconKey,
  type Impacto,
} from '@/lib/dashboard-data'
import {
  ExportDashboardModal,
  type DashboardExportMode,
} from '@/components/export-dashboard-modal'
import { IncidenciaView } from '@/components/incidencia-view'

/* ------------------------------ icon mapping ----------------------------- */

const ICONS: Record<IconKey, LucideIcon> = {
  file: FileText,
  target: Target,
  landmark: Landmark,
  activity: Activity,
  bell: BellRing,
  users: Users,
  scale: Scale,
  trending: TrendingUp,
  building: Building2,
  leaf: Leaf,
  bus: Bus,
}


/* -------------------------------- helpers -------------------------------- */

const impactoTone: Record<Impacto, string> = {
  Alto: 'bg-destructive/10 text-destructive',
  Medio: 'bg-chart-3/15 text-chart-3',
  Bajo: 'bg-success/10 text-success',
}

const estadoTone: Record<Estado, string> = {
  'En dictamen': 'bg-success/10 text-success',
  'En agenda / debate': 'bg-chart-3/15 text-chart-3',
  Presentado: 'bg-info/10 text-info',
}

function Dot({ className }: { className: string }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${className}`} aria-hidden="true" />
}

/* -------------------------------- component ------------------------------ */

type DashboardTab = 'general' | 'incidencia'

interface DashboardViewProps {
  onBack?: () => void
  /** Pestaña activa al abrir el tablero. */
  initialTab?: DashboardTab
}

export function DashboardView({ onBack, initialTab = 'general' }: DashboardViewProps) {
  const [tab, setTab] = useState(initialTab)
  const [exportMode, setExportMode] = useState<DashboardExportMode | null>(null)
  const [filtros, setFiltros] = useState<Record<FiltroKey, string>>(filtrosIniciales)
  const [favoritos, setFavoritos] = useState<string[]>(['PL 6789/2024-CR'])

  const setFiltro = (key: FiltroKey, value: string) =>
    setFiltros((prev) => ({ ...prev, [key]: value }))

  const toggleFavorito = (pl: string) =>
    setFavoritos((prev) => (prev.includes(pl) ? prev.filter((p) => p !== pl) : [...prev, pl]))

  const hayFiltrosActivos = filtrosDef.some((f) => filtros[f.key] !== f.all)

  const proyectosVisibles = useMemo(
    () => filtrarProyectos(proyectosTransversales, filtros),
    [filtros],
  )

  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-4">
      {/* Title + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Vista general</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportMode('ppt')}>
            <FileDown className="h-4 w-4" />
            Exportar PPT
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportMode('reporte')}>
            <CalendarDays className="h-4 w-4" />
            Reporte semanal
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as DashboardTab)}>
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="incidencia">Incidencia parlamentaria</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'incidencia' ? (
        <IncidenciaView />
      ) : (
        <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filtrosDef.map((f) => {
          const active = filtros[f.key] !== f.all
          return (
            <DropdownMenu key={f.key}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? 'border-info bg-info/5 text-foreground'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium text-foreground">{filtros[f.key]}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-44">
                {f.key !== 'fecha' && (
                  <DropdownMenuItem onSelect={() => setFiltro(f.key, f.all)}>{f.all}</DropdownMenuItem>
                )}
                {f.options.map((opt) => (
                  <DropdownMenuItem key={opt} onSelect={() => setFiltro(f.key, opt)}>
                    {opt}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
        <button
          onClick={() => setFiltros(filtrosIniciales)}
          disabled={!hayFiltrosActivos}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          Limpiar filtros
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const KpiIcon = ICONS[kpi.iconKey]
          return (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-2.5 p-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${kpi.tone}`}>
                <KpiIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-tight text-muted-foreground text-pretty">{kpi.label}</p>
                <p className="text-xl font-bold leading-tight tracking-tight text-foreground">{kpi.value}</p>
                <p className="flex flex-wrap items-center gap-x-1 text-[10px] leading-tight text-muted-foreground">
                  {kpi.trend === 'up' ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-success" />
                      <span className="font-semibold text-success">{kpi.delta}</span>
                      vs. semana anterior
                    </>
                  ) : (
                    <>
                      <Minus className="h-3 w-3" />
                      {kpi.delta}
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>

      {/* Temas + chart */}
      <div className="grid grid-cols-[1.35fr_1fr] gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              Temas transversales prioritarios
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {temas.map((tema) => {
                const TemaIcon = ICONS[tema.iconKey]
                return (
                <div key={tema.name} className="flex flex-col rounded-lg border border-border p-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tema.tone}`}>
                      <TemaIcon className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs font-semibold leading-tight text-foreground text-pretty">{tema.name}</p>
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <p className="text-xl font-bold leading-none tracking-tight text-foreground">{tema.total}</p>
                    <p className="text-[10px] text-muted-foreground">PL en total</p>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-border pt-2">
                    {nivelesTema.map((nivel) => {
                      const count = tema[nivel.key]
                      return (
                        <p key={nivel.key} className="flex items-center gap-1 text-[10px] text-foreground">
                          <Dot className={nivel.dot} />
                          <span className="font-semibold">{count}</span>
                          <span className="whitespace-nowrap text-muted-foreground">
                            {count === 1 ? nivel.singular : nivel.plural}
                          </span>
                        </p>
                      )
                    })}
                  </div>
                </div>
                )
              })}
            </div>
            <div className="mt-2.5 flex justify-end">
              <button className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline">
                Ver todas las temáticas <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Evolución del avance de la agenda legislativa
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="mb-2 text-[11px] text-muted-foreground">Comparación semanal de proyectos por etapa</p>
            <div className="h-[196px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucion} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="semana"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={36}
                    tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingBottom: 12 }}
                  />
                  {series.map((s) => (
                    <Line
                      key={s.key}
                      type="linear"
                      dataKey={s.key}
                      name={s.label}
                      stroke={s.color}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 0, fill: s.color }}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Cada línea muestra cómo evoluciona semanalmente la cantidad de PL en cada etapa.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla + top congresistas */}
      <div className="grid grid-cols-[1.35fr_1fr] gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
                Proyectos de ley con afectación transversal
                <Info className="h-4 w-4 text-muted-foreground" />
              </h2>
              <button className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-info hover:underline">
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="w-7 py-1.5 font-medium">
                    <span className="sr-only">Favorito</span>
                  </th>
                  <th className="py-1.5 pr-2 font-medium">Proyecto de ley</th>
                  <th className="py-1.5 pr-2 font-medium">Tema</th>
                  <th className="py-1.5 pr-2 font-medium">Impacto</th>
                  <th className="py-1.5 pr-2 font-medium">Estado actual</th>
                  <th className="py-1.5 pr-2 font-medium">Último cambio</th>
                  <th className="py-1.5 font-medium">Por qué importa</th>
                </tr>
              </thead>
              <tbody>
                {proyectosVisibles.map((p) => {
                  const isFav = favoritos.includes(p.pl)
                  return (
                    <tr key={p.pl} className="border-b border-border last:border-0 align-top">
                      <td className="py-2 align-middle">
                        <button
                          onClick={() => toggleFavorito(p.pl)}
                          aria-pressed={isFav}
                          aria-label={
                            isFav
                              ? `Quitar ${p.pl} de favoritos`
                              : `Marcar ${p.pl} como favorito`
                          }
                          className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-muted"
                        >
                          <Star
                            className={`h-3.5 w-3.5 ${
                              isFav ? 'fill-chart-3 text-chart-3' : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-2 pr-2 font-medium text-foreground whitespace-nowrap">{p.pl}</td>
                      <td className="py-2 pr-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${p.temaTone}`}>{p.tema}</span>
                      </td>
                      <td className="py-2 pr-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${impactoTone[p.impacto]}`}>
                          {p.impacto}
                        </span>
                      </td>
                      <td className="py-2 pr-2">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${estadoTone[p.estado]}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-2 pr-2 text-muted-foreground whitespace-nowrap">{p.cambio}</td>
                      <td className="py-2 text-muted-foreground">{p.motivo}</td>
                    </tr>
                  )
                })}
                {proyectosVisibles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      Ningún proyecto coincide con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
                Top congresistas (vista previa)
                <Info className="h-4 w-4 text-muted-foreground" />
              </h2>
              <button className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-info hover:underline">
                Ver incidencia <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="divide-y divide-border">
              {topCongresistas.map((c, i) => (
                <li key={c.nombre} className="flex items-center gap-2.5 py-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                      i === 0
                        ? 'bg-chart-3 text-primary-foreground'
                        : i < 3
                          ? 'bg-chart-3/25 text-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{c.nombre}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{c.bancada}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold text-foreground">{c.pl}</span>{' '}
                    <span className="text-[10px] text-muted-foreground">PL relevantes</span>
                  </div>
                  <div className="w-32 shrink-0 text-right">
                    <p className="text-[10px] text-muted-foreground">Tema principal</p>
                    <p className={`truncate text-xs font-semibold ${c.temaColor}`}>{c.tema}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer note */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Actualizado: {ACTUALIZADO}
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Los niveles de impacto y probabilidad se calculan en base a votaciones, participación y señales públicas.
        </span>
      </div>
        </>
      )}
      </div>

      {exportMode && (
        <ExportDashboardModal
          open
          mode={exportMode}
          onOpenChange={(open) => {
            if (!open) setExportMode(null)
          }}
        />
      )}
    </div>
  )
}
