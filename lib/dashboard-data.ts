/**
 * Datos (ficticios) de la vista general del dashboard.
 * Viven fuera del componente para que la exportación a PPT y el reporte
 * semanal usen exactamente la misma fuente que la UI.
 */

export type Impacto = 'Alto' | 'Medio' | 'Bajo'
export type Estado = 'En dictamen' | 'En agenda / debate' | 'Presentado' | 'Ley aprobada'
export type Probabilidad = 'Alta' | 'Media' | 'Baja'
export type ImpactoDirecto = 'Sí' | 'No'

/** Etapas del avance legislativo (coinciden con las series del gráfico). */
export type Etapa = 'presentados' | 'dictamen' | 'agenda' | 'leyes'

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
  /** Título corto del proyecto, se muestra junto al número de PL. */
  titulo: string
  tema: string
  temaTone: string
  comision: string
  probabilidad: Probabilidad
  /** ¿Afecta directamente al negocio? Es la columna "Impacto" de la tabla. */
  impactoDirecto: ImpactoDirecto
  /** Nivel agregado de impacto, usado por los exportables. */
  impacto: Impacto
  alcance: string
  estado: Estado
  cambio: string
  /** Fecha ISO del último cambio, usada por el filtro de periodo. */
  fecha: string
  motivo: string
  /** Etapa del PL en cada semana de `semanas` (null = aún no presentado). */
  historial: (Etapa | null)[]
}

export const PERIODO = '12 – 18 may 2025'
export const ACTUALIZADO = '18/05/2025 11:30 am'

/** Semanas del eje X del gráfico de evolución. */
export const semanas = ['20 abr', '27 abr', '04 may', '11 may', '18 may'] as const

export const ETAPA_ESTADO: Record<Etapa, Estado> = {
  presentados: 'Presentado',
  dictamen: 'En dictamen',
  agenda: 'En agenda / debate',
  leyes: 'Ley aprobada',
}

