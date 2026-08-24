'use client'

import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  ChevronDown,
  Clock,
  FileDown,
  FileText,
  Info,
  Layers,
  Minus,
  SlidersHorizontal,
  User,
  Users,
  BarChart3,
  CalendarDays,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ACTUALIZADO_INCIDENCIA,
  bancadasIncidencia,
  comisionesCriticas,
  concentracionPorTema,
  congresistasIncidencia,
  filtrosIncidenciaDef,
  filtrosIncidenciaIniciales,
  kpisIncidencia,
  TOTAL_PL_VINCULADOS,
  vistasRapidas,
  type FiltroIncidenciaKey,
  type Prioridad,
  type ProyectoVinculado,
  type Riesgo,
  type VistaKey,
} from '@/lib/incidencia-data'

/* ------------------------------ icon mapping ----------------------------- */

const ICONS: Record<string, LucideIcon> = {
  user: User,
  users: Users,
  file: FileText,
  layers: Layers,
  bell: Bell,
  sliders: SlidersHorizontal,
  group: Users,
}

/* -------------------------------- helpers -------------------------------- */

const prioridadTone: Record<Prioridad, string> = {
  Alta: 'bg-destructive text-destructive-foreground',
  Media: 'bg-chart-3 text-primary-foreground',
  Baja: 'bg-success text-success-foreground',
}

const riesgoTone: Record<Riesgo, string> = {
  Crítico: 'border-destructive/40 bg-destructive/10 text-destructive',
  Alto: 'border-chart-3/40 bg-chart-3/10 text-chart-3',
  Medio: 'border-chart-3/30 bg-chart-3/5 text-chart-3',
}

const estadoProyectoTone: Record<ProyectoVinculado['estado'], string> = {
  'En comisión': 'border-chart-2/40 bg-chart-2/10 text-chart-2',
  Aprobado: 'border-success/40 bg-success/10 text-success',
  Dictamen: 'border-info/40 bg-info/10 text-info',
}

const medalTone = ['bg-chart-3 text-primary-foreground', 'bg-muted text-foreground', 'bg-destructive text-destructive-foreground']

/* -------------------------------- component ------------------------------ */

interface IncidenciaViewProps {
  onBack?: () => void
}

