/**
 * Datos del dashboard de Incidencia parlamentaria.
 * Fuente única compartida por la vista y (a futuro) las exportaciones.
 */

export const PERIODO_INCIDENCIA = '19/05/2025 - 25/05/2025'
export const ACTUALIZADO_INCIDENCIA = '25/05/2025 11:30 am'

export type Prioridad = 'Alta' | 'Media' | 'Baja'
export type Riesgo = 'Crítico' | 'Alto' | 'Medio'

/* --------------------------------- filtros -------------------------------- */

export type FiltroIncidenciaKey =
  | 'fecha'
  | 'nombre'
  | 'sector'
  | 'alcance'
  | 'impacto'
  | 'probabilidad'

export interface FiltroIncidenciaDef {
  key: FiltroIncidenciaKey
  label: string
  /** Etiqueta que se muestra cuando no hay ninguna opción seleccionada. */
  all: string
  options: string[]
}

export const filtrosIncidenciaDef: FiltroIncidenciaDef[] = [
  {
    key: 'fecha',
    label: 'Fecha',
    all: PERIODO_INCIDENCIA,
    options: [PERIODO_INCIDENCIA, '12/05/2025 - 18/05/2025', 'Mayo 2025', 'Últimos 90 días'],
  },
  {
    key: 'nombre',
    label: 'Nombre',
    all: 'Todos',
    options: [
      'Villanueva Juan',
      'Rocha Roxana',
      'López García Luis',
      'Martínez Bravo María',
      'Alva Prieto Ana',
    ],
  },
  {
    key: 'sector',
    label: 'Sector',
    all: 'Todos',
    options: [
      'Laboral',
      'Tributario',
      'Competitividad',
      'MYPE',
      'Infraestructura',
      'Energía',
      'Educación',
      'Transporte',
      'Salud',
      'Formalización',
    ],
  },
  { key: 'alcance', label: 'Alcance', all: 'Todos', options: ['Nacional', 'Regional', 'Sectorial'] },
  { key: 'impacto', label: 'Impacto', all: 'Todos', options: ['Alto', 'Medio', 'Bajo'] },
  { key: 'probabilidad', label: 'Probabilidad', all: 'Todos', options: ['Alta', 'Media', 'Baja'] },
]

/** Cada filtro admite varias opciones a la vez; un arreglo vacío equivale a "todos". */
export const filtrosIncidenciaIniciales: Record<FiltroIncidenciaKey, string[]> = {
  fecha: [PERIODO_INCIDENCIA],
  nombre: [],
  sector: [],
  alcance: [],
  impacto: [],
  probabilidad: [],
}

/* ---------------------------------- KPIs ---------------------------------- */

export interface KpiIncidencia {
  label: string
  value: string
  delta: string
  trend: 'up' | 'flat'
  iconKey: 'user' | 'users' | 'file' | 'group'
  tone: string
}

export const kpisIncidencia: KpiIncidencia[] = [
  {
    label: 'Top congresistas',
    value: '124',
    delta: '+12',
    trend: 'up',
    iconKey: 'user',
    tone: 'bg-destructive/10 text-destructive',
  },
  {
    label: 'Comisiones críticas',
    value: '3',
    delta: 'sin cambios',
    trend: 'flat',
    iconKey: 'users',
    tone: 'bg-chart-4/15 text-chart-4',
  },
  {
    label: 'PL de alto impacto',
    value: '7',
    delta: '+2',
    trend: 'up',
    iconKey: 'file',
    tone: 'bg-chart-3/15 text-chart-3',
  },
  {
    label: 'Bancadas relevantes',
    value: '8',
    delta: '+1',
    trend: 'up',
    iconKey: 'group',
    tone: 'bg-chart-2/15 text-chart-2',
  },
]

/* ---------------------------- top congresistas ---------------------------- */

export interface HistorialItem {
  fecha: string
  detalle: string
}

export interface ProyectoVinculado {
  pl: string
  titulo: string
  estado: 'En comisión' | 'Aprobado' | 'Dictamen'
}

