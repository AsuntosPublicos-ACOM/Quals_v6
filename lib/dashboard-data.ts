/**
 * Datos (ficticios) de la vista general del dashboard.
 * Viven fuera del componente para que la exportación a PPT y el reporte
 * semanal usen exactamente la misma fuente que la UI.
 */

export type Impacto = 'Alto' | 'Medio' | 'Bajo'
export type Estado = 'En dictamen' | 'En agenda / debate' | 'Presentado'
export type Probabilidad = 'Alta' | 'Media' | 'Baja'

export type IconKey =
  | 'file'
  | 'target'
  | 'landmark'
  | 'activity'
  | 'bell'
  | 'users'
  | 'scale'
  | 'trending'
  | 'building'
  | 'leaf'
  | 'bus'

export interface Kpi {
  label: string
  value: string
  iconKey: IconKey
  tone: string
  delta: string
  trend: 'up' | 'flat'
}

export interface Tema {
  name: string
  total: number
  iconKey: IconKey
  tone: string
  criticos: number
  altos: number
  medios: number
  bajos: number
}

export interface ProyectoTransversal {
  pl: string
  tema: string
  temaTone: string
  impacto: Impacto
  probabilidad: Probabilidad
  alcance: string
  estado: Estado
  cambio: string
  /** Fecha ISO del último cambio, usada por el filtro de periodo. */
  fecha: string
  motivo: string
}

export const PERIODO = '12 – 18 may 2025'
export const ACTUALIZADO = '18/05/2025 11:30 am'

export const kpis: Kpi[] = [
  { label: 'PL activos', value: '142', iconKey: 'file', tone: 'text-destructive bg-destructive/10', delta: '12', trend: 'up' },
  { label: 'Alto impacto o alto prob.', value: '24', iconKey: 'target', tone: 'text-chart-3 bg-chart-3/10', delta: '5', trend: 'up' },
  { label: 'Comisiones críticas', value: '6', iconKey: 'landmark', tone: 'text-chart-5 bg-chart-5/10', delta: 'sin cambio', trend: 'flat' },
  { label: 'Con movimiento esta semana', value: '38', iconKey: 'activity', tone: 'text-info bg-info/10', delta: '9', trend: 'up' },
  { label: 'Alertas', value: '12', iconKey: 'bell', tone: 'text-chart-3 bg-chart-3/10', delta: '2', trend: 'up' },
]

export const temas: Tema[] = [
  { name: 'Laboral', total: 24, iconKey: 'users', tone: 'bg-destructive/10 text-destructive', criticos: 4, altos: 10, medios: 10, bajos: 0 },
  { name: 'Tributario', total: 19, iconKey: 'scale', tone: 'bg-destructive/10 text-destructive', criticos: 4, altos: 4, medios: 9, bajos: 2 },
  { name: 'Competitividad', total: 16, iconKey: 'trending', tone: 'bg-info/10 text-info', criticos: 2, altos: 7, medios: 5, bajos: 2 },
  { name: 'Infraestructura', total: 14, iconKey: 'building', tone: 'bg-success/10 text-success', criticos: 1, altos: 4, medios: 5, bajos: 2 },
  { name: 'Ambiente de negocios', total: 12, iconKey: 'leaf', tone: 'bg-success/10 text-success', criticos: 1, altos: 4, medios: 5, bajos: 2 },
  { name: 'Transporte / Energía', total: 10, iconKey: 'bus', tone: 'bg-info/10 text-info', criticos: 1, altos: 3, medios: 5, bajos: 2 },
]

export const nivelesTema = [
  { key: 'criticos', singular: 'Crítico', plural: 'Críticos', dot: 'bg-destructive' },
  { key: 'altos', singular: 'Alto', plural: 'Altos', dot: 'bg-chart-2' },
  { key: 'medios', singular: 'Medio', plural: 'Medios', dot: 'bg-chart-3' },
  { key: 'bajos', singular: 'Bajo', plural: 'Bajos', dot: 'bg-success' },
] as const

