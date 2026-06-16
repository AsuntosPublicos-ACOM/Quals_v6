import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  ImageRun,
} from 'docx'
import type { Congresista, ProyectoLey } from '@/lib/types'

export type ExportSection =
  | 'info'
  | 'perfil'
  | 'estadisticas'
  | 'graficas'
  | 'proyectos'
  | 'coautores'

export const EXPORT_SECTIONS: { id: ExportSection; label: string }[] = [
  { id: 'info', label: 'Información general' },
  { id: 'perfil', label: 'Perfil cualitativo' },
  { id: 'estadisticas', label: 'Estadísticas' },
  { id: 'graficas', label: 'Gráficas (por sector y por estado)' },
  { id: 'proyectos', label: 'Proyectos regulatorios' },
  { id: 'coautores', label: 'Congresistas coautores' },
]

// Decode a data-URI base64 PNG to Uint8Array (works in browser without Buffer)
function base64ToUint8Array(dataUri: string): Uint8Array {
  const base64 = dataUri.replace(/^data:image\/png;base64,/, '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Renders a bar chart to a PNG base64 string via an offscreen canvas + Chart.js
async function renderChartToBase64(
  labels: string[],
  values: number[],
  colors: string[],
  title: string,
): Promise<string> {
  // Dynamically import Chart.js to avoid SSR issues
  const { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip } =
    await import('chart.js')
  Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip)

  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 320
  const ctx = canvas.getContext('2d')!

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
        },
      ],
    },
    options: {
      animation: false,
      responsive: false,
      plugins: {
        legend: { display: false },
        title: { display: true, text: title, font: { size: 14 } },
      },
      scales: {
        x: { ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  })

  // Allow chart to paint synchronously
  chart.update()
  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  return base64
}

function heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } })
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 80 },
  })
}

function kv(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 }),
    ],
    spacing: { after: 60 },
  })
}

function buildTableFromRows(headers: string[], rows: string[][]): Table {
  const headerRow = new TableRow({
    children: headers.map(
      h =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { type: ShadingType.SOLID, color: '1e40af' },
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
        }),
    ),
  })

  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map(
          cell =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: cell, size: 20 })],
                }),
              ],
              shading: ri % 2 === 1 ? { type: ShadingType.SOLID, color: 'EFF6FF' } : undefined,
              width: { size: Math.floor(100 / row.length), type: WidthType.PERCENTAGE },
            }),
        ),
      }),
  )

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideH: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      insideV: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    },
  })
}

export async function exportCongresistToWord(
  congresista: Congresista,
  projects: ProyectoLey[],
  coautores: Array<{ nombre: string; partido: string; count: number }>,
  stats: { proyectosCount: number; leyesAprobadas: number; porcentajeAprobacion: number },
  sections: ExportSection[],
) {
  // Pre-compute chart data from projects
  const sectorCounts: Record<string, number> = {}
  const estadoCounts: Record<string, number> = {}
  for (const p of projects) {
    sectorCounts[p.sectorId] = (sectorCounts[p.sectorId] ?? 0) + 1
    estadoCounts[p.estado] = (estadoCounts[p.estado] ?? 0) + 1
  }
  const children: (Paragraph | Table)[] = []

  // Title
  children.push(
    new Paragraph({
      children: [new TextRun({ text: congresista.nombre, bold: true, size: 36 })],
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    }),
  )

  if (sections.includes('info')) {
    children.push(heading('Información general', HeadingLevel.HEADING_1))
    children.push(kv('Partido', congresista.partido))
    children.push(kv('Región', congresista.region))
    if (congresista.cargo) children.push(kv('Cargo', congresista.cargo))
    if (congresista.comisiones?.length)
      children.push(kv('Comisiones', congresista.comisiones.join(', ')))
  }

  if (sections.includes('perfil') && congresista.perfilCualitativo) {
    children.push(heading('Perfil cualitativo', HeadingLevel.HEADING_1))
    congresista.perfilCualitativo.split('\n\n').forEach(p => children.push(body(p)))
  }

  if (sections.includes('estadisticas')) {
    children.push(heading('Estadísticas', HeadingLevel.HEADING_1))
    children.push(kv('Proyectos regulatorios presentados', String(stats.proyectosCount)))
    children.push(kv('Leyes aprobadas', String(stats.leyesAprobadas)))
    children.push(kv('Tasa de aprobación', `${stats.porcentajeAprobacion}%`))
  }

  if (sections.includes('graficas') && projects.length > 0) {
    children.push(heading('Gráficas de proyectos regulatorios', HeadingLevel.HEADING_1))

    const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

    // Chart 1: por sector
    const sectorLabels = Object.keys(sectorCounts)
    const sectorValues = sectorLabels.map(k => sectorCounts[k])
    const sectorBase64 = await renderChartToBase64(
      sectorLabels,
      sectorValues,
      PALETTE.slice(0, sectorLabels.length),
      'Proyectos por sector',
    )
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: base64ToUint8Array(sectorBase64),
            transformation: { width: 500, height: 265 },
            type: 'png',
          }),
        ],
        spacing: { after: 200 },
      }),
    )

    // Chart 2: por estado
    const estadoLabels = Object.keys(estadoCounts)
    const estadoValues = estadoLabels.map(k => estadoCounts[k])
    const estadoBase64 = await renderChartToBase64(
      estadoLabels,
      estadoValues,
      PALETTE.slice(0, estadoLabels.length),
      'Proyectos por estado',
    )
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: base64ToUint8Array(estadoBase64),
            transformation: { width: 500, height: 265 },
            type: 'png',
          }),
        ],
        spacing: { after: 200 },
      }),
    )
  }

  if (sections.includes('proyectos') && projects.length > 0) {
    children.push(heading('Proyectos regulatorios presentados', HeadingLevel.HEADING_1))
    const table = buildTableFromRows(
      ['N°', 'Título', 'Estado', 'Comisión', 'Tipo autor', 'Fecha'],
      projects.map(p => [
        p.numero,
        p.titulo,
        p.estado,
        p.comision ?? '—',
        (p as any).autorPrincipal?.id === congresista.id ? 'Autor principal' : 'Firmante',
        new Date(p.fechaPresentacion).toLocaleDateString('es-PE'),
      ]),
    )
    children.push(table)
  }

  if (sections.includes('coautores') && coautores.length > 0) {
    children.push(heading('Congresistas coautores frecuentes', HeadingLevel.HEADING_1))
    const table = buildTableFromRows(
      ['Nombre', 'Partido', 'Proyectos compartidos'],
      coautores.map(c => [c.nombre, c.partido, String(c.count)]),
    )
    children.push(table)
  }

  const doc = new Document({
    sections: [{ children }],
    creator: 'Monitor Legislativo',
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${congresista.nombre.replace(/\s+/g, '_')}_perfil.docx`
  a.click()
  URL.revokeObjectURL(url)
}
