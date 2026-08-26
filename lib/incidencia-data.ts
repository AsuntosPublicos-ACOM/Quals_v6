/**
 * Datos del dashboard de Incidencia parlamentaria.
 *
 * El congresista es la unidad base: todos los agregados (KPIs, bancadas,
 * concentración por comisión y comisiones críticas) se derivan del conjunto
 * de congresistas visible, de modo que cualquier selección arrastra al resto
 * de los paneles igual que en la pestaña General.
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
      'Salazar Ríos Pedro',
      'Quispe Mamani Rosa',
      'Herrera Vásquez Carlos',
      'Chávez Núñez Lucía',
      'Paredes Loayza Miguel',
      'Ramos Coronel Elena',
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
  { key: 'impacto', label: 'Impacto', all: 'Todos', options: ['Sí', 'No'] },
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

/* ------------------------------- comisiones ------------------------------- */

/** Metadatos estables de cada comisión; el conteo de PL siempre se deriva. */
export interface ComisionMeta {
  comision: string
  riesgo: Riesgo
  prioridad: Prioridad
}

export const comisionesMeta: ComisionMeta[] = [
  { comision: 'Trabajo y Seguridad Social', riesgo: 'Crítico', prioridad: 'Alta' },
  { comision: 'Economía, Banca y Finanzas', riesgo: 'Crítico', prioridad: 'Alta' },
  { comision: 'Producción', riesgo: 'Alto', prioridad: 'Media' },
  { comision: 'Transportes y Comunicaciones', riesgo: 'Medio', prioridad: 'Baja' },
  { comision: 'Educación', riesgo: 'Medio', prioridad: 'Media' },
  { comision: 'Energía y Minas', riesgo: 'Alto', prioridad: 'Media' },
]

const metaDe = (comision: string) => comisionesMeta.find((c) => c.comision === comision)

/* -------------------------------- bancadas -------------------------------- */

/** Color de cada bancada en el donut; se usa tal cual en Recharts. */
export const coloresBancada: Record<string, string> = {
  'Fuerza Popular': 'var(--color-chart-1)',
  'Alianza para el Progreso': 'var(--color-chart-3)',
  'Renovación Popular': 'var(--color-chart-2)',
  'Juntos por el Perú': 'var(--color-chart-5)',
  'Podemos Perú': 'var(--color-chart-4)',
  'Acción Popular': 'var(--color-muted-foreground)',
}

const COLOR_OTROS = 'var(--color-muted-foreground)'

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

/** Reparto de los PL del congresista entre las comisiones donde tiene carga. */
export interface CargaComision {
  comision: string
  pl: number
}

/** El impacto se declara como directo o no, igual que en la pestaña General. */
export type ImpactoDirecto = 'Sí' | 'No'
export type NivelF = 'Alta' | 'Media' | 'Baja'
export type Alcance = 'Nacional' | 'Regional' | 'Sectorial'

export interface CongresistaIncidencia {
  id: string
  nombre: string
  iniciales: string
  region: string
  bancada: string
  /** Sector principal del congresista (antes "tema principal"). */
  sectorPrincipal: string
  sectores: string[]
  plCriticos: number
  comisiones: CargaComision[]
  /** ¿Su agenda tiene impacto directo para el negocio? */
  impacto: ImpactoDirecto
  probabilidad: NivelF
  alcance: Alcance
  prioridad: Prioridad
  historial: HistorialItem[]
  proyectos: ProyectoVinculado[]
}

