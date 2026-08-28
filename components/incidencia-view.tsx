'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Clock,
  FileText,
  Info,
  User,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ACTUALIZADO_INCIDENCIA,
  aplicarDetalleIncidencia,
  aplicarFocoIncidencia,
  conteosFoco,
  congresistasIncidencia,
  filtrarCongresistas,
  filtrosIncidenciaDef,
  filtrosIncidenciaIniciales,
  focosIncidenciaDef,
  resumenBancadas,
  resumenComisiones,
  totalPl,
  type DetalleIncidencia,
  type FiltroIncidenciaKey,
  type FocoIncidencia,
  type ImpactoDirecto,
  type NivelF,
  type ProyectoVinculado,
} from '@/lib/incidencia-data'

/* ------------------------------ icon mapping ----------------------------- */

const ICONS: Record<string, LucideIcon> = {
  user: User,
  users: Users,
  file: FileText,
  group: Users,
}

/* -------------------------------- helpers -------------------------------- */

const impactoTone: Record<ImpactoDirecto, string> = {
  Sí: 'border-destructive/40 bg-destructive/10 text-destructive',
  No: 'border-border bg-muted text-muted-foreground',
}

const nivelFTone: Record<NivelF, string> = {
  Alta: 'border-destructive/40 bg-destructive/10 text-destructive',
  Media: 'border-chart-3/40 bg-chart-3/10 text-chart-3',
  Baja: 'border-border bg-muted text-muted-foreground',
}

const estadoProyectoTone: Record<ProyectoVinculado['estado'], string> = {
  'En comisión': 'border-chart-2/40 bg-chart-2/10 text-chart-2',
  Aprobado: 'border-success/40 bg-success/10 text-success',
  Dictamen: 'border-info/40 bg-info/10 text-info',
}

const medalTone = [
  'bg-chart-3 text-primary-foreground',
  'bg-muted text-foreground',
  'bg-destructive text-destructive-foreground',
]

const chartConfig = {
  pl: { label: 'PL vinculados', color: 'var(--chart-1)' },
  plCriticos: { label: 'Impacto directo + prob. alta', color: 'var(--destructive)' },
  plResto: { label: 'Resto de PL', color: 'var(--chart-1)' },
} satisfies ChartConfig

/** Porcentaje mínimo para escribir la cifra dentro del segmento del donut. */
const MIN_PCT_ETIQUETA = 6

/** Congresistas mostrados antes de abrir el ranking completo. */
const TOP_VISIBLE = 5

/** Opacidad de un elemento del gráfico que queda fuera de lo resaltado. */
const ATENUADO = 0.3

/* -------------------------------- component ------------------------------ */

