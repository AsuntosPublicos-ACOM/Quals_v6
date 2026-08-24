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
} from 'docx'
import {
  ACTUALIZADO,
  PERIODO,
  alertasSemana,
  evolucion,
  filtrosDef,
  filtrosIniciales,
  kpis,
  proyectosTransversales,
  series,
  temas,
  topCongresistas,
  type DashboardSection,
} from '@/lib/dashboard-data'

const BRAND = 'C8102E'
const INK = '111827'
const MUTED = '6B7280'
const LIGHT = 'F3F4F6'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ------------------------------- PowerPoint ------------------------------- */

export async function exportDashboardToPptx(sections: DashboardSection[]) {
  const PptxGenJS = (await import('pptxgenjs')).default
  const pptx = new PptxGenJS()

  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'QUALS'
  pptx.title = `Vista general legislativa · ${PERIODO}`

  const addTitle = (slide: any, title: string, subtitle?: string) => {
    slide.addShape('rect', { x: 0, y: 0, w: '100%', h: 0.06, fill: { color: BRAND } })
    slide.addText(title, {
      x: 0.5, y: 0.3, w: 9, h: 0.5,
      fontSize: 24, bold: true, color: INK, fontFace: 'Arial',
    })
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.5, y: 0.8, w: 9, h: 0.3,
        fontSize: 12, color: MUTED, fontFace: 'Arial',
      })
    }
  }

  // Portada
  const cover = pptx.addSlide()
  cover.addShape('rect', { x: 0, y: 0, w: '100%', h: 1.1, fill: { color: BRAND } })
  cover.addText('QUALS · Vista general legislativa', {
    x: 0.6, y: 0.3, w: 9, h: 0.5, fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Arial',
  })
  cover.addText(`Periodo: ${PERIODO}`, {
    x: 0.6, y: 1.5, w: 9, h: 0.4, fontSize: 16, color: INK, fontFace: 'Arial',
  })
  cover.addText(
    filtrosDef.map((f) => `${f.label}: ${filtrosIniciales[f.key]}`).join('   |   '),
    { x: 0.6, y: 2.0, w: 9, h: 0.4, fontSize: 11, color: MUTED, fontFace: 'Arial' },
  )
  cover.addText(`Actualizado: ${ACTUALIZADO}`, {
    x: 0.6, y: 4.9, w: 9, h: 0.3, fontSize: 10, color: MUTED, fontFace: 'Arial',
  })

  if (sections.includes('kpis')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Indicadores clave', `Semana del ${PERIODO}`)
    const cardW = 1.74
    kpis.forEach((kpi, i) => {
      const x = 0.5 + i * (cardW + 0.16)
      slide.addShape('roundRect', {
        x, y: 1.5, w: cardW, h: 1.7,
        fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1 }, rectRadius: 0.08,
      })
      slide.addText(kpi.label, {
        x: x + 0.12, y: 1.62, w: cardW - 0.24, h: 0.5,
        fontSize: 10, color: MUTED, fontFace: 'Arial', valign: 'top',
      })
      slide.addText(kpi.value, {
        x: x + 0.12, y: 2.12, w: cardW - 0.24, h: 0.6,
        fontSize: 30, bold: true, color: INK, fontFace: 'Arial',
      })
      slide.addText(
        kpi.trend === 'flat' ? kpi.delta : `▲ ${kpi.delta} vs. semana anterior`,
        {
          x: x + 0.12, y: 2.74, w: cardW - 0.24, h: 0.35,
          fontSize: 8, color: kpi.trend === 'flat' ? MUTED : '0F9D58', fontFace: 'Arial',
        },
      )
    })
  }

  if (sections.includes('temas')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Temas transversales prioritarios', 'Distribución de PL por nivel de prioridad')
    slide.addChart(
      pptx.ChartType.bar,
      [
        { name: 'Críticos', labels: temas.map((t) => t.name), values: temas.map((t) => t.criticos) },
        { name: 'Altos', labels: temas.map((t) => t.name), values: temas.map((t) => t.altos) },
        { name: 'Medios', labels: temas.map((t) => t.name), values: temas.map((t) => t.medios) },
        { name: 'Bajos', labels: temas.map((t) => t.name), values: temas.map((t) => t.bajos) },
      ],
      {
        x: 0.5, y: 1.3, w: 9, h: 3.8,
        barDir: 'col',
        barGrouping: 'stacked',
        chartColors: ['DC2626', 'EA580C', 'D97706', '0F9D58'],
        showLegend: true,
        legendPos: 'b',
        catAxisLabelFontSize: 10,
        valAxisLabelFontSize: 10,
        showValue: false,
      },
    )
  }

  if (sections.includes('evolucion')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Evolución del avance de la agenda legislativa', 'Comparación semanal de proyectos por etapa')
    slide.addChart(
      pptx.ChartType.line,
      series.map((s) => ({
        name: s.label,
        labels: evolucion.map((e) => e.semana),
        values: evolucion.map((e) => e[s.key as keyof typeof e] as number),
      })),
      {
        x: 0.5, y: 1.3, w: 9, h: 3.8,
        chartColors: series.map((s) => s.color.replace('#', '')),
        showLegend: true,
        legendPos: 'b',
        lineDataSymbolSize: 6,
        catAxisLabelFontSize: 10,
        valAxisLabelFontSize: 10,
      },
    )
  }

  if (sections.includes('proyectos')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Proyectos de ley con afectación transversal', 'Priorizados por impacto y movimiento reciente')
    const rows: any[] = [
      ['Proyecto de ley', 'Tema', 'Impacto', 'Estado actual', 'Último cambio', 'Por qué importa'].map((h) => ({
        text: h,
        options: { bold: true, color: 'FFFFFF', fill: { color: BRAND }, fontSize: 10 },
      })),
      ...proyectosTransversales.map((p) => [
        { text: p.pl, options: { fontSize: 9, bold: true } },
        { text: p.tema, options: { fontSize: 9 } },
        { text: p.impacto, options: { fontSize: 9 } },
        { text: p.estado, options: { fontSize: 9 } },
        { text: p.cambio, options: { fontSize: 9 } },
        { text: p.motivo, options: { fontSize: 9 } },
      ]),
    ]
    slide.addTable(rows, {
      x: 0.5, y: 1.4, w: 9,
      colW: [1.6, 1.5, 0.9, 1.5, 1.2, 2.3],
      border: { type: 'solid', color: 'E5E7EB', pt: 1 },
      fontFace: 'Arial',
      valign: 'middle',
      rowH: 0.4,
    })
  }

  if (sections.includes('congresistas')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Top congresistas', 'Mayor incidencia en proyectos relevantes')
    const rows: any[] = [
      ['#', 'Congresista', 'Bancada', 'PL relevantes', 'Tema principal'].map((h) => ({
        text: h,
        options: { bold: true, color: 'FFFFFF', fill: { color: BRAND }, fontSize: 10 },
      })),
      ...topCongresistas.map((c, i) => [
        { text: String(i + 1), options: { fontSize: 10 } },
        { text: c.nombre, options: { fontSize: 10, bold: true } },
        { text: c.bancada, options: { fontSize: 10 } },
        { text: String(c.pl), options: { fontSize: 10 } },
        { text: c.tema, options: { fontSize: 10 } },
      ]),
    ]
    slide.addTable(rows, {
      x: 0.5, y: 1.4, w: 9,
      colW: [0.5, 2.4, 2.6, 1.4, 2.1],
      border: { type: 'solid', color: 'E5E7EB', pt: 1 },
      fontFace: 'Arial',
      valign: 'middle',
      rowH: 0.45,
    })
  }

  if (sections.includes('alertas')) {
    const slide = pptx.addSlide()
    addTitle(slide, 'Alertas de la semana', `${alertasSemana.length} señales que requieren seguimiento`)
    alertasSemana.forEach((a, i) => {
      const y = 1.4 + i * 0.66
      slide.addShape('roundRect', {
        x: 0.5, y, w: 9, h: 0.55,
        fill: { color: 'FFFFFF' }, line: { color: 'E5E7EB', width: 1 }, rectRadius: 0.06,
      })
      slide.addText(a.nivel, {
        x: 0.62, y: y + 0.12, w: 0.9, h: 0.3,
        fontSize: 9, bold: true, fontFace: 'Arial',
        color: a.nivel === 'Crítico' ? 'DC2626' : a.nivel === 'Alto' ? 'EA580C' : 'D97706',
      })
      slide.addText(a.titulo, {
        x: 1.6, y: y + 0.12, w: 6.6, h: 0.3, fontSize: 11, color: INK, fontFace: 'Arial',
      })
      slide.addText(a.dia, {
        x: 8.3, y: y + 0.12, w: 1, h: 0.3, fontSize: 10, color: MUTED, fontFace: 'Arial', align: 'right',
      })
    })
  }

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob
  triggerDownload(blob, `QUALS_vista_general_${PERIODO.replace(/[^\w]+/g, '_')}.pptx`)
}