export type Nivel = 'Alto' | 'Medio' | 'Bajo'
export type NivelF = 'Alta' | 'Media' | 'Baja'
export type Alcance = 'Nacional' | 'Regional' | 'Sectorial'

export interface CongresistaIncidencia {
  id: string
  rank: number
  nombre: string
  iniciales: string
  region: string
  bancada: string
  /** Sector principal del congresista (antes "tema principal"). */
  sectorPrincipal: string
  sectores: string[]
  plCriticos: number
  impacto: Nivel
  probabilidad: NivelF
  alcance: Alcance
  prioridad: Prioridad
  historial: HistorialItem[]
  proyectos: ProyectoVinculado[]
}

export const congresistasIncidencia: CongresistaIncidencia[] = [
  {
    id: 'villanueva',
    rank: 1,
    nombre: 'Villanueva Juan',
    iniciales: 'VJ',
    region: 'Cajamarca',
    bancada: 'Juntos por el Perú',
    sectorPrincipal: 'Laboral, MYPE',
    sectores: ['Laboral', 'MYPE', 'Formalización'],
    plCriticos: 6,
    impacto: 'Alto',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    prioridad: 'Alta',
    historial: [
      { fecha: '23/05/2025', detalle: 'Votó a favor del PL sobre formalización laboral en MYPE.' },
      { fecha: '20/05/2025', detalle: 'Participó en sesión de la Comisión de Trabajo y SS.' },
      { fecha: '16/05/2025', detalle: 'Sustentó proyecto sobre incentivos para empleo juvenil.' },
    ],
    proyectos: [
      { pl: 'PL 1234/2024-CR', titulo: 'Incentivos para empleo juvenil', estado: 'En comisión' },
      { pl: 'PL 9876/2023-CR', titulo: 'Formalización laboral en MYPE', estado: 'Aprobado' },
      { pl: 'PL 5678/2023-CR', titulo: 'Simplificación de regímenes laborales', estado: 'Dictamen' },
    ],
  },
  {
    id: 'rocha',
    rank: 2,
    nombre: 'Rocha Roxana',
    iniciales: 'RR',
    region: 'Lima',
    bancada: 'Renovación Popular',
    sectorPrincipal: 'Educación, Tributario',
    sectores: ['Educación', 'Tributario'],
    plCriticos: 4,
    impacto: 'Alto',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    prioridad: 'Media',
    historial: [
      { fecha: '22/05/2025', detalle: 'Presentó dictamen sobre deducciones tributarias educativas.' },
      { fecha: '19/05/2025', detalle: 'Intervino en debate del Pleno sobre gasto educativo.' },
      { fecha: '14/05/2025', detalle: 'Solicitó información al MEF sobre exoneraciones vigentes.' },
    ],
    proyectos: [
      { pl: 'PL 4321/2024-CR', titulo: 'Deducción de gastos educativos', estado: 'Dictamen' },
      { pl: 'PL 3210/2024-CR', titulo: 'Infraestructura escolar en regiones', estado: 'En comisión' },
    ],
  },
  {
    id: 'lopez',
    rank: 3,
    nombre: 'López García Luis',
    iniciales: 'LG',
    region: 'Piura',
    bancada: 'Fuerza Popular',
    sectorPrincipal: 'Energía',
    sectores: ['Energía', 'Infraestructura'],
    plCriticos: 5,
    impacto: 'Medio',
    probabilidad: 'Alta',
    alcance: 'Regional',
    prioridad: 'Alta',
    historial: [
      { fecha: '21/05/2025', detalle: 'Presidió sesión sobre tarifas eléctricas regionales.' },
      { fecha: '17/05/2025', detalle: 'Firmó predictamen sobre masificación del gas natural.' },
    ],
    proyectos: [
      { pl: 'PL 7788/2024-CR', titulo: 'Masificación del gas natural', estado: 'En comisión' },
      { pl: 'PL 6655/2023-CR', titulo: 'Tarifas eléctricas para zonas rurales', estado: 'Aprobado' },
    ],
  },
  {
    id: 'martinez',
    rank: 4,
    nombre: 'Martínez Bravo María',
    iniciales: 'MB',
    region: 'La Libertad',
    bancada: 'Alianza para el Progreso',
    sectorPrincipal: 'Laboral',
    sectores: ['Laboral', 'Salud'],
    plCriticos: 3,
    impacto: 'Medio',
    probabilidad: 'Media',
    alcance: 'Sectorial',
    prioridad: 'Media',
    historial: [
      { fecha: '20/05/2025', detalle: 'Votó en contra del PL de negociación colectiva.' },
      { fecha: '13/05/2025', detalle: 'Pidió ampliar el debate sobre jornada laboral atípica.' },
    ],
    proyectos: [
      { pl: 'PL 2468/2024-CR', titulo: 'Jornada laboral atípica', estado: 'Dictamen' },
      { pl: 'PL 1357/2024-CR', titulo: 'Seguridad y salud en el trabajo', estado: 'En comisión' },
    ],
  },
  {
    id: 'alva',
    rank: 5,
    nombre: 'Alva Prieto Ana',
    iniciales: 'AP',
    region: 'Áncash',
    bancada: 'Acción Popular',
    sectorPrincipal: 'Transporte',
    sectores: ['Transporte', 'Competitividad'],
    plCriticos: 2,
    impacto: 'Bajo',
    probabilidad: 'Baja',
    alcance: 'Regional',
    prioridad: 'Baja',
    historial: [
      { fecha: '18/05/2025', detalle: 'Sustentó proyecto de renovación del parque automotor.' },
      { fecha: '12/05/2025', detalle: 'Asistió a sesión de la Comisión de Transportes.' },
    ],
    proyectos: [
      { pl: 'PL 8080/2024-CR', titulo: 'Renovación del parque automotor', estado: 'En comisión' },
    ],
  },
]