/** Paleta por sector, compartida por tabla, mapa y gráficos. */
export const SECTOR_META: Record<string, { tone: string; dot: string; bar: string }> = {
  Laboral: { tone: 'bg-destructive/10 text-destructive', dot: 'bg-info', bar: 'bg-info' },
  Tributario: { tone: 'bg-chart-3/15 text-chart-3', dot: 'bg-success', bar: 'bg-info/80' },
  Competitividad: { tone: 'bg-info/10 text-info', dot: 'bg-chart-3', bar: 'bg-info/65' },
  Infraestructura: { tone: 'bg-chart-5/15 text-chart-5', dot: 'bg-chart-5', bar: 'bg-info/50' },
  'Transporte / Energía': { tone: 'bg-success/10 text-success', dot: 'bg-success', bar: 'bg-info/40' },
  'Ambiente de negocios': { tone: 'bg-success/10 text-success', dot: 'bg-muted-foreground', bar: 'bg-info/30' },
}

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
    titulo: 'Reforma laboral',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    comision: 'Trabajo y Seguridad Social',
    probabilidad: 'Alta',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '18 may 2025',
    fecha: '2025-05-18',
    motivo: 'Afecta costos laborales y formalización de MIPYME.',
    historial: ['presentados', 'presentados', 'dictamen', 'dictamen', 'agenda'],
  },
  {
    pl: 'PL 6543/2024-CR',
    titulo: 'Deducciones tributarias',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    comision: 'Economía, Banca y Finanzas',
    probabilidad: 'Alta',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '16 may 2025',
    fecha: '2025-05-16',
    motivo: 'Modifica deducciones y beneficios tributarios.',
    historial: ['presentados', 'dictamen', 'dictamen', 'dictamen', 'agenda'],
  },
  {
    pl: 'PL 6910/2024-CR',
    titulo: 'Jornada laboral de 40 horas',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    comision: 'Trabajo y Seguridad Social',
    probabilidad: 'Alta',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '17 may 2025',
    fecha: '2025-05-17',
    motivo: 'Reduce la jornada máxima y eleva el costo de planilla.',
    historial: [null, 'presentados', 'presentados', 'presentados', 'dictamen'],
  },
  {
    pl: 'PL 6820/2024-CR',
    titulo: 'Tarifa eléctrica industrial',
    tema: 'Transporte / Energía',
    temaTone: 'bg-success/10 text-success',
    comision: 'Energía y Minas',
    probabilidad: 'Alta',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '18 may 2025',
    fecha: '2025-05-18',
    motivo: 'Modifica el pliego tarifario para grandes usuarios.',
    historial: [null, 'presentados', 'presentados', 'dictamen', 'agenda'],
  },
  {
    pl: 'PL 6650/2024-CR',
    titulo: 'Compras públicas MYPE',
    tema: 'Competitividad',
    temaTone: 'bg-info/10 text-info',
    comision: 'Producción, MYPE e Industria',
    probabilidad: 'Alta',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '17 may 2025',
    fecha: '2025-05-17',
    motivo: 'Reserva cuotas de compras estatales para MYPE.',
    historial: ['presentados', 'presentados', 'presentados', 'dictamen', 'agenda'],
  },
  {
    pl: 'PL 7005/2024-CR',
    titulo: 'Amnistía tributaria MYPE',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    comision: 'Economía, Banca y Finanzas',
    probabilidad: 'Alta',
    impactoDirecto: 'No',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '15 may 2025',
    fecha: '2025-05-15',
    motivo: 'Condona multas e intereses a pequeños contribuyentes.',
    historial: [null, null, 'presentados', 'presentados', 'dictamen'],
  },
  {
    pl: 'PL 6301/2024-CR',
    titulo: 'Competitividad y estabilidad jurídica',
    tema: 'Competitividad',
    temaTone: 'bg-info/10 text-info',
    comision: 'Producción, MYPE e Industria',
    probabilidad: 'Media',
    impactoDirecto: 'Sí',
    impacto: 'Alto',
    alcance: 'Nacional',
    estado: 'En agenda / debate',
    cambio: '14 may 2025',
    fecha: '2025-05-14',
    motivo: 'Fija reglas de promoción y estabilidad jurídica.',
    historial: ['presentados', 'presentados', 'dictamen', 'dictamen', 'agenda'],
  },
  {
    pl: 'PL 5900/2024-CR',
    titulo: 'Movilidad eléctrica',
    tema: 'Transporte / Energía',
    temaTone: 'bg-success/10 text-success',
    comision: 'Transporte y Comunicaciones',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '16 may 2025',
    fecha: '2025-05-16',
    motivo: 'Incentiva la movilidad eléctrica y las energías limpias.',
    historial: ['presentados', 'presentados', 'presentados', 'presentados', 'dictamen'],
  },
  {
    pl: 'PL 6123/2024-CR',
    titulo: 'APP para obras regionales',
    tema: 'Infraestructura',
    temaTone: 'bg-chart-5/15 text-chart-5',
    comision: 'Producción, MYPE e Industria',
    probabilidad: 'Media',
    impactoDirecto: 'No',
    impacto: 'Medio',
    alcance: 'Regional',
    estado: 'En dictamen',
    cambio: '13 may 2025',
    fecha: '2025-05-13',
    motivo: 'Impulsa APP para obras regionales.',
    historial: ['presentados', 'presentados', 'presentados', 'dictamen', 'dictamen'],
  },
  {
    pl: 'PL 5210/2024-CR',
    titulo: 'Negociación colectiva',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    comision: 'Trabajo y Seguridad Social',
    probabilidad: 'Media',
    impactoDirecto: 'Sí',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '13 may 2025',
    fecha: '2025-05-13',
    motivo: 'Moderniza la negociación colectiva por rama.',
    historial: ['presentados', 'presentados', 'presentados', 'dictamen', 'dictamen'],
  },
  {
    pl: 'PL 7120/2024-CR',
    titulo: 'Tercerización laboral',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    comision: 'Trabajo y Seguridad Social',
    probabilidad: 'Media',
    impactoDirecto: 'No',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '14 may 2025',
    fecha: '2025-05-14',
    motivo: 'Restringe la tercerización de actividades núcleo.',
    historial: [null, null, 'presentados', 'presentados', 'presentados'],
  },
  {
    pl: 'PL 6402/2024-CR',
    titulo: 'IGV a servicios digitales',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    comision: 'Economía, Banca y Finanzas',
    probabilidad: 'Media',
    impactoDirecto: 'Sí',
    impacto: 'Medio',
    alcance: 'Nacional',
    estado: 'En dictamen',
    cambio: '12 may 2025',
    fecha: '2025-05-12',
    motivo: 'Grava plataformas digitales no domiciliadas.',
    historial: ['presentados', 'presentados', 'dictamen', 'dictamen', 'dictamen'],
  },
  {
    pl: 'PL 6480/2024-CR',
    titulo: 'Concesiones viales',
    tema: 'Infraestructura',
    temaTone: 'bg-chart-5/15 text-chart-5',
    comision: 'Transporte y Comunicaciones',
    probabilidad: 'Media',
    impactoDirecto: 'No',
    impacto: 'Medio',
    alcance: 'Regional',
    estado: 'En dictamen',
    cambio: '12 may 2025',
    fecha: '2025-05-12',
    motivo: 'Revisa reglas de concesiones y peajes.',
    historial: ['presentados', 'presentados', 'presentados', 'dictamen', 'dictamen'],
  },
  {
    pl: 'PL 7001/2024-CR',
    titulo: 'Economía circular',
    tema: 'Ambiente de negocios',
    temaTone: 'bg-success/10 text-success',
    comision: 'Producción, MYPE e Industria',
    probabilidad: 'Baja',
    impactoDirecto: 'Sí',
    impacto: 'Bajo',
    alcance: 'Sectorial',
    estado: 'Presentado',
    cambio: '12 may 2025',
    fecha: '2025-05-12',
    motivo: 'Obliga metas de reciclaje a productores.',
    historial: [null, null, 'presentados', 'presentados', 'presentados'],
  },
  {
    pl: 'PL 6205/2024-CR',
    titulo: 'Zonas económicas especiales',
    tema: 'Competitividad',
    temaTone: 'bg-info/10 text-info',
    comision: 'Producción, MYPE e Industria',
    probabilidad: 'Media',
    impactoDirecto: 'Sí',
    impacto: 'Medio',
    alcance: 'Regional',
    estado: 'En agenda / debate',
    cambio: '06 may 2025',
    fecha: '2025-05-06',
    motivo: 'Crea beneficios tributarios en ZEE.',
    historial: ['presentados', 'presentados', 'dictamen', 'agenda', 'agenda'],
  },
  {
    pl: 'PL 5432/2024-CR',
    titulo: 'Licencias y permisos',
    tema: 'Ambiente de negocios',
    temaTone: 'bg-success/10 text-success',
    comision: 'Descentralización',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Nacional',
    estado: 'Ley aprobada',
    cambio: '08 may 2025',
    fecha: '2025-05-08',
    motivo: 'Simplifica licencias y permisos municipales.',
    historial: ['presentados', 'dictamen', 'agenda', 'leyes', 'leyes'],
  },
  {
    pl: 'PL 4987/2024-CR',
    titulo: 'Detracciones y retenciones',
    tema: 'Tributario',
    temaTone: 'bg-chart-3/15 text-chart-3',
    comision: 'Economía, Banca y Finanzas',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Sectorial',
    estado: 'Ley aprobada',
    cambio: '28 abr 2025',
    fecha: '2025-04-28',
    motivo: 'Ajusta detracciones y retenciones de IGV.',
    historial: ['presentados', 'dictamen', 'leyes', 'leyes', 'leyes'],
  },
  {
    pl: 'PL 4870/2024-CR',
    titulo: 'Teletrabajo y desconexión digital',
    tema: 'Laboral',
    temaTone: 'bg-destructive/10 text-destructive',
    comision: 'Trabajo y Seguridad Social',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Sectorial',
    estado: 'Presentado',
    cambio: '28 abr 2025',
    fecha: '2025-04-28',
    motivo: 'Ajusta reglas de teletrabajo y desconexión.',
    historial: ['presentados', 'presentados', 'presentados', 'presentados', 'presentados'],
  },
  {
    pl: 'PL 6055/2024-CR',
    titulo: 'Saneamiento rural',
    tema: 'Infraestructura',
    temaTone: 'bg-chart-5/15 text-chart-5',
    comision: 'Descentralización',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Regional',
    estado: 'Presentado',
    cambio: '30 abr 2025',
    fecha: '2025-04-30',
    motivo: 'Transfiere obras de saneamiento a municipios.',
    historial: ['presentados', 'presentados', 'presentados', 'presentados', 'presentados'],
  },
  {
    pl: 'PL 5780/2024-CR',
    titulo: 'Interoperabilidad digital del Estado',
    tema: 'Competitividad',
    temaTone: 'bg-info/10 text-info',
    comision: 'Descentralización',
    probabilidad: 'Baja',
    impactoDirecto: 'No',
    impacto: 'Bajo',
    alcance: 'Nacional',
    estado: 'Presentado',
    cambio: '22 abr 2025',
    fecha: '2025-04-22',
    motivo: 'Estandariza trámites digitales entre entidades.',
    historial: ['presentados', 'presentados', 'presentados', 'presentados', 'presentados'],
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
  { key: 'sector', label: 'Sector', all: 'Todos', options: temas.map((t) => t.name) },
  {
    key: 'estado',
    label: 'Estado',
    all: 'Todos',
    options: ['Presentado', 'En dictamen', 'En agenda / debate', 'Ley aprobada'],
  },
  { key: 'probabilidad', label: 'Probabilidad', all: 'Todas', options: ['Alta', 'Media', 'Baja'] },
  { key: 'impacto', label: 'Impacto', all: 'Todos', options: ['Sí', 'No'] },
]