export function IncidenciaView({ onBack }: IncidenciaViewProps) {
  const [filtros, setFiltros] = useState<Record<FiltroIncidenciaKey, string>>(
    filtrosIncidenciaIniciales,
  )
  const [vista, setVista] = useState<VistaKey>('personalizada')
  const [selectedId, setSelectedId] = useState(congresistasIncidencia[0].id)

  const setFiltro = (key: FiltroIncidenciaKey, value: string) =>
    setFiltros((prev) => ({ ...prev, [key]: value }))

  const congresistasVisibles = useMemo(() => {
    return congresistasIncidencia.filter((c) => {
      if (filtros.sector !== 'Todos' && !c.temas.includes(filtros.sector)) return false
      if (filtros.probabilidad !== 'Todos') {
        const nivel = c.probabilidad >= 80 ? 'Alta' : c.probabilidad >= 60 ? 'Media' : 'Baja'
        if (nivel !== filtros.probabilidad) return false
      }
      return true
    })
  }, [filtros])

  const ficha =
    congresistasIncidencia.find((c) => c.id === selectedId) ?? congresistasIncidencia[0]

  const maxPl = Math.max(...bancadasIncidencia.map((b) => b.plPresentados))

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Title + actions */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Incidencia parlamentaria
            </h1>
            <p className="text-sm text-muted-foreground">
              Congresistas, comisiones y rutas de relacionamiento
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar PPT
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <CalendarDays className="h-4 w-4" />
            Reporte semanal
          </Button>
        </div>
      </div>

      {/* Quick views */}
      <div className="flex flex-wrap items-center gap-2">
        {vistasRapidas.map((v) => {
          const Icon = ICONS[v.iconKey]
          const active = vista === v.key
          return (
            <button
              key={v.key}
              onClick={() => setVista(v.key)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'border-destructive bg-destructive/5 text-destructive'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {v.label}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {filtrosIncidenciaDef.map((f) => {
          const active = filtros[f.key] !== f.all
          return (
            <div key={f.key} className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                {f.key === 'fecha' && <CalendarDays className="h-3.5 w-3.5" />}
                {f.label}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs transition-colors ${
                      active
                        ? 'border-info bg-info/5 text-foreground'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="truncate">{filtros[f.key]}</span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-48">
                  {f.key !== 'fecha' && (
                    <DropdownMenuItem onSelect={() => setFiltro(f.key, f.all)}>
                      {f.all}
                    </DropdownMenuItem>
                  )}
                  {f.options.map((opt) => (
                    <DropdownMenuItem key={opt} onSelect={() => setFiltro(f.key, opt)}>
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        })}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {kpisIncidencia.map((kpi) => {
          const Icon = ICONS[kpi.iconKey]
          return (
            <Card key={kpi.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${kpi.tone}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold leading-tight tracking-tight text-foreground">
                    {kpi.value}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    {kpi.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-success" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    <span className={kpi.trend === 'up' ? 'font-semibold text-success' : ''}>
                      {kpi.delta}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
        <Card className="border-dashed bg-muted/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-border">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Indicador adicional</p>
              <p className="text-[11px] text-muted-foreground">Próximamente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          {/* Top congresistas */}
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Top congresistas</h2>
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="w-8 py-1.5 font-medium">#</th>
                    <th className="py-1.5 pr-2 font-medium">Nombre</th>
                    <th className="py-1.5 pr-2 font-medium">Bancada</th>
                    <th className="py-1.5 pr-2 font-medium">Tema principal</th>
                    <th className="py-1.5 pr-2 text-right font-medium">PL críticos</th>
                    <th className="py-1.5 pr-2 text-right font-medium">Prob. de incidencia</th>
                    <th className="py-1.5 text-center font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {congresistasVisibles.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/60 ${
                        c.id === selectedId ? 'bg-muted/50' : ''
                      }`}
                    >
                      <td className="py-2">
                        {c.rank <= 3 ? (
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                              medalTone[c.rank - 1]
                            }`}
                          >
                            {c.rank}
                          </span>
                        ) : (
                          <span className="pl-1.5 text-muted-foreground">{c.rank}</span>
                        )}
                      </td>
                      <td className="py-2 pr-2 font-medium text-foreground">{c.nombre}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.bancada}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.temaPrincipal}</td>
                      <td className="py-2 pr-2 text-right text-foreground">{c.plCriticos}</td>
                      <td className="py-2 pr-2 text-right font-medium text-foreground">
                        {c.probabilidad}%
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            prioridadTone[c.prioridad]
                          }`}
                        >
                          {c.prioridad}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {congresistasVisibles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-muted-foreground">
                        Ningún congresista coincide con los filtros seleccionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-2.5 flex justify-end">
                <button className="flex items-center gap-1 text-xs font-semibold text-info hover:underline">
                  Ver ranking completo <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Bancadas + concentración */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Bancadas con mayor act. legislativa
                </h2>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="w-6 py-1.5 font-medium">#</th>
                      <th className="py-1.5 pr-2 font-medium">Bancada</th>
                      <th className="py-1.5 text-right font-medium">PL presentados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bancadasIncidencia.map((b, i) => (
                      <tr key={b.nombre} className="border-b border-border last:border-0">
                        <td className="py-2 text-muted-foreground">{i + 1}</td>
                        <td className="py-2 pr-3">
                          <p className="mb-1 text-foreground">{b.nombre}</p>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${b.color}`}
                              style={{ width: `${(b.plPresentados / maxPl) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2 text-right font-semibold text-foreground">
                          {b.plPresentados}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-2.5 flex justify-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-info hover:underline">
                    Ver todas las bancadas <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h2 className="mb-1 text-sm font-semibold text-foreground">
                  Concentración por tema
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative h-[150px] w-[150px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={concentracionPorTema}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={1}
                          strokeWidth={0}
                          isAnimationActive={false}
                        >
                          {concentracionPorTema.map((t) => (
                            <Cell key={t.name} fill={t.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{
                            backgroundColor: 'var(--color-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold leading-none text-foreground">
                        {TOTAL_PL_VINCULADOS}
                      </span>
                      <span className="text-[9px] text-muted-foreground">PL vinculados</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-[11px]">
                    {concentracionPorTema.map((t) => (
                      <li key={t.name} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: t.color }}
                          aria-hidden="true"
                        />
                        <span className="text-foreground">{t.name}</span>
                        <span className="ml-auto font-medium text-muted-foreground">
                          {t.value}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2 flex justify-center">
                  <button className="flex items-center gap-1 text-xs font-semibold text-info hover:underline">
                    Ver detalle por tema <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comisiones críticas */}
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                Comisiones críticas (top)
              </h2>
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-1.5 pr-2 font-medium">Comisión</th>
                    <th className="py-1.5 pr-2 text-right font-medium">PL vinculados</th>
                    <th className="py-1.5 text-center font-medium">Riesgo</th>
                    <th className="py-1.5 text-center font-medium">Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {comisionesCriticas.map((c) => (
                    <tr key={c.comision} className="border-b border-border last:border-0">
                      <td className="py-2 pr-2 text-foreground">{c.comision}</td>
                      <td className="py-2 pr-2 text-right text-foreground">{c.plVinculados}</td>
                      <td className="py-2 text-center">
                        <span
                          className={`inline-block rounded border px-2 py-0.5 text-[10px] font-medium ${
                            riesgoTone[c.riesgo]
                          }`}
                        >
                          {c.riesgo}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            prioridadTone[c.prioridad]
                          }`}
                        >
                          {c.prioridad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2.5 flex justify-center">
                <button className="flex items-center gap-1 text-xs font-semibold text-info hover:underline">
                  Ver todas las comisiones <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ficha técnica */}
        <Card className="h-fit">
          <CardContent className="p-4">
            <h2 className="border-b border-border pb-2.5 text-sm font-semibold text-foreground">
              Ficha técnica
            </h2>

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
              <p className="mb-2 text-xs font-semibold text-foreground">Top temas</p>
              <div className="flex flex-wrap gap-1.5">
                {ficha.temas.map((t) => (
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
          Los niveles de probabilidad y riesgo son calculados con IA en base a votaciones,
          participación y señales públicas.
        </span>
      </div>
    </div>
  )
}
