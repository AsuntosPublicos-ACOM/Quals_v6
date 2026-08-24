'use client'

import { useEffect, useRef, useState } from 'react'
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
  Bookmark,
  Filter,
  Clock,
  ArrowLeft,
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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

/* ---------------------------------- data --------------------------------- */

const kpis = [
  {
    label: 'PL activos',
    value: '142',
    icon: FileText,
    tone: 'text-destructive bg-destructive/10',
    delta: '12',
    trend: 'up' as const,
  },
  {
    label: 'Alto impacto o alto prob.',
    value: '24',
    icon: Target,
    tone: 'text-chart-3 bg-chart-3/10',
    delta: '5',
    trend: 'up' as const,
  },
  {
    label: 'Comisiones críticas',
    value: '6',
    icon: Landmark,
    tone: 'text-chart-5 bg-chart-5/10',
    delta: 'sin cambio',
    trend: 'flat' as const,
  },
  {
    label: 'Con movimiento esta semana',
    value: '38',
    icon: Activity,
    tone: 'text-info bg-info/10',
    delta: '9',
    trend: 'up' as const,
  },
  {
    label: 'Alertas',
    value: '12',
    icon: BellRing,
    tone: 'text-chart-3 bg-chart-3/10',
    delta: '2',
    trend: 'up' as const,
  },
]

const temas = [
  { name: 'Laboral', total: 24, icon: Users, tone: 'bg-destructive/10 text-destructive', criticos: 4, altos: 10, medios: 10, bajos: 0 },
  { name: 'Tributario', total: 19, icon: Scale, tone: 'bg-destructive/10 text-destructive', criticos: 4, altos: 4, medios: 9, bajos: 2 },
  { name: 'Competitividad', total: 16, icon: TrendingUp, tone: 'bg-info/10 text-info', criticos: 2, altos: 7, medios: 5, bajos: 2 },
  { name: 'Infraestructura', total: 14, icon: Building2, tone: 'bg-success/10 text-success', criticos: 1, altos: 4, medios: 5, bajos: 2 },
  { name: 'Ambiente de negocios', total: 12, icon: Leaf, tone: 'bg-success/10 text-success', criticos: 1, altos: 4, medios: 5, bajos: 2 },
  { name: 'Transporte / Energía', total: 10, icon: Bus, tone: 'bg-info/10 text-info', criticos: 1, altos: 3, medios: 5, bajos: 2 },
]

const nivelesTema = [
  { key: 'criticos', singular: 'Crítico', plural: 'Críticos', dot: 'bg-destructive' },
  { key: 'altos', singular: 'Alto', plural: 'Altos', dot: 'bg-chart-2' },
  { key: 'medios', singular: 'Medio', plural: 'Medios', dot: 'bg-chart-3' },
  { key: 'bajos', singular: 'Bajo', plural: 'Bajos', dot: 'bg-success' },
] as const

const evolucion = [
  { semana: '20 abr', presentados: 94, dictamen: 29, agenda: 13, leyes: 3 },
  { semana: '27 abr', presentados: 107, dictamen: 31, agenda: 15, leyes: 4 },
  { semana: '04 may', presentados: 116, dictamen: 33, agenda: 16, leyes: 5 },
  { semana: '11 may', presentados: 131, dictamen: 36, agenda: 18, leyes: 7 },
  { semana: '18 may', presentados: 142, dictamen: 38, agenda: 19, leyes: 8 },
]

const series = [
  { key: 'presentados', label: 'Presentados', color: '#2563eb' },
  { key: 'dictamen', label: 'En dictamen', color: '#0f9d58' },
  { key: 'agenda', label: 'En agenda / debate', color: '#d97706' },
  { key: 'leyes', label: 'Leyes aprobadas', color: '#7c3aed' },
]

type Impacto = 'Alto' | 'Medio' | 'Bajo'
type Estado = 'En dictamen' | 'En agenda / debate' | 'Presentado'

const proyectosTransversales: {
  pl: string
  tema: string
  temaTone: string
  impacto: Impacto
  alcance: string
  estado: Estado
  cambio: string
  motivo: string
}[] = [
  {
    pl: 'PL 6789/2024-CR',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '15 may 2025',
    motivo: 'Afecta costos laborales y formalización de MIPYME.',
  },
  {
    pl: 'PL 6543/2024-CR',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '14 may 2025',
    motivo: 'Modifica deducciones y beneficios tributarios.',
  },
  {
    pl: 'PL 6123/2024-CR',
    tema: 'Infraestructura',
    temaTone: 'bg-chart-5/15 text-chart-5',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '12 may 2025',
    motivo: 'Impulsa APP para obras regionales.',
  },
  {
    pl: 'PL 5900/2024-CR',
    tema: 'Transporte / Energía',
    temaTone: 'bg-success/10 text-success',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '09 may 2025',
    motivo: 'Incentiva la movilidad eléctrica.',
  },
  {
    pl: 'PL 5432/2024-CR',
    tema: 'Ambiente de negocios',
    temaTone: 'bg-success/10 text-success',
    impacto: 'Bajo',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '08 may 2025',
    motivo: 'Simplifica licencias y permisos.',
  },
]

const topCongresistas = [
  { nombre: 'Eduvin Espinoza', bancada: 'Fuerza Popular', pl: 8, tema: 'Laboral', temaColor: 'text-destructive' },
  { nombre: 'Gloria Hinoche', bancada: 'Alianza para el Progreso', pl: 7, tema: 'Competitividad', temaColor: 'text-info' },
  { nombre: 'Juan Villanueva', bancada: 'Somos Perú', pl: 6, tema: 'Infraestructura', temaColor: 'text-chart-5' },
  { nombre: 'Rosana Rocha', bancada: 'Renovación Popular', pl: 5, tema: 'Tributario', temaColor: 'text-chart-3' },
  { nombre: 'Luis Martínez', bancada: 'Avanza País', pl: 4, tema: 'Transporte / Energía', temaColor: 'text-success' },
]