/** Aplica los filtros activos sobre los proyectos transversales. */
export function filtrarProyectos(
  proyectos: ProyectoTransversal[],
  filtros: Record<FiltroKey, string>,
): ProyectoTransversal[] {
  const periodo = periodos.find((p) => p.label === filtros.fecha)

  return proyectos.filter((p) => {
    if (periodo && (p.fecha < periodo.desde || p.fecha > periodo.hasta)) return false
    if (filtros.sector !== 'Todos' && p.tema !== filtros.sector) return false
    if (filtros.estado !== 'Todos' && p.estado !== filtros.estado) return false
    if (filtros.probabilidad !== 'Todas' && p.probabilidad !== filtros.probabilidad) return false
    if (filtros.impacto !== 'Todos' && p.impactoDirecto !== filtros.impacto) return false
    return true
  })
}

export const filtrosIniciales: Record<FiltroKey, string> = {
  fecha: PERIODO,
  sector: 'Todos',
  estado: 'Todos',
  probabilidad: 'Todas',
  impacto: 'Todos',
}

/* ------------------------- foco por indicador (KPI) ----------------------- */

/** Indicador seleccionado; recorta todos los paneles de la vista general. */
export type KpiFoco = 'totales' | 'altaPrioridad' | 'conMovimiento' | 'comision'