export function IncidenciaView() {
  const [filtros, setFiltros] = useState<Record<FiltroIncidenciaKey, string[]>>(
    filtrosIncidenciaIniciales,
  )
  const [foco, setFoco] = useState<FocoIncidencia>('todos')
  const [detalle, setDetalle] = useState<DetalleIncidencia>(null)
  /** Congresista marcado en el ranking: pinta su bancada y sus comisiones. */
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rankingCompleto, setRankingCompleto] = useState(false)

  /** Lectura tolerante: garantiza un arreglo aunque el filtro no esté definido. */
  const seleccionDe = (key: FiltroIncidenciaKey) => {
    const valor = filtros[key]
    return Array.isArray(valor) ? valor : []
  }

  const alternarFiltro = (key: FiltroIncidenciaKey, value: string) =>
    setFiltros((prev) => {
      const actual = Array.isArray(prev[key]) ? prev[key] : []
      return {
        ...prev,
        [key]: actual.includes(value) ? actual.filter((v) => v !== value) : [...actual, value],
      }
    })

  const limpiarFiltro = (key: FiltroIncidenciaKey) =>
    setFiltros((prev) => ({ ...prev, [key]: [] }))

  const hayFiltros =
    filtrosIncidenciaDef.some((f) => seleccionDe(f.key).length > 0) ||
    foco !== 'todos' ||
    detalle !== null ||
    selectedId !== null

  const limpiarTodo = () => {
    setFiltros(filtrosIncidenciaIniciales)
    setFoco('todos')
    setDetalle(null)
    setSelectedId(null)
  }

  /** Click en una fila del ranking: marca o desmarca al congresista. */
  const marcarCongresista = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id))

  /** Cambiar de KPI reinicia el detalle: el arrastre siempre parte del KPI. */
  const elegirFoco = (id: FocoIncidencia) => {
    setFoco((prev) => (prev === id && id !== 'todos' ? 'todos' : id))
    setDetalle(null)
  }

  /** Click en una bancada del donut: alterna el recorte por bancada. */
  const elegirBancada = (bancada: string) =>
    setDetalle((prev) =>
      prev?.tipo === 'bancada' && prev.valor === bancada ? null : { tipo: 'bancada', valor: bancada },
    )

  /** Click en una barra de comisión: alterna el recorte por comisión. */
  const elegirComision = (comision: string) =>
    setDetalle((prev) =>
      prev?.tipo === 'comision' && prev.valor === comision
        ? null
        : { tipo: 'comision', valor: comision },
    )

  /* ----------------------------- datos derivados ---------------------------- */

  /** Congresistas del periodo y filtros del encabezado: base de los KPIs. */
  const base = useMemo(() => filtrarCongresistas(congresistasIncidencia, filtros), [filtros])

  /** Conjunto del KPI activo: da contexto al donut y a las barras. */
  const conjunto = useMemo(() => aplicarFocoIncidencia(base, foco), [base, foco])

  /** Selección final (KPI + detalle) que alimenta la tabla y la ficha. */
  const visibles = useMemo(
    () =>
      [...aplicarDetalleIncidencia(conjunto, detalle)].sort(
        (a, b) => b.plCriticos - a.plCriticos || a.nombre.localeCompare(b.nombre),
      ),
    [conjunto, detalle],
  )

  const conteos = useMemo(() => conteosFoco(base), [base])
  const bancadas = useMemo(() => resumenBancadas(conjunto), [conjunto])
  const comisiones = useMemo(() => resumenComisiones(conjunto), [conjunto])
  const totalConjunto = useMemo(() => totalPl(conjunto), [conjunto])

  /** Congresista marcado, solo si sigue dentro de la selección vigente. */
  const marcado = selectedId ? (visibles.find((c) => c.id === selectedId) ?? null) : null

  /** Sin marca explícita la ficha muestra al primero del ranking. */
  const ficha = marcado ?? visibles[0] ?? null

  /** Filas del ranking: top 5 salvo que se abra el ranking completo. */
  const listado = rankingCompleto ? visibles : visibles.slice(0, TOP_VISIBLE)

  /** Comisiones donde incide el congresista marcado, para pintar las barras. */
  const comisionesMarcadas = useMemo(
    () => new Set(marcado?.comisiones.map((c) => c.comision) ?? []),
    [marcado],
  )

  /** Eje de las barras redondeado al múltiplo de 5 siguiente, como en el diseño. */
  const topeEje = Math.max(5, Math.ceil((comisiones[0]?.pl ?? 0) / 5) * 5)
  const ticksEje = Array.from({ length: topeEje / 5 + 1 }, (_, i) => i * 5)

  const focoActivo = foco === 'todos' ? null : focosIncidenciaDef.find((f) => f.id === foco)

  /** Etiquetas de la selección vigente, mostradas junto al título de la tabla. */
  const chips = [
    focoActivo?.label ?? null,
    detalle ? `${detalle.tipo === 'bancada' ? 'Bancada' : 'Comisión'}: ${detalle.valor}` : null,
    marcado ? `Congresista: ${marcado.nombre}` : null,
  ].filter((c): c is string => Boolean(c))

  const bancadaActiva = detalle?.tipo === 'bancada' ? detalle.valor : null
  const comisionActiva = detalle?.tipo === 'comision' ? detalle.valor : null

  /**
   * El recorte por bancada manda sobre el resaltado; si no hay recorte, se
   * atenúan las bancadas ajenas al congresista marcado.
   */
  const opacidadBancada = (incluye: string[]) => {
    if (bancadaActiva) return incluye.includes(bancadaActiva) ? 1 : ATENUADO
    if (marcado) return incluye.includes(marcado.bancada) ? 1 : ATENUADO
    return 1
  }

  const opacidadComision = (comision: string) => {
    if (comisionActiva) return comisionActiva === comision ? 1 : ATENUADO
    if (marcado) return comisionesMarcadas.has(comision) ? 1 : ATENUADO
    return 1
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filtrosIncidenciaDef.map((f) => {
          const seleccion = seleccionDe(f.key)
          const active = seleccion.length > 0
          const resumen =
            seleccion.length === 0
              ? f.all
              : seleccion.length === 1
                ? seleccion[0]
                : `${seleccion.length} seleccionados`
          return (
            <DropdownMenu key={f.key}>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex max-w-64 items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? 'border-info bg-info/5 text-foreground'
                      : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  <span className="shrink-0 text-muted-foreground">{f.label}</span>
                  <span className="truncate font-medium text-foreground">{resumen}</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-52">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    limpiarFiltro(f.key)
                  }}
                  className="text-muted-foreground"
                >
                  {f.all}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {f.options.map((opt) => (
                  <DropdownMenuCheckboxItem
                    key={opt}
                    checked={seleccion.includes(opt)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => alternarFiltro(f.key, opt)}
                  >
                    {opt}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
        {hayFiltros && (
          <button
            onClick={limpiarTodo}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-info hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      {/* Paneles a la izquierda; ficha técnica fija a la derecha */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          {/* KPIs: cada uno recorta el conjunto que alimenta los demás paneles */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {focosIncidenciaDef.map((f) => {
              const Icon = ICONS[f.iconKey]
              const activo = foco === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => elegirFoco(f.id)}
                  aria-pressed={activo}
                  className={`flex items-start gap-2.5 rounded-xl border bg-card p-3 text-left transition-colors ${
                    activo
                      ? 'border-info ring-1 ring-info'
                      : 'border-border hover:border-info/50 hover:bg-muted/40'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${f.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] leading-tight text-muted-foreground text-pretty">
                      {f.label}
                    </p>
                    <p className="text-xl font-bold leading-tight tracking-tight text-foreground">
                      {conteos[f.id]}
                    </p>
                    <p className="text-[10px] leading-tight text-muted-foreground text-pretty">
                      {f.hint}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Top congresistas */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Top congresistas</h2>
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-info/40 bg-info/5 px-2 py-0.5 text-[10px] font-medium text-info"
                  >
                    {c}
                  </span>
                ))}
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {visibles.length} de {base.length}
                </span>
              </div>
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="w-8 py-1.5 font-medium">#</th>
                    <th className="py-1.5 pr-2 font-medium">Nombre</th>
                    <th className="py-1.5 pr-2 font-medium">Bancada</th>
                    <th className="py-1.5 pr-2 font-medium">Sector</th>
                    <th className="py-1.5 pr-2 text-right font-medium">PL críticos</th>
                    <th className="py-1.5 pr-2 text-center font-medium">Alcance</th>
                    <th className="py-1.5 pr-2 text-center font-medium">Impacto</th>
                    <th className="py-1.5 text-center font-medium">Probabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {listado.map((c, i) => (
                    <tr
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={c.id === selectedId}
                      onClick={() => marcarCongresista(c.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          marcarCongresista(c.id)
                        }
                      }}
                      className={`cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${
                        c.id === selectedId
                          ? 'bg-info/10'
                          : c.id === ficha?.id
                            ? 'bg-muted/50'
                            : ''
                      }`}
                    >
                      <td className="py-2">
                        {i < 3 ? (
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                              medalTone[i]
                            }`}
                          >
                            {i + 1}
                          </span>
                        ) : (
                          <span className="pl-1.5 text-muted-foreground">{i + 1}</span>
                        )}
                      </td>
                      <td className="py-2 pr-2 font-medium text-foreground">{c.nombre}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.bancada}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.sectorPrincipal}</td>
                      <td className="py-2 pr-2 text-right text-foreground">{c.plCriticos}</td>
                      <td className="py-2 pr-2 text-center text-muted-foreground">{c.alcance}</td>
                      <td className="py-2 pr-2 text-center">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            impactoTone[c.impacto]
                          }`}
                        >
                          {c.impacto}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                            nivelFTone[c.probabilidad]
                          }`}
                        >
                          {c.probabilidad}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {listado.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-muted-foreground">
                        Ningún congresista coincide con la selección actual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {visibles.length > TOP_VISIBLE && (
                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setRankingCompleto((prev) => !prev)}
                    aria-expanded={rankingCompleto}
                    className="flex items-center gap-1 text-xs font-semibold text-info hover:underline"
                  >
                    {rankingCompleto
                      ? `Ver solo el top ${TOP_VISIBLE}`
                      : `Ver ranking completo (${visibles.length})`}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bancadas + concentración por comisión */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Bancadas con mayor act. legislativa
                </h2>
                <p className="mb-2 h-4 text-[10px] leading-4 text-muted-foreground">
                  {marcado ? `${marcado.nombre} · ${marcado.bancada}` : ''}
                </p>
                {bancadas.length === 0 ? (
                  <p className="py-10 text-center text-[11px] text-muted-foreground">
                    Sin actividad para la selección actual.
                  </p>
                ) : (
                  <div className="@container">
                   <div className="flex flex-col items-center gap-2 @[400px]:flex-row">
                    <div className="relative h-[150px] w-[150px] shrink-0">
                      <ChartContainer config={chartConfig} className="h-[150px] w-[150px] aspect-square">
                        <PieChart>
                          <Pie
                            data={bancadas}
                            dataKey="pl"
                            nameKey="nombre"
                            innerRadius={42}
                            outerRadius={72}
                            paddingAngle={1}
                            strokeWidth={0}
                            isAnimationActive={false}
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
                              if (payload.porcentaje < MIN_PCT_ETIQUETA) return null
                              const rad = Math.PI / 180
                              const r = innerRadius + (outerRadius - innerRadius) / 2
                              return (
                                <text
                                  x={cx + r * Math.cos(-midAngle * rad)}
                                  y={cy + r * Math.sin(-midAngle * rad)}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  className="fill-primary-foreground text-[9px] font-semibold"
                                >
                                  {payload.porcentaje}%
                                </text>
                              )
                            }}
                          >
                            {bancadas.map((b) => (
                              <Cell
                                key={b.nombre}
                                fill={b.color}
                                className={b.esOtros ? '' : 'cursor-pointer'}
                                opacity={opacidadBancada(b.incluye)}
                                stroke={
                                  marcado && b.incluye.includes(marcado.bancada)
                                    ? 'var(--color-foreground)'
                                    : undefined
                                }
                                strokeWidth={
                                  marcado && b.incluye.includes(marcado.bancada) ? 1.5 : 0
                                }
                                onClick={() => !b.esOtros && elegirBancada(b.nombre)}
                              />
                            ))}
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[9px] text-muted-foreground">Total</span>
                        <span className="text-lg font-bold leading-none text-foreground">
                          {totalConjunto}
                        </span>
                        <span className="text-[9px] text-muted-foreground">proyectos</span>
                      </div>
                    </div>
                    <ul className="flex w-full min-w-0 flex-col gap-1 @[400px]:flex-1">
                      {bancadas.map((b) => {
                        const activa = bancadaActiva === b.nombre
                        const resaltada = Boolean(marcado && b.incluye.includes(marcado.bancada))
                        return (
                          <li key={b.nombre}>
                            <button
                              type="button"
                              onClick={() => !b.esOtros && elegirBancada(b.nombre)}
                              aria-pressed={activa}
                              title={b.esOtros ? b.incluye.join(', ') : b.nombre}
                              className={`flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left text-[10px] transition-colors ${
                                b.esOtros ? 'cursor-default' : 'hover:bg-muted'
                              } ${activa ? 'bg-info/10' : ''} ${
                                resaltada ? 'ring-1 ring-foreground/30' : ''
                              } ${marcado && !resaltada ? 'opacity-45' : ''}`}
                            >
                              <span
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: b.color }}
                                aria-hidden="true"
                              />
                              <span
                                className={`truncate ${
                                  resaltada ? 'font-semibold text-foreground' : 'text-foreground'
                                }`}
                              >
                                {b.nombre}
                              </span>
                              <span className="ml-auto shrink-0 font-semibold text-foreground">
                                {b.porcentaje}%
                              </span>
                              <span className="w-7 shrink-0 text-right text-muted-foreground">
                                ({b.pl})
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                   </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Concentración por comisión
                </h2>
                <p className="mb-2 h-4 truncate text-[10px] leading-4 text-muted-foreground">
                  {marcado
                    ? `Incide en: ${marcado.comisiones
                        .map((c) => `${c.comision} (${c.pl})`)
                        .join(' · ')}`
                    : ''}
                </p>
                {comisiones.length === 0 ? (
                  <p className="py-10 text-center text-[11px] text-muted-foreground">
                    Sin comisiones para la selección actual.
                  </p>
                ) : (
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto w-full"
                    style={{ height: comisiones.length * 30 + 40 }}
                  >
                    <BarChart
                      data={comisiones}
                      layout="vertical"
                      margin={{ top: 4, right: 28, bottom: 0, left: 0 }}
                      barCategoryGap="28%"
                    >
                      <CartesianGrid horizontal={false} stroke="var(--color-border)" />
                      <XAxis
                        type="number"
                        domain={[0, topeEje]}
                        ticks={ticksEje}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="comision"
                        width={140}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 10 }}
                      />
                      {/* Tramo de PL con impacto directo y probabilidad alta */}
                      <Bar dataKey="plCriticos" stackId="pl" isAnimationActive={false}>
                        {comisiones.map((c) => (
                          <Cell
                            key={c.comision}
                            fill="var(--color-destructive)"
                            className="cursor-pointer"
                            opacity={opacidadComision(c.comision)}
                            onClick={() => elegirComision(c.comision)}
                          />
                        ))}
                      </Bar>
                      {/* Resto de PL vinculados a la comisión */}
                      <Bar
                        dataKey="plResto"
                        stackId="pl"
                        radius={[0, 2, 2, 0]}
                        isAnimationActive={false}
                      >
                        {comisiones.map((c) => (
                          <Cell
                            key={c.comision}
                            fill="var(--color-chart-1)"
                            className="cursor-pointer"
                            opacity={opacidadComision(c.comision)}
                            onClick={() => elegirComision(c.comision)}
                          />
                        ))}
                        <LabelList
                          dataKey="pl"
                          position="right"
                          offset={6}
                          className="fill-foreground"
                          style={{ fontSize: 10, fontWeight: 700 }}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full bg-destructive"
                      aria-hidden="true"
                    />
                    Impacto directo + probabilidad alta
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-chart-1" aria-hidden="true" />
                    Resto de PL
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ficha técnica: columna derecha, fija al hacer scroll */}
        <Card className="h-fit md:sticky md:top-4">
          <CardContent className="p-4">
            <h2 className="border-b border-border pb-2.5 text-sm font-semibold text-foreground">
              Ficha técnica
            </h2>

            {!ficha ? (
              <p className="py-10 text-center text-[11px] text-muted-foreground">
                Selecciona un congresista para ver su ficha.
              </p>
            ) : (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-chart-5/15">
                    <span className="text-sm font-bold text-chart-5">{ficha.iniciales}</span>
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-tight text-foreground">
                      {ficha.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">Región: {ficha.region}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-foreground">Top sectores</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ficha.sectores.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-info/40 bg-info/5 px-2.5 py-0.5 text-[11px] text-info"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-foreground">Historial reciente</p>
                  <ul className="flex flex-col gap-2">
                    {ficha.historial.map((h) => (
                      <li key={h.fecha} className="flex gap-2 text-[11px]">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-info"
                          aria-hidden="true"
                        />
                        <span className="shrink-0 font-medium text-info">{h.fecha}</span>
                        <span className="text-muted-foreground text-pretty">{h.detalle}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-foreground">Proyectos vinculados</p>
                  <ul className="flex flex-col gap-2">
                    {ficha.proyectos.map((p) => (
                      <li
                        key={p.pl}
                        className="flex items-center justify-between gap-2 rounded-md border border-border p-2"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-foreground">{p.pl}</p>
                          <p className="truncate text-[10px] text-muted-foreground">{p.titulo}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-medium ${
                            estadoProyectoTone[p.estado]
                          }`}
                        >
                          {p.estado}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" size="sm" className="mt-4 w-full gap-1.5 text-info">
                  Ver perfil completo <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Análisis actualizado al {ACTUALIZADO_INCIDENCIA}
        </span>
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          La probabilidad y el impacto directo son calculados con IA en base a votaciones,
          participación y señales públicas.
        </span>
      </div>
    </div>
  )
}