const filtros = [
  { label: 'Fecha', value: '12 – 18 may 2025' },
  { label: 'Sector', value: 'Todas' },
  { label: 'Estado', value: 'Todos' },
  { label: 'Probabilidad', value: 'Todos' },
  { label: 'Impacto', value: 'Todos' },
]

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

interface DashboardViewProps {
  onBack?: () => void
}

export function DashboardView({ onBack }: DashboardViewProps) {
  const [tab, setTab] = useState('general')
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [baseWidth, setBaseWidth] = useState(1560)
  const [frameHeight, setFrameHeight] = useState<number | undefined>(undefined)

  /**
   * El tablero se dibuja en un lienzo de ancho variable y se escala para caber
   * en el alto disponible. El ancho del lienzo se ajusta a `ancho / escala` para
   * que, una vez escalado, ocupe el 100% del contenedor.
   */
  useEffect(() => {
    const compute = () => {
      const frame = frameRef.current
      const content = contentRef.current
      if (!frame || !content) return

      const availableWidth = frame.clientWidth
      const availableHeight = window.innerHeight - frame.getBoundingClientRect().top - 24
      const contentHeight = content.scrollHeight
      if (availableWidth <= 0 || contentHeight <= 0 || availableHeight <= 0) return

      const nextScale = Math.min(availableHeight / contentHeight, 1)
      const targetWidth = Math.min(Math.max(availableWidth / nextScale, availableWidth), 2600)

      setScale(nextScale)
      setFrameHeight(Math.min(contentHeight * nextScale, availableHeight))
      setBaseWidth((prev) => (Math.abs(targetWidth - prev) > 8 ? prev + (targetWidth - prev) * 0.6 : prev))
    }

    compute()
    const observer = new ResizeObserver(compute)
    if (contentRef.current) observer.observe(contentRef.current)
    if (frameRef.current) observer.observe(frameRef.current)
    window.addEventListener('resize', compute)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [tab])

  return (
    <div ref={frameRef} className="w-full overflow-hidden" style={{ height: frameHeight }}>
      <div
        ref={contentRef}
        className="flex flex-col gap-4"
        style={{
          width: baseWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
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
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar PPT
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Reporte semanal
          </Button>
          <Button size="sm" className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <Bookmark className="h-4 w-4" />
            Guardar vista
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filtros.map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs"
          >
            <span className="text-muted-foreground">{f.label}</span>
            <span className="font-medium text-foreground">{f.value}</span>
          </div>
        ))}
        <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Filter className="h-3.5 w-3.5" />
          Limpiar filtros
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${kpi.tone}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs leading-relaxed text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
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
        ))}
      </div>

      {/* Temas + chart */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
              Temas transversales prioritarios
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {temas.map((tema) => (
                <div key={tema.name} className="flex flex-col rounded-xl border border-border p-3">
                  <div className="flex items-start gap-2">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tema.tone}`}>
                      <tema.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold leading-snug text-foreground text-pretty">{tema.name}</p>
                  </div>
                  <p className="mt-2 text-3xl font-bold leading-none tracking-tight text-foreground">{tema.total}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">PL en total</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-2.5">
                    {nivelesTema.map((nivel) => {
                      const count = tema[nivel.key]
                      return (
                        <p key={nivel.key} className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <Dot className={nivel.dot} />
                          <span className="font-semibold">{count}</span>
                          <span className="text-muted-foreground">
                            {count === 1 ? nivel.singular : nivel.plural}
                          </span>
                        </p>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline">
                Ver todas las temáticas <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
              Evolución del avance de la agenda legislativa
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">Comparación semanal de proyectos por etapa</p>
            <div className="h-[236px] w-full">
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
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                Proyectos de ley con afectación transversal
                <Info className="h-4 w-4 text-muted-foreground" />
              </h2>
              <button className="flex items-center gap-1 text-xs font-medium text-info hover:underline">
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Proyecto de ley</th>
                    <th className="py-2 pr-3 font-medium">Tema</th>
                    <th className="py-2 pr-3 font-medium">Impacto</th>
                    <th className="py-2 pr-3 font-medium">Estado actual</th>
                    <th className="py-2 pr-3 font-medium">Último cambio</th>
                    <th className="py-2 font-medium">Por qué importa</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectosTransversales.map((p) => (
                    <tr key={p.pl} className="border-b border-border last:border-0 align-top">
                      <td className="py-3 pr-3 font-medium text-foreground whitespace-nowrap">{p.pl}</td>
                      <td className="py-3 pr-3">
                        <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${p.temaTone}`}>{p.tema}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${impactoTone[p.impacto]}`}>
                          {p.impacto}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${estadoTone[p.estado]}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground whitespace-nowrap">{p.cambio}</td>
                      <td className="py-3 text-muted-foreground">{p.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                Top congresistas (vista previa)
                <Info className="h-4 w-4 text-muted-foreground" />
              </h2>
              <button className="flex items-center gap-1 text-xs font-medium text-info hover:underline">
                Ver incidencia parlamentaria <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="divide-y divide-border">
              {topCongresistas.map((c, i) => (
                <li key={c.nombre} className="flex items-center gap-3 py-3">
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
                  <div className="w-40 shrink-0 text-right">
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
          Actualizado: 18/05/2025 11:30 am
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Los niveles de impacto y probabilidad se calculan en base a votaciones, participación y señales públicas.
        </span>
      </div>
      </div>
    </div>
  )
}