export const focosDef: {
  id: KpiFoco
  label: string
  iconKey: IconKey
  tone: string
  hint: string
}[] = [
  {
    id: 'totales',
    label: 'PL en seguimiento',
    iconKey: 'file',
    tone: 'text-info bg-info/10',
    hint: 'Todos los PL del periodo',
  },
  {
    id: 'altaPrioridad',
    label: 'PL de alta probabilidad e impacto directo para el negocio',
    iconKey: 'target',
    tone: 'text-chart-5 bg-chart-5/10',
    hint: 'Probabilidad alta e impacto directo',
  },
  {
    id: 'conMovimiento',
    label: 'Con movimiento esta semana',
    iconKey: 'trending',
    tone: 'text-success bg-success/10',
    hint: 'Cambiaron de etapa en la última semana',
  },
]

/** ¿El PL cambió de etapa en la última semana registrada? */
export function tuvoMovimiento(p: ProyectoTransversal): boolean {
  const n = p.historial.length
  return n > 1 && p.historial[n - 1] !== p.historial[n - 2]
}

/** Etapa previa y actual del PL, o null si no hubo movimiento. */
export function movimientoDe(
  p: ProyectoTransversal,
): { de: Estado; a: Estado } | null {
  if (!tuvoMovimiento(p)) return null
  const n = p.historial.length
  const previa = p.historial[n - 2]
  const actual = p.historial[n - 1]
  if (!actual) return null
  return {
    de: previa ? ETAPA_ESTADO[previa] : 'Presentado',
    a: ETAPA_ESTADO[actual],
  }
}

/** ¿Es un PL de alta probabilidad con impacto directo? */
export function esAltaPrioridad(p: ProyectoTransversal): boolean {
  return p.probabilidad === 'Alta' && p.impactoDirecto === 'Sí'
}

/**
 * Recorta la lista según el indicador seleccionado.
 * `comision` solo se usa cuando el foco es 'comision'.
 */
export function aplicarFoco(
  proyectos: ProyectoTransversal[],
  foco: KpiFoco,
  comision?: string | null,
): ProyectoTransversal[] {
  if (foco === 'altaPrioridad') return proyectos.filter(esAltaPrioridad)
  if (foco === 'conMovimiento') return proyectos.filter(tuvoMovimiento)
  if (foco === 'comision') {
    return comision ? proyectos.filter((p) => p.comision === comision) : proyectos
  }
  return proyectos
}

/** Valor de cada indicador para el conjunto de PL recibido. */
export function valorFoco(
  proyectos: ProyectoTransversal[],
  foco: KpiFoco,
  comision?: string | null,
): number {
  return aplicarFoco(proyectos, foco, comision).length
}

/* --------------------------- detalle (2do nivel) -------------------------- */