/* --------------------------------- bancadas ------------------------------- */

export interface BancadaIncidencia {
  nombre: string
  plPresentados: number
  /** Participación sobre el total de PL presentados en el periodo. */
  porcentaje: number
  color: string
}

export const bancadasIncidencia: BancadaIncidencia[] = [
  { nombre: 'Fuerza Popular', plPresentados: 124, porcentaje: 32, color: 'bg-chart-1' },
  { nombre: 'Renovación Popular', plPresentados: 98, porcentaje: 25, color: 'bg-chart-1/80' },
  { nombre: 'Alianza para el Progreso', plPresentados: 62, porcentaje: 16, color: 'bg-chart-1/60' },
  { nombre: 'Podemos Perú', plPresentados: 32, porcentaje: 8, color: 'bg-chart-1/45' },
]

/* ----------------------------- concentración ------------------------------ */

export interface TemaConcentracion {
  name: string
  value: number
  color: string
}

export const TOTAL_PL_VINCULADOS = 272

export const concentracionPorTema: TemaConcentracion[] = [
  { name: 'Laboral', value: 34, color: 'var(--color-chart-1)' },
  { name: 'Tributario', value: 22, color: 'var(--color-chart-2)' },
  { name: 'Competitividad', value: 18, color: 'var(--color-chart-3)' },
  { name: 'MYPE', value: 14, color: 'var(--color-chart-4)' },
  { name: 'Infraestructura', value: 12, color: 'var(--color-muted-foreground)' },
]

/* --------------------------- comisiones críticas -------------------------- */

export interface ComisionCritica {
  comision: string
  plVinculados: number
  riesgo: Riesgo
  prioridad: Prioridad
}

export const comisionesCriticas: ComisionCritica[] = [
  { comision: 'Trabajo y Seguridad Social', plVinculados: 7, riesgo: 'Crítico', prioridad: 'Alta' },
  { comision: 'Economía Banca y Finanzas', plVinculados: 6, riesgo: 'Alto', prioridad: 'Media' },
  { comision: 'Producción', plVinculados: 3, riesgo: 'Medio', prioridad: 'Baja' },
]