export const congresistasIncidencia: CongresistaIncidencia[] = [
  {
    id: 'villanueva',
    nombre: 'Villanueva Juan',
    iniciales: 'VJ',
    region: 'Cajamarca',
    bancada: 'Juntos por el Perú',
    sectorPrincipal: 'Laboral, MYPE',
    sectores: ['Laboral', 'MYPE', 'Formalización'],
    plCriticos: 6,
    comisiones: [
      { comision: 'Trabajo y Seguridad Social', pl: 4 },
      { comision: 'Producción', pl: 2 },
    ],
    impacto: 'Sí',
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
    id: 'salazar',
    nombre: 'Salazar Ríos Pedro',
    iniciales: 'SR',
    region: 'Lima',
    bancada: 'Fuerza Popular',
    sectorPrincipal: 'Tributario, Laboral',
    sectores: ['Tributario', 'Laboral', 'Competitividad'],
    plCriticos: 7,
    comisiones: [
      { comision: 'Economía, Banca y Finanzas', pl: 4 },
      { comision: 'Trabajo y Seguridad Social', pl: 3 },
    ],
    impacto: 'Sí',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    prioridad: 'Alta',
    historial: [
      { fecha: '24/05/2025', detalle: 'Presentó predictamen sobre régimen tributario MYPE.' },
      { fecha: '21/05/2025', detalle: 'Presidió sesión de la Comisión de Economía.' },
    ],
    proyectos: [
      { pl: 'PL 4455/2024-CR', titulo: 'Régimen tributario simplificado MYPE', estado: 'Dictamen' },
      { pl: 'PL 3344/2024-CR', titulo: 'Deducciones por contratación formal', estado: 'En comisión' },
    ],
  },
  {
    id: 'lopez',
    nombre: 'López García Luis',
    iniciales: 'LG',
    region: 'Piura',
    bancada: 'Fuerza Popular',
    sectorPrincipal: 'Energía',
    sectores: ['Energía', 'Infraestructura'],
    plCriticos: 5,
    comisiones: [
      { comision: 'Energía y Minas', pl: 3 },
      { comision: 'Transportes y Comunicaciones', pl: 2 },
    ],
    impacto: 'No',
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
    id: 'herrera',
    nombre: 'Herrera Vásquez Carlos',
    iniciales: 'HV',
    region: 'Arequipa',
    bancada: 'Alianza para el Progreso',
    sectorPrincipal: 'Competitividad',
    sectores: ['Competitividad', 'MYPE', 'Tributario'],
    plCriticos: 5,
    comisiones: [
      { comision: 'Economía, Banca y Finanzas', pl: 3 },
      { comision: 'Producción', pl: 2 },
    ],
    impacto: 'Sí',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    prioridad: 'Alta',
    historial: [
      { fecha: '23/05/2025', detalle: 'Sustentó PL de estabilidad jurídica para inversiones.' },
      { fecha: '19/05/2025', detalle: 'Pidió priorizar el debate sobre compras públicas MYPE.' },
    ],
    proyectos: [
      { pl: 'PL 6301/2024-CR', titulo: 'Competitividad y estabilidad jurídica', estado: 'Dictamen' },
      { pl: 'PL 6650/2024-CR', titulo: 'Compras públicas MYPE', estado: 'En comisión' },
    ],
  },
  {
    id: 'rocha',
    nombre: 'Rocha Roxana',
    iniciales: 'RR',
    region: 'Lima',
    bancada: 'Renovación Popular',
    sectorPrincipal: 'Educación, Tributario',
    sectores: ['Educación', 'Tributario'],
    plCriticos: 4,
    comisiones: [
      { comision: 'Economía, Banca y Finanzas', pl: 2 },
      { comision: 'Educación', pl: 2 },
    ],
    impacto: 'Sí',
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
    id: 'ramos',
    nombre: 'Ramos Coronel Elena',
    iniciales: 'RC',
    region: 'Junín',
    bancada: 'Fuerza Popular',
    sectorPrincipal: 'Laboral, Tributario',
    sectores: ['Laboral', 'Tributario'],
    plCriticos: 4,
    comisiones: [
      { comision: 'Trabajo y Seguridad Social', pl: 2 },
      { comision: 'Economía, Banca y Finanzas', pl: 2 },
    ],
    impacto: 'Sí',
    probabilidad: 'Alta',
    alcance: 'Nacional',
    prioridad: 'Alta',
    historial: [
      { fecha: '22/05/2025', detalle: 'Votó a favor del predictamen de jornada laboral.' },
      { fecha: '15/05/2025', detalle: 'Solicitó opinión técnica del MTPE sobre tercerización.' },
    ],
    proyectos: [
      { pl: 'PL 6910/2024-CR', titulo: 'Jornada laboral de 40 horas', estado: 'Dictamen' },
      { pl: 'PL 7120/2024-CR', titulo: 'Tercerización laboral', estado: 'En comisión' },
    ],
  },
  {
    id: 'quispe',
    nombre: 'Quispe Mamani Rosa',
    iniciales: 'QM',
    region: 'Puno',
    bancada: 'Renovación Popular',
    sectorPrincipal: 'MYPE, Educación',
    sectores: ['MYPE', 'Educación', 'Formalización'],
    plCriticos: 4,
    comisiones: [
      { comision: 'Producción', pl: 2 },
      { comision: 'Educación', pl: 2 },
    ],
    impacto: 'Sí',
    probabilidad: 'Media',
    alcance: 'Regional',
    prioridad: 'Media',
    historial: [
      { fecha: '20/05/2025', detalle: 'Sustentó PL de formalización de pequeños productores.' },
      { fecha: '13/05/2025', detalle: 'Participó en sesión de la Comisión de Producción.' },
    ],
    proyectos: [
      { pl: 'PL 5511/2024-CR', titulo: 'Formalización de pequeños productores', estado: 'En comisión' },
      { pl: 'PL 5120/2024-CR', titulo: 'Becas para educación técnica', estado: 'Dictamen' },
    ],
  },
  {
    id: 'martinez',
    nombre: 'Martínez Bravo María',
    iniciales: 'MB',
    region: 'La Libertad',
    bancada: 'Alianza para el Progreso',
    sectorPrincipal: 'Laboral',
    sectores: ['Laboral', 'Salud'],
    plCriticos: 3,
    comisiones: [{ comision: 'Trabajo y Seguridad Social', pl: 3 }],
    impacto: 'No',
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
    id: 'chavez',
    nombre: 'Chávez Núñez Lucía',
    iniciales: 'CN',
    region: 'Cusco',
    bancada: 'Juntos por el Perú',
    sectorPrincipal: 'Laboral, Educación',
    sectores: ['Laboral', 'Educación'],
    plCriticos: 3,
    comisiones: [
      { comision: 'Trabajo y Seguridad Social', pl: 2 },
      { comision: 'Educación', pl: 1 },
    ],
    impacto: 'No',
    probabilidad: 'Alta',
    alcance: 'Sectorial',
    prioridad: 'Media',
    historial: [
      { fecha: '21/05/2025', detalle: 'Firmó predictamen sobre negociación colectiva.' },
      { fecha: '14/05/2025', detalle: 'Participó en sesión conjunta de Trabajo y Educación.' },
    ],
    proyectos: [
      { pl: 'PL 5210/2024-CR', titulo: 'Negociación colectiva', estado: 'En comisión' },
      { pl: 'PL 4900/2024-CR', titulo: 'Carrera pública magisterial', estado: 'Dictamen' },
    ],
  },
  {
    id: 'paredes',
    nombre: 'Paredes Loayza Miguel',
    iniciales: 'PL',
    region: 'Ica',
    bancada: 'Podemos Perú',
    sectorPrincipal: 'Infraestructura',
    sectores: ['Infraestructura', 'Energía', 'Transporte'],
    plCriticos: 3,
    comisiones: [
      { comision: 'Energía y Minas', pl: 2 },
      { comision: 'Transportes y Comunicaciones', pl: 1 },
    ],
    impacto: 'No',
    probabilidad: 'Baja',
    alcance: 'Regional',
    prioridad: 'Baja',
    historial: [
      { fecha: '19/05/2025', detalle: 'Sustentó PL de concesiones viales regionales.' },
      { fecha: '12/05/2025', detalle: 'Solicitó información al MTC sobre obras paralizadas.' },
    ],
    proyectos: [
      { pl: 'PL 6480/2024-CR', titulo: 'Concesiones viales', estado: 'En comisión' },
      { pl: 'PL 6123/2024-CR', titulo: 'APP para obras regionales', estado: 'Dictamen' },
    ],
  },
  {
    id: 'alva',
    nombre: 'Alva Prieto Ana',
    iniciales: 'AP',
    region: 'Áncash',
    bancada: 'Acción Popular',
    sectorPrincipal: 'Transporte',
    sectores: ['Transporte', 'Competitividad'],
    plCriticos: 2,
    comisiones: [{ comision: 'Transportes y Comunicaciones', pl: 2 }],
    impacto: 'No',
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

/* ------------------------------- filtrado --------------------------------- */

/** Aplica los filtros del encabezado; un filtro vacío no descarta a nadie. */
export function filtrarCongresistas(
  congresistas: CongresistaIncidencia[],
  filtros: Record<FiltroIncidenciaKey, string[]>,
): CongresistaIncidencia[] {
  const coincide = (key: FiltroIncidenciaKey, valores: string[]) => {
    const sel = Array.isArray(filtros[key]) ? filtros[key] : []
    return sel.length === 0 || valores.some((v) => sel.includes(v))
  }

  return congresistas.filter(
    (c) =>
      coincide('nombre', [c.nombre]) &&
      coincide('sector', c.sectores) &&
      coincide('alcance', [c.alcance]) &&
      coincide('impacto', [c.impacto]) &&
      coincide('probabilidad', [c.probabilidad]),
  )
}

/* ---------------------------------- KPIs ---------------------------------- */

/** KPI activo: define el conjunto que arrastra a todos los paneles. */
export type FocoIncidencia = 'todos' | 'comisiones' | 'impacto' | 'bancadas'

export interface FocoIncidenciaDef {
  id: FocoIncidencia
  label: string
  /** Explica qué recorta el KPI; se muestra bajo la cifra. */
  hint: string
  iconKey: 'user' | 'users' | 'file' | 'group'
  tone: string
}

export const focosIncidenciaDef: FocoIncidenciaDef[] = [
  {
    id: 'todos',
    label: 'Congresistas en seguimiento',
    hint: 'Todos los del periodo',
    iconKey: 'user',
    tone: 'bg-destructive/10 text-destructive',
  },
  {
    id: 'comisiones',
    label: 'En comisiones críticas',
    hint: 'Con PL en comisiones de riesgo crítico',
    iconKey: 'users',
    tone: 'bg-chart-4/15 text-chart-4',
  },
  {
    id: 'impacto',
    label: 'Alta probabilidad e impacto',
    hint: 'Impacto directo y probabilidad alta',
    iconKey: 'file',
    tone: 'bg-chart-3/15 text-chart-3',
  },
  {
    id: 'bancadas',
    label: 'En bancadas relevantes',
    hint: 'Bancadas con mayor actividad legislativa',
    iconKey: 'group',
    tone: 'bg-chart-2/15 text-chart-2',
  },
]

/** Una bancada es relevante si concentra al menos esta cuota de los PL. */
const CUOTA_BANCADA_RELEVANTE = 0.15

/** Bancadas que concentran la actividad legislativa del conjunto. */
export function bancadasRelevantes(congresistas: CongresistaIncidencia[]): string[] {
  const total = congresistas.reduce((acc, c) => acc + c.plCriticos, 0)
  if (total === 0) return []

  const porBancada = new Map<string, number>()
  for (const c of congresistas) {
    porBancada.set(c.bancada, (porBancada.get(c.bancada) ?? 0) + c.plCriticos)
  }

  return [...porBancada.entries()]
    .filter(([, pl]) => pl / total >= CUOTA_BANCADA_RELEVANTE)
    .map(([nombre]) => nombre)
}

/**
 * Combinación que define un PL crítico: impacto directo y probabilidad alta.
 * Se usa para el KPI y para resaltar esos PL en la concentración por comisión.
 */
export const esCriticoIncidencia = (c: CongresistaIncidencia) =>
  c.impacto === 'Sí' && c.probabilidad === 'Alta'

/** ¿Tiene carga en alguna comisión de riesgo crítico? */
const enComisionCritica = (c: CongresistaIncidencia) =>
  c.comisiones.some((cc) => metaDe(cc.comision)?.riesgo === 'Crítico')

/** Recorta el conjunto al KPI activo. */
export function aplicarFocoIncidencia(
  congresistas: CongresistaIncidencia[],
  foco: FocoIncidencia,
): CongresistaIncidencia[] {
  switch (foco) {
    case 'comisiones':
      return congresistas.filter(enComisionCritica)
    case 'impacto':
      return congresistas.filter(esCriticoIncidencia)
    case 'bancadas': {
      const relevantes = new Set(bancadasRelevantes(congresistas))
      return congresistas.filter((c) => relevantes.has(c.bancada))
    }
    default:
      return congresistas
  }
}

/** Cifra de cada KPI: el tamaño del conjunto que selecciona. */
export function conteosFoco(
  congresistas: CongresistaIncidencia[],
): Record<FocoIncidencia, number> {
  return {
    todos: congresistas.length,
    comisiones: aplicarFocoIncidencia(congresistas, 'comisiones').length,
    impacto: aplicarFocoIncidencia(congresistas, 'impacto').length,
    bancadas: aplicarFocoIncidencia(congresistas, 'bancadas').length,
  }
}

/* -------------------------------- detalle --------------------------------- */

/**
 * Selección fina dentro del conjunto del KPI: una bancada (desde el donut) o
 * una comisión (desde las barras de concentración).
 */
export type DetalleIncidencia =
  | { tipo: 'bancada'; valor: string }
  | { tipo: 'comision'; valor: string }
  | null

/** Recorta el conjunto a la bancada o comisión seleccionada. */
export function aplicarDetalleIncidencia(
  congresistas: CongresistaIncidencia[],
  detalle: DetalleIncidencia,
): CongresistaIncidencia[] {
  if (!detalle) return congresistas
  if (detalle.tipo === 'bancada') return congresistas.filter((c) => c.bancada === detalle.valor)
  return congresistas.filter((c) => c.comisiones.some((cc) => cc.comision === detalle.valor))
}

/* -------------------------- agregados derivados --------------------------- */

export interface SegmentoBancada {
  nombre: string
  pl: number
  /** Participación sobre el total de PL del conjunto, con un decimal. */
  porcentaje: number
  color: string
  /** Las bancadas menores se agrupan y no son seleccionables. */
  esOtros: boolean
  /** Bancadas agrupadas bajo "Otros". */
  incluye: string[]
}

/** Cuántas bancadas se muestran por separado antes de agrupar en "Otros". */
const MAX_SEGMENTOS = 5

/** Reparto de PL por bancada, con las menores agrupadas en "Otros". */
export function resumenBancadas(congresistas: CongresistaIncidencia[]): SegmentoBancada[] {
  const porBancada = new Map<string, number>()
  for (const c of congresistas) {
    porBancada.set(c.bancada, (porBancada.get(c.bancada) ?? 0) + c.plCriticos)
  }

  const total = [...porBancada.values()].reduce((a, b) => a + b, 0)
  if (total === 0) return []

  const pct = (pl: number) => Math.round((pl / total) * 1000) / 10
  const ordenadas = [...porBancada.entries()].sort((a, b) => b[1] - a[1])
  const principales = ordenadas.slice(0, MAX_SEGMENTOS)
  const resto = ordenadas.slice(MAX_SEGMENTOS)

  const segmentos: SegmentoBancada[] = principales.map(([nombre, pl]) => ({
    nombre,
    pl,
    porcentaje: pct(pl),
    color: coloresBancada[nombre] ?? COLOR_OTROS,
    esOtros: false,
    incluye: [nombre],
  }))

  if (resto.length > 0) {
    const pl = resto.reduce((acc, [, n]) => acc + n, 0)
    segmentos.push({
      nombre: 'Otros',
      pl,
      porcentaje: pct(pl),
      color: COLOR_OTROS,
      esOtros: true,
      incluye: resto.map(([nombre]) => nombre),
    })
  }

  return segmentos
}

/** Total de PL del conjunto: la cifra central del donut. */
export function totalPl(congresistas: CongresistaIncidencia[]): number {
  return congresistas.reduce((acc, c) => acc + c.plCriticos, 0)
}

export interface ConcentracionComision {
  comision: string
  pl: number
  /** PL de congresistas con impacto directo y probabilidad alta. */
  plCriticos: number
  /** Resto de PL de la comisión. */
  plResto: number
  riesgo: Riesgo
  prioridad: Prioridad
}

/** PL por comisión, de mayor a menor, separando los PL críticos del resto. */
export function resumenComisiones(
  congresistas: CongresistaIncidencia[],
): ConcentracionComision[] {
  const porComision = new Map<string, { criticos: number; resto: number }>()
  for (const c of congresistas) {
    const critico = esCriticoIncidencia(c)
    for (const cc of c.comisiones) {
      const acc = porComision.get(cc.comision) ?? { criticos: 0, resto: 0 }
      if (critico) acc.criticos += cc.pl
      else acc.resto += cc.pl
      porComision.set(cc.comision, acc)
    }
  }

  return [...porComision.entries()]
    .map(([comision, { criticos, resto }]) => ({
      comision,
      pl: criticos + resto,
      plCriticos: criticos,
      plResto: resto,
      riesgo: metaDe(comision)?.riesgo ?? 'Medio',
      prioridad: metaDe(comision)?.prioridad ?? 'Baja',
    }))
    .sort((a, b) => b.pl - a.pl || a.comision.localeCompare(b.comision))
}