/**
 * Selección fina dentro del conjunto del KPI: un sector (desde la tabla de
 * concentración) o un PL puntual (desde el mapa de priorización).
 */
export type Detalle =
  | { tipo: 'sector'; valor: string }
  | { tipo: 'pl'; valor: string }
  | null

/** Recorta el conjunto al sector o al PL seleccionado. */
export function aplicarDetalle(
  proyectos: ProyectoTransversal[],
  detalle: Detalle,
): ProyectoTransversal[] {
  if (!detalle) return proyectos
  if (detalle.tipo === 'sector') return proyectos.filter((p) => p.tema === detalle.valor)
  return proyectos.filter((p) => p.pl === detalle.valor)
}

/** Sector que debe quedar marcado en la tabla de concentración. */
export function sectorMarcado(
  proyectos: ProyectoTransversal[],
  detalle: Detalle,
): string | null {
  if (!detalle) return null
  if (detalle.tipo === 'sector') return detalle.valor
  return proyectos.find((p) => p.pl === detalle.valor)?.tema ?? null
}

/* ---------------------------- paneles derivados --------------------------- */

export interface ResumenSector {
  sector: string
  dot: string
  bar: string
  total: number
  si: number
  no: number
}

/** Concentración por sector: total de PL y cuántos tienen impacto directo. */
export function resumenSectores(proyectos: ProyectoTransversal[]): ResumenSector[] {
  const mapa = new Map<string, ResumenSector>()

  for (const p of proyectos) {
    const meta = SECTOR_META[p.tema]
    const actual =
      mapa.get(p.tema) ??
      {
        sector: p.tema,
        dot: meta?.dot ?? 'bg-muted-foreground',
        bar: meta?.bar ?? 'bg-info',
        total: 0,
        si: 0,
        no: 0,
      }
    actual.total += 1
    if (p.impactoDirecto === 'Sí') actual.si += 1
    else actual.no += 1
    mapa.set(p.tema, actual)
  }

  return [...mapa.values()].sort((a, b) => b.total - a.total || a.sector.localeCompare(b.sector))
}

export interface PuntoEvolucion {
  semana: string
  presentados: number
  dictamen: number
  agenda: number
  leyes: number
}

/** Evolución semanal por etapa, contada sobre los PL recibidos. */
export function evolucionDesde(proyectos: ProyectoTransversal[]): PuntoEvolucion[] {
  return semanas.map((semana, i) => {
    const punto: PuntoEvolucion = { semana, presentados: 0, dictamen: 0, agenda: 0, leyes: 0 }
    for (const p of proyectos) {
      const etapa = p.historial[i]
      if (etapa) punto[etapa] += 1
    }
    return punto
  })
}

export const PROBABILIDADES: Probabilidad[] = ['Alta', 'Media', 'Baja']
export const IMPACTOS_DIRECTOS: ImpactoDirecto[] = ['No', 'Sí']

/** Nivel de atención de un PL dentro del mapa de priorización. */
export type Atencion = 'alta' | 'cercano' | 'regular'

export function atencionDe(p: ProyectoTransversal): Atencion {
  if (esAltaPrioridad(p)) return 'alta'
  if (p.probabilidad === 'Alta' || p.impactoDirecto === 'Sí') return 'cercano'
  return 'regular'
}

export const ATENCION_META: Record<Atencion, { label: string; dot: string }> = {
  alta: { label: 'Alta atención', dot: 'bg-destructive' },
  cercano: { label: 'Monitoreo cercano', dot: 'bg-chart-3' },
  regular: { label: 'Seguimiento regular', dot: 'bg-success' },
}

/** Matriz probabilidad × impacto directo con los PL de cada celda. */
export function matrizPriorizacion(proyectos: ProyectoTransversal[]) {
  return PROBABILIDADES.map((probabilidad) => ({
    probabilidad,
    celdas: IMPACTOS_DIRECTOS.map((impactoDirecto) => ({
      impactoDirecto,
      proyectos: proyectos.filter(
        (p) => p.probabilidad === probabilidad && p.impactoDirecto === impactoDirecto,
      ),
    })),
  }))
}

/** Comisión con más PL en el conjunto recibido. */
export function comisionTop(
  proyectos: ProyectoTransversal[],
): { nombre: string; total: number } | null {
  const conteo = new Map<string, number>()
  for (const p of proyectos) conteo.set(p.comision, (conteo.get(p.comision) ?? 0) + 1)

  let top: { nombre: string; total: number } | null = null
  for (const [nombre, total] of conteo) {
    if (!top || total > top.total) top = { nombre, total }
  }
  return top
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