export const evolucion = [
  { semana: '20 abr', presentados: 94, dictamen: 29, agenda: 13, leyes: 3 },
  { semana: '27 abr', presentados: 107, dictamen: 31, agenda: 15, leyes: 4 },
  { semana: '04 may', presentados: 116, dictamen: 33, agenda: 16, leyes: 5 },
  { semana: '11 may', presentados: 131, dictamen: 36, agenda: 18, leyes: 7 },
  { semana: '18 may', presentados: 142, dictamen: 38, agenda: 19, leyes: 8 },
]

export const series = [
  { key: 'presentados', label: 'Presentados', color: '#2563eb' },
  { key: 'dictamen', label: 'En dictamen', color: '#0f9d58' },
  { key: 'agenda', label: 'En agenda / debate', color: '#d97706' },
  { key: 'leyes', label: 'Leyes aprobadas', color: '#7c3aed' },
] as const

export const proyectosTransversales: ProyectoTransversal[] = [
  {
    pl: 'PL 6789/2024-CR',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    impacto: 'Alto',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '15 may 2025',
    fecha: '2025-05-15',
    motivo: 'Afecta costos laborales y formalización de MIPYME.',
  },
  {
    pl: 'PL 6543/2024-CR',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    impacto: 'Alto',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '14 may 2025',
    fecha: '2025-05-14',
    motivo: 'Modifica deducciones y beneficios tributarios.',
  },
  {
    pl: 'PL 6301/2024-CR',
    tema: 'Competitividad',
    temaTone: 'bg-info/10 text-info',
    impacto: 'Alto',
    probabilidad: 'Media',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '13 may 2025',
    fecha: '2025-05-13',
    motivo: 'Fija reglas de promoción y estabilidad jurídica.',
  },
  {
    pl: 'PL 6123/2024-CR',
    tema: 'Infraestructura',
    temaTone: 'bg-chart-5/15 text-chart-5',
    impacto: 'Medio',
    probabilidad: 'Media',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '12 may 2025',
    fecha: '2025-05-12',
    motivo: 'Impulsa APP para obras regionales.',
  },
  {
    pl: 'PL 5900/2024-CR',
    tema: 'Transporte / Energía',
    temaTone: 'bg-success/10 text-success',
    impacto: 'Medio',
    probabilidad: 'Baja',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '09 may 2025',
    fecha: '2025-05-09',
    motivo: 'Incentiva la movilidad eléctrica.',
  },
  {
    pl: 'PL 5432/2024-CR',
    tema: 'Ambiente de negocios',
    temaTone: 'bg-success/10 text-success',
    impacto: 'Bajo',
    probabilidad: 'Baja',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '08 may 2025',
    fecha: '2025-05-08',
    motivo: 'Simplifica licencias y permisos.',
  },
  {
    pl: 'PL 5210/2024-CR',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    impacto: 'Medio',
    probabilidad: 'Media',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '05 may 2025',
    fecha: '2025-05-05',
    motivo: 'Moderniza la negociación colectiva.',
  },
  {
    pl: 'PL 4987/2024-CR',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    impacto: 'Bajo',
    probabilidad: 'Baja',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '28 abr 2025',
    fecha: '2025-04-28',
    motivo: 'Ajusta detracciones y retenciones.',
  },
]

export const topCongresistas = [
  { nombre: 'Eduvin Espinoza', bancada: 'Fuerza Popular', pl: 8, tema: 'Laboral', temaColor: 'text-destructive' },
  { nombre: 'Gloria Hinoche', bancada: 'Alianza para el Progreso', pl: 7, tema: 'Competitividad', temaColor: 'text-info' },
  { nombre: 'Juan Villanueva', bancada: 'Somos Perú', pl: 6, tema: 'Infraestructura', temaColor: 'text-chart-5' },
  { nombre: 'Rosana Rocha', bancada: 'Renovación Popular', pl: 5, tema: 'Tributario', temaColor: 'text-chart-3' },
  { nombre: 'Luis Martínez', bancada: 'Avanza País', pl: 4, tema: 'Transporte / Energía', temaColor: 'text-success' },
]

