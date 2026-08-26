'use client'

import { useMemo, useState } from 'react'
import {
  FileText,
  Target,
  Landmark,
  Activity,
  BellRing,
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
  ATENCION_META,
  IMPACTOS_DIRECTOS,
  aplicarDetalle,
  aplicarFoco,
  atencionDe,
  comisionTop,
  evolucionDesde,
  filtrarProyectos,
  filtrosDef,
  filtrosIniciales,
  focosDef,
  matrizPriorizacion,
  movimientoDe,
  proyectosTransversales,
  resumenSectores,
  sectorMarcado,
  series,
  valorFoco,
  type Detalle,
  type Estado,
  type FiltroKey,
  type IconKey,
  type KpiFoco,
  type Probabilidad,
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

const probabilidadTone: Record<Probabilidad, string> = {
  Alta: 'bg-destructive/10 text-destructive',
  Media: 'bg-chart-3/15 text-chart-3',
  Baja: 'bg-info/10 text-info',
}

const estadoTone: Record<Estado, string> = {
  'En dictamen': 'bg-success/10 text-success',
  'En agenda / debate': 'bg-chart-3/15 text-chart-3',
  Presentado: 'bg-info/10 text-info',
  'Ley aprobada': 'bg-chart-5/15 text-chart-5',
}

/** Tinte de cada celda de la matriz según su criticidad. */
const celdaTone: Record<string, string> = {
  'Alta-Sí': 'bg-destructive/5',
  'Alta-No': 'bg-chart-3/5',
  'Media-Sí': 'bg-chart-3/5',
  'Media-No': 'bg-muted/40',
  'Baja-Sí': 'bg-info/5',
  'Baja-No': 'bg-info/5',
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
  const [foco, setFoco] = useState<KpiFoco>('totales')
  const [detalle, setDetalle] = useState<Detalle>(null)

  const setFiltro = (key: FiltroKey, value: string) =>
    setFiltros((prev) => ({ ...prev, [key]: value }))

  const toggleFavorito = (pl: string) =>
    setFavoritos((prev) => (prev.includes(pl) ? prev.filter((p) => p !== pl) : [...prev, pl]))

  const hayFiltrosActivos =
    filtrosDef.some((f) => filtros[f.key] !== f.all) || foco !== 'totales' || detalle !== null

  const limpiarFiltros = () => {
    setFiltros(filtrosIniciales)
    setFoco('totales')
    setDetalle(null)
  }

  /** Vuelve a mostrar todos los PL del periodo, sin tocar los filtros del encabezado. */
  const limpiarSeleccion = () => {
    setFoco('totales')
    setDetalle(null)
  }

  /** Cambiar de KPI reinicia el detalle: el arrastre siempre parte del KPI. */
  const elegirFoco = (id: KpiFoco) => {
    setFoco((prev) => (prev === id && id !== 'totales' ? 'totales' : id))
    setDetalle(null)
  }

  /** Click en un sector: alterna el detalle por sector. */
  const elegirSector = (sector: string) =>
    setDetalle((prev) =>
      prev?.tipo === 'sector' && prev.valor === sector ? null : { tipo: 'sector', valor: sector },
    )

  /** Click en un PL del mapa: alterna el detalle por proyecto. */
  const elegirPl = (pl: string) =>
    setDetalle((prev) =>
      prev?.tipo === 'pl' && prev.valor === pl ? null : { tipo: 'pl', valor: pl },
    )

  /** PL del periodo y filtros del encabezado: base de los contadores de KPI. */
  const proyectosPeriodo = useMemo(
    () => filtrarProyectos(proyectosTransversales, filtros),
    [filtros],
  )

  /** Comisión líder del periodo; es estable y sirve como KPI clicable. */
  const comision = useMemo(() => comisionTop(proyectosPeriodo), [proyectosPeriodo])

  /** Conjunto del KPI activo: da contexto al mapa y a la tabla de sectores. */
  const conjunto = useMemo(
    () => aplicarFoco(proyectosPeriodo, foco, comision?.nombre),
    [proyectosPeriodo, foco, comision],
  )

  /** Selección final (KPI + detalle) que alimenta la tabla y la evolución. */
  const proyectosVisibles = useMemo(() => aplicarDetalle(conjunto, detalle), [conjunto, detalle])

  const sectores = useMemo(() => resumenSectores(conjunto), [conjunto])
  const matriz = useMemo(() => matrizPriorizacion(conjunto), [conjunto])
  const evolucionData = useMemo(() => evolucionDesde(proyectosVisibles), [proyectosVisibles])
  const sectorActivo = useMemo(() => sectorMarcado(conjunto, detalle), [conjunto, detalle])
  const maxSector = sectores[0]?.total ?? 1

  const focoActivo = foco === 'totales' ? null : focosDef.find((f) => f.id === foco)
  const plActivo = detalle?.tipo === 'pl' ? detalle.valor : null

  /** PL que sobreviven al detalle: el mapa atenúa los que quedan fuera. */
  const plsSeleccionados = useMemo(
    () => new Set(proyectosVisibles.map((p) => p.pl)),
    [proyectosVisibles],
  )

  /** Etiquetas de la selección vigente, mostradas junto al título de la tabla. */
  const chips = [
    foco === 'comision' && comision ? `Comisión: ${comision.nombre}` : null,
    focoActivo ? focoActivo.label : null,
    detalle?.tipo === 'sector' ? `Sector: ${detalle.valor}` : null,
    plActivo,
  ].filter((c): c is string => Boolean(c))

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
          onClick={limpiarFiltros}
          disabled={!hayFiltrosActivos}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          Limpiar filtros
        </button>
      </div>

      {/* KPIs + mapa de priorización */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)] items-stretch gap-4">
        <div className="flex flex-col gap-3">
          {focosDef.map((f) => {
            const KpiIcon = ICONS[f.iconKey]
            const activo = foco === f.id
            const total = valorFoco(proyectosPeriodo, f.id, comision?.nombre)
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => elegirFoco(f.id)}
                aria-pressed={activo}
                className={`flex flex-1 items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors ${
                  activo
                    ? 'border-info ring-1 ring-info'
                    : 'border-border hover:border-info/50 hover:bg-muted/40'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.tone}`}
                >
                  <KpiIcon className="h-4 w-4" />
                </div>
                <p className="min-w-0 flex-1 text-[11px] leading-tight text-muted-foreground text-pretty">
                  {f.label}
                </p>
                <p className="shrink-0 text-3xl font-bold leading-none tracking-tight text-foreground">
                  {total}
                </p>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => elegirFoco('comision')}
            aria-pressed={foco === 'comision'}
            disabled={!comision}
            className={`flex flex-1 items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors disabled:cursor-default ${
              foco === 'comision'
                ? 'border-info ring-1 ring-info'
                : 'border-border hover:border-info/50 hover:bg-muted/40'
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-chart-3/10 text-chart-3">
              <Users className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-tight text-muted-foreground text-pretty">
                Comisión predominante
              </p>
              {comision ? (
                <p className="mt-1 text-xs font-bold leading-tight text-foreground text-pretty">
                  {comision.nombre}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">Sin datos</p>
              )}
            </div>
            {comision && (
              <p className="shrink-0 text-3xl font-bold leading-none tracking-tight text-foreground">
                {comision.total}
              </p>
            )}
          </button>
        </div>

        <Card>
          <CardContent className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Mapa de priorización de proyectos de ley
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="mb-2 text-[11px] text-muted-foreground">
              Ubica rápidamente los PL que requieren más atención. Haz click en uno para seguirlo en
              los demás paneles.
            </p>

            <div className="flex gap-2">
              <span
                className="shrink-0 self-center text-[11px] font-semibold text-info"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Probabilidad
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 grid grid-cols-[3rem_1fr_1fr] gap-1">
                  <span />
                  {IMPACTOS_DIRECTOS.map((i) => (
                    <span key={i} className="text-center text-[11px] font-medium text-foreground">
                      {i}
                    </span>
                  ))}
                </div>
                {matriz.map((fila) => (
                  <div
                    key={fila.probabilidad}
                    className="mb-1 grid grid-cols-[3rem_1fr_1fr] items-stretch gap-1"
                  >
                    <span className="flex items-center text-[11px] font-medium text-foreground">
                      {fila.probabilidad}
                    </span>
                    {fila.celdas.map((celda) => (
                      <div
                        key={celda.impactoDirecto}
                        className={`min-h-[2.5rem] rounded-md p-1 ${
                          celdaTone[`${fila.probabilidad}-${celda.impactoDirecto}`] ?? 'bg-muted/40'
                        }`}
                      >
                        {celda.proyectos.length === 0 ? (
                          <span className="sr-only">Sin proyectos</span>
                        ) : (
                          <ul className="flex flex-col gap-1">
                            {celda.proyectos.map((p) => (
                              <li key={p.pl}>
                                <button
                                  type="button"
                                  onClick={() => elegirPl(p.pl)}
                                  aria-pressed={plActivo === p.pl}
                                  title={`${p.pl} — ${p.titulo}`}
                                  className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[10px] shadow-sm transition-colors ${
                                    plActivo === p.pl
                                      ? 'bg-info font-semibold text-primary-foreground'
                                      : 'bg-card text-foreground hover:bg-muted'
                                  } ${
                                    detalle && !plsSeleccionados.has(p.pl) ? 'opacity-40' : ''
                                  }`}
                                >
                                  <Dot
                                    className={
                                      plActivo === p.pl
                                        ? 'bg-primary-foreground'
                                        : ATENCION_META[atencionDe(p)].dot
                                    }
                                  />
                                  <span className="truncate">
                                    {p.pl} — {p.titulo}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {(['alta', 'cercano', 'regular'] as const).map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
                  >
                    <Dot className={ATENCION_META[a].dot} />
                    {ATENCION_META[a].label}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => elegirFoco('altaPrioridad')}
                className="text-[11px] font-semibold text-info hover:underline"
              >
                Alto impacto para el negocio
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectores + evolución */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Sectores con mayor concentración
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="mb-2 text-[11px] text-muted-foreground">
              Haz click en un sector para ver su desglose y su lista de PL.
            </p>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="w-6 pb-1 font-normal">#</th>
                  <th className="pb-1 pr-2 font-normal">Sector</th>
                  <th className="pb-1 pr-3 text-right font-normal">Total PL</th>
                  <th className="pb-1 font-normal">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                      <span className="font-medium text-info">Impacto directo</span>
                      <span className="flex items-center gap-1">
                        <Dot className="bg-info" /> Sí
                      </span>
                      <span className="flex items-center gap-1">
                        <Dot className="bg-muted" /> No
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sectores.map((s, i) => {
                  const marcado = sectorActivo === s.sector
                  const atenuado = sectorActivo !== null && !marcado
                  return (
                    <tr
                      key={s.sector}
                      className={`border-t border-border transition-colors ${
                        marcado ? 'bg-info/5' : 'hover:bg-muted/40'
                      } ${atenuado ? 'opacity-45' : ''}`}
                    >
                      <td className="py-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-2">
                        <button
                          type="button"
                          onClick={() => elegirSector(s.sector)}
                          aria-pressed={marcado}
                          className={`flex items-center gap-1.5 text-left ${
                            marcado ? 'font-semibold text-info' : 'text-foreground hover:text-info'
                          }`}
                        >
                          <Dot className={s.dot} />
                          {s.sector}
                        </button>
                      </td>
                      <td className="py-2 pr-3 text-right font-semibold text-foreground">
                        {s.total}
                      </td>
                      <td className="py-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex h-4 w-full">
                            <div
                              className={`flex overflow-hidden rounded ${
                                marcado ? 'ring-1 ring-info' : ''
                              }`}
                              style={{ width: `${(s.total / maxSector) * 100}%` }}
                            >
                              {s.si > 0 && (
                                <div
                                  className="flex items-center justify-center bg-info text-[9px] font-semibold text-primary-foreground"
                                  style={{ width: `${(s.si / s.total) * 100}%` }}
                                >
                                  {s.si}
                                </div>
                              )}
                              {s.no > 0 && (
                                <div
                                  className="flex items-center justify-center bg-muted text-[9px] font-semibold text-muted-foreground"
                                  style={{ width: `${(s.no / s.total) * 100}%` }}
                                >
                                  {s.no}
                                </div>
                              )}
                            </div>
                          </div>
                          {marcado && (
                            <span className="text-[10px] font-medium text-info">
                              {s.si} con impacto directo · {s.no} sin impacto directo
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {sectores.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                      Sin sectores para la selección actual.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Evolución del avance de la agenda legislativa
              <Info className="h-4 w-4 text-muted-foreground" />
            </h2>
            <p className="mb-2 text-[11px] text-muted-foreground">
              {plActivo
                ? `Recorrido de ${plActivo}: la etapa en la que estuvo cada semana.`
                : `Semana a semana, cuántos de los ${proyectosVisibles.length} PL seleccionados estaban en cada etapa.`}
            </p>
            <div className="h-[196px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucionData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
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
                    width={30}
                    allowDecimals={false}
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
          </CardContent>
        </Card>
      </div>

      {/* Tabla de proyectos */}
      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
                Proyectos de ley con afectación transversal
                <Info className="h-4 w-4 text-muted-foreground" />
              </h2>
              {chips.length > 0 && (
                <span className="text-[10px] text-muted-foreground">Filtro activo:</span>
              )}
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info"
                >
                  {chip}
                </span>
              ))}
              <span className="text-[10px] text-muted-foreground">
                {proyectosVisibles.length} de {proyectosPeriodo.length} PL
              </span>
            </div>
            <button
              type="button"
              onClick={limpiarSeleccion}
              className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-info hover:underline"
            >
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
                <th className="py-1.5 pr-2 font-medium">Sector</th>
                <th className="py-1.5 pr-2 font-medium">Comisión</th>
                <th className="py-1.5 pr-2 font-medium">Probabilidad</th>
                <th className="py-1.5 pr-2 font-medium">Impacto</th>
                <th className="py-1.5 pr-2 font-medium">Movimiento</th>
                <th className="py-1.5 pr-2 font-medium">Último cambio</th>
                <th className="py-1.5 font-medium">Por qué importa</th>
              </tr>
            </thead>
            <tbody>
              {proyectosVisibles.map((p) => {
                const isFav = favoritos.includes(p.pl)
                const mov = movimientoDe(p)
                return (
                  <tr
                    key={p.pl}
                    className={`border-b border-border align-top last:border-0 ${
                      plActivo === p.pl ? 'bg-info/5' : ''
                    }`}
                  >
                    <td className="py-2 align-middle">
                      <button
                        onClick={() => toggleFavorito(p.pl)}
                        aria-pressed={isFav}
                        aria-label={
                          isFav ? `Quitar ${p.pl} de favoritos` : `Marcar ${p.pl} como favorito`
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
                    <td className="py-2 pr-2 font-medium text-foreground">
                      <span className="whitespace-nowrap">{p.pl}</span>
                      <span className="text-muted-foreground"> — {p.titulo}</span>
                    </td>
                    <td className="py-2 pr-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${p.temaTone}`}>
                        {p.tema}
                      </span>
                    </td>
                    <td className="py-2 pr-2 text-muted-foreground">{p.comision}</td>
                    <td className="py-2 pr-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          probabilidadTone[p.probabilidad]
                        }`}
                      >
                        {p.probabilidad}
                      </span>
                    </td>
                    <td className="py-2 pr-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          p.impactoDirecto === 'Sí'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {p.impactoDirecto}
                      </span>
                    </td>
                    <td className="py-2 pr-2">
                      {mov ? (
                        <span className="flex items-center gap-1">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              estadoTone[mov.de]
                            }`}
                          >
                            {mov.de}
                          </span>
                          <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              estadoTone[mov.a]
                            }`}
                          >
                            {mov.a}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Sin cambios</span>
                      )}
                    </td>
                    <td className="py-2 pr-2 whitespace-nowrap text-muted-foreground">{p.cambio}</td>
                    <td className="py-2 text-muted-foreground">{p.motivo}</td>
                  </tr>
                )
              })}
              {proyectosVisibles.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted-foreground">
                    Ningún proyecto coincide con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

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