/* ----------------------------- Reporte semanal ---------------------------- */

function heading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
  })
}

function body(text: string) {
  return new Paragraph({ children: [new TextRun({ text, size: 22 })], spacing: { after: 100 } })
}

function buildTable(headers: string[], rows: string[][]): Table {
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { type: ShadingType.SOLID, color: BRAND },
        }),
    ),
  })

  const dataRows = rows.map(
    (row, ri) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20 })] })],
              shading: ri % 2 === 1 ? { type: ShadingType.SOLID, color: LIGHT } : undefined,
            }),
        ),
      }),
  )

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
    },
  })
}

export async function exportWeeklyReportToWord(sections: DashboardSection[]) {
  const children: (Paragraph | Table)[] = []

  children.push(
    new Paragraph({
      children: [new TextRun({ text: 'Reporte semanal legislativo', bold: true, size: 36 })],
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Periodo: ${PERIODO}`, size: 22, color: MUTED })],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Actualizado: ${ACTUALIZADO}`, size: 20, color: MUTED })],
      spacing: { after: 240 },
    }),
  )

  if (sections.includes('kpis')) {
    children.push(heading('Resumen de la semana'))
    children.push(
      body(
        `Se registran ${kpis[0].value} proyectos de ley activos, de los cuales ${kpis[1].value} son de alto impacto o alta probabilidad. ` +
          `${kpis[3].value} PL tuvieron movimiento esta semana y se emitieron ${kpis[4].value} alertas.`,
      ),
    )
    children.push(
      buildTable(
        ['Indicador', 'Valor', 'Variación semanal'],
        kpis.map((k) => [k.label, k.value, k.trend === 'flat' ? k.delta : `+${k.delta}`]),
      ),
    )
  }

  if (sections.includes('temas')) {
    children.push(heading('Temas transversales prioritarios'))
    children.push(
      buildTable(
        ['Tema', 'PL en total', 'Críticos', 'Altos', 'Medios', 'Bajos'],
        temas.map((t) => [
          t.name,
          String(t.total),
          String(t.criticos),
          String(t.altos),
          String(t.medios),
          String(t.bajos),
        ]),
      ),
    )
  }

  if (sections.includes('evolucion')) {
    children.push(heading('Evolución del avance de la agenda legislativa'))
    children.push(
      buildTable(
        ['Semana', ...series.map((s) => s.label)],
        evolucion.map((e) => [
          e.semana,
          ...series.map((s) => String(e[s.key as keyof typeof e])),
        ]),
      ),
    )
  }

  if (sections.includes('proyectos')) {
    children.push(heading('Proyectos de ley con afectación transversal'))
    children.push(
      buildTable(
        ['Proyecto', 'Tema', 'Impacto', 'Estado', 'Último cambio', 'Por qué importa'],
        proyectosTransversales.map((p) => [p.pl, p.tema, p.impacto, p.estado, p.cambio, p.motivo]),
      ),
    )
  }

  if (sections.includes('congresistas')) {
    children.push(heading('Top congresistas'))
    children.push(
      buildTable(
        ['#', 'Congresista', 'Bancada', 'PL relevantes', 'Tema principal'],
        topCongresistas.map((c, i) => [String(i + 1), c.nombre, c.bancada, String(c.pl), c.tema]),
      ),
    )
  }

  if (sections.includes('alertas')) {
    children.push(heading('Alertas de la semana'))
    children.push(
      buildTable(
        ['Día', 'Nivel', 'Alerta'],
        alertasSemana.map((a) => [a.dia, a.nivel, a.titulo]),
      ),
    )
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Los niveles de impacto y probabilidad se calculan en base a votaciones, participación y señales públicas.',
          size: 18,
          italics: true,
          color: MUTED,
        }),
      ],
      spacing: { before: 320 },
    }),
  )

  const doc = new Document({ sections: [{ children }], creator: 'QUALS' })
  const blob = await Packer.toBlob(doc)
  triggerDownload(blob, `QUALS_reporte_semanal_${PERIODO.replace(/[^\w]+/g, '_')}.docx`)
}