/* -------------------------------- filtros -------------------------------- */

export type FiltroKey = 'fecha' | 'sector' | 'estado' | 'probabilidad' | 'impacto'

export interface FiltroDef {
  key: FiltroKey
  label: string
  /** Opción por defecto (sin filtrar). */
  all: string
  options: string[]
}

/** Periodos disponibles: cada uno define su ventana de fechas ISO. */
export const periodos: { label: string; desde: string; hasta: string }[] = [
  { label: '12 – 18 may 2025', desde: '2025-05-12', hasta: '2025-05-18' },
  { label: '05 – 18 may 2025', desde: '2025-05-05', hasta: '2025-05-18' },
  { label: 'Mayo 2025', desde: '2025-05-01', hasta: '2025-05-31' },
  { label: 'Últimos 90 días', desde: '2025-02-18', hasta: '2025-05-18' },
]

export const filtrosDef: FiltroDef[] = [
  { key: 'fecha', label: 'Fecha', all: PERIODO, options: periodos.map((p) => p.label) },
  { key: 'sector', label: 'Sector', all: 'Todas', options: temas.map((t) => t.name) },
  {
    key: 'estado',
    label: 'Estado',
    all: 'Todos',
    options: ['En dictamen', 'En agenda / debate', 'Presentado'],
  },
  { key: 'probabilidad', label: 'Probabilidad', all: 'Todos', options: ['Alta', 'Media', 'Baja'] },
  { key: 'impacto', label: 'Impacto', all: 'Todos', options: ['Alto', 'Medio', 'Bajo'] },
]

/** Aplica los filtros activos sobre los proyectos transversales. */
export function filtrarProyectos(
  proyectos: ProyectoTransversal[],
  filtros: Record<FiltroKey, string>,
): ProyectoTransversal[] {
  const periodo = periodos.find((p) => p.label === filtros.fecha)

  return proyectos.filter((p) => {
    if (periodo && (p.fecha < periodo.desde || p.fecha > periodo.hasta)) return false
    if (filtros.sector !== 'Todas' && p.tema !== filtros.sector) return false
    if (filtros.estado !== 'Todos' && p.estado !== filtros.estado) return false
    if (filtros.probabilidad !== 'Todos' && p.probabilidad !== filtros.probabilidad) return false
    if (filtros.impacto !== 'Todos' && p.impacto !== filtros.impacto) return false
    return true
  })
}

export const filtrosIniciales: Record<FiltroKey, string> = {
  fecha: PERIODO,
  sector: 'Todas',
  estado: 'Todos',
  probabilidad: 'Todos',
  impacto: 'Todos',
}

/** Alertas destacadas usadas por el reporte semanal. */
export const alertasSemana = [
  { titulo: 'PL 6789/2024-CR pasa a dictamen en Comisión de Trabajo', dia: '15 may', nivel: 'Crítico' as const },
  { titulo: 'PL 6543/2024-CR agendado para debate en Pleno', dia: '14 may', nivel: 'Crítico' as const },
  { titulo: 'Comisión de Economía cita a sesión extraordinaria', dia: '13 may', nivel: 'Alto' as const },
  { titulo: 'Nuevo predictamen sobre APP regionales', dia: '12 may', nivel: 'Alto' as const },
  { titulo: 'Se retoma discusión de licencias y permisos', dia: '08 may', nivel: 'Medio' as const },
]

/** Secciones exportables, compartidas por PPT y reporte semanal. */
export type DashboardSection = 'kpis' | 'temas' | 'evolucion' | 'proyectos' | 'congresistas' | 'alertas'

export const DASHBOARD_SECTIONS: { id: DashboardSection; label: string }[] = [
  { id: 'kpis', label: 'Indicadores clave' },
  { id: 'temas', label: 'Temas transversales prioritarios' },
  { id: 'evolucion', label: 'Evolución de la agenda legislativa' },
  { id: 'proyectos', label: 'Proyectos con afectación transversal' },
  { id: 'congresistas', label: 'Top congresistas' },
  { id: 'alertas', label: 'Alertas de la semana' },
]
