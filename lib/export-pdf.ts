'use client'

import type { Congresista, ProyectoLey } from '@/lib/types'
import type { ExportSection } from '@/lib/export-word'

// Shared chart renderer (same logic as export-word.ts but imported lazily)
async function renderChartToBase64(
  labels: string[],
  values: number[],
  colors: string[],
  title: string,
): Promise<string> {
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
      datasets: [{ data: values, backgroundColor: colors, borderRadius: 4 }],
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
  chart.update()
  const base64 = canvas.toDataURL('image/png')
  chart.destroy()
  return base64
}

const PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export async function exportCongresistToPdf(
  congresista: Congresista,
  projects: ProyectoLey[],
  coautores: Array<{ nombre: string; partido: string; count: number }>,
  stats: { proyectosCount: number; leyesAprobadas: number; porcentajeAprobacion: number },
  sections: ExportSection[],
) {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const marginL = 18
  const marginR = 18
  const contentW = pageW - marginL - marginR
  let y = 20

  // ── helpers ────────────────────────────────────────────────────────────────
  function checkPage(needed = 10) {
    if (y + needed > pageH - 15) {
      doc.addPage()
      y = 20
    }
  }

  function h1(text: string) {
    checkPage(14)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(30, 30, 30)
    doc.text(text, marginL, y)
    y += 7
    doc.setDrawColor(200, 200, 200)
    doc.line(marginL, y, pageW - marginR, y)
    y += 5
  }

  function h2(text: string) {
    checkPage(10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text(text, marginL, y)
    y += 6
  }

  function body(text: string, indent = 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(text, contentW - indent)
    checkPage(lines.length * 5 + 2)
    doc.text(lines, marginL + indent, y)
    y += lines.length * 5 + 2
  }

  function kv(label: string, value: string) {
    checkPage(7)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(80, 80, 80)
    doc.text(`${label}:`, marginL, y)
    const labelWidth = doc.getTextWidth(`${label}: `)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const valLines = doc.splitTextToSize(value, contentW - labelWidth - 2)
    doc.text(valLines, marginL + labelWidth + 1, y)
    y += valLines.length * 5 + 1.5
  }

  function tableHeader(cols: string[], colWidths: number[]) {
    checkPage(10)
    doc.setFillColor(240, 240, 240)
    doc.rect(marginL, y - 4, contentW, 7, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(30, 30, 30)
    let x = marginL
    cols.forEach((col, i) => {
      doc.text(col, x + 1.5, y)
      x += colWidths[i]
    })
    y += 4
    doc.setDrawColor(200, 200, 200)
    doc.line(marginL, y, pageW - marginR, y)
    y += 2
  }

  function tableRow(cells: string[], colWidths: number[], shade: boolean) {
    const maxLines = cells.reduce((max, cell, i) => {
      const lines = doc.splitTextToSize(cell, colWidths[i] - 3)
      return Math.max(max, lines.length)
    }, 1)
    const rowH = maxLines * 4.5 + 3
    checkPage(rowH)
    if (shade) {
      doc.setFillColor(248, 248, 248)
      doc.rect(marginL, y - 3.5, contentW, rowH, 'F')
    }
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(50, 50, 50)
    let x = marginL
    cells.forEach((cell, i) => {
      const lines = doc.splitTextToSize(cell, colWidths[i] - 3)
      doc.text(lines, x + 1.5, y)
      x += colWidths[i]
    })
    y += rowH
    doc.setDrawColor(230, 230, 230)
    doc.line(marginL, y - 0.5, pageW - marginR, y - 0.5)
  }

  function gap(mm = 4) { y += mm }

  // ── Cover / title ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(20, 20, 20)
  doc.text('Perfil del Congresista', marginL, y)
  y += 9
  doc.setFontSize(13)
  doc.text(congresista.nombre, marginL, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}`, marginL, y)
  y += 10
  doc.setDrawColor(60, 60, 60)
  doc.setLineWidth(0.5)
  doc.line(marginL, y, pageW - marginR, y)
  doc.setLineWidth(0.2)
  y += 8

  // ── Sections ────────────────────────────────────────────────────────────────

  if (sections.includes('info')) {
    h1('Información general')
    kv('Partido', congresista.partido)
    kv('Región', congresista.region)
    if (congresista.cargo) kv('Cargo', congresista.cargo)
    gap()
  }

  if (sections.includes('perfil') && congresista.perfilCualitativo) {
    h1('Perfil cualitativo')
    const parrafos = congresista.perfilCualitativo.split('\n\n')
    for (const p of parrafos) {
      body(p)
      gap(2)
    }
    gap()
  }

  if (sections.includes('estadisticas')) {
    h1('Estadísticas')
    kv('Proyectos presentados', String(stats.proyectosCount))
    kv('Leyes aprobadas', String(stats.leyesAprobadas))
    kv('Tasa de aprobación', `${stats.porcentajeAprobacion}%`)
    gap()
  }

  if (sections.includes('graficas') && projects.length > 0) {
    h1('Gráficas de proyectos regulatorios')

    const sectorCounts: Record<string, number> = {}
    const estadoCounts: Record<string, number> = {}
    for (const p of projects) {
      sectorCounts[p.sectorId] = (sectorCounts[p.sectorId] ?? 0) + 1
      estadoCounts[p.estado] = (estadoCounts[p.estado] ?? 0) + 1
    }

    // Chart 1: por sector
    const sectorLabels = Object.keys(sectorCounts)
    const sectorBase64 = await renderChartToBase64(sectorLabels, sectorLabels.map(k => sectorCounts[k]), PALETTE.slice(0, sectorLabels.length), 'Proyectos por sector')
    const imgH = (contentW * 320) / 600
    checkPage(imgH + 8)
    doc.addImage(sectorBase64, 'PNG', marginL, y, contentW, imgH)
    y += imgH + 6

    // Chart 2: por estado
    const estadoLabels = Object.keys(estadoCounts)
    const estadoBase64 = await renderChartToBase64(estadoLabels, estadoLabels.map(k => estadoCounts[k]), PALETTE.slice(0, estadoLabels.length), 'Proyectos por estado')
    checkPage(imgH + 8)
    doc.addImage(estadoBase64, 'PNG', marginL, y, contentW, imgH)
    y += imgH + 8
  }

  if (sections.includes('proyectos') && projects.length > 0) {
    h1('Proyectos regulatorios presentados')
    const cols = ['N° / ID', 'Título', 'Estado', 'Fecha']
    const colW = [28, contentW - 28 - 26 - 22, 26, 22]
    tableHeader(cols, colW)
    projects.forEach((p, i) => {
      tableRow(
        [p.numero, p.titulo, p.estado, formatDate(p.fechaPresentacion)],
        colW,
        i % 2 === 0,
      )
    })
    gap()
  }

  if (sections.includes('coautores') && coautores.length > 0) {
    h1('Congresistas coautores')
    const cols = ['Congresista', 'Partido', 'Proyectos compartidos']
    const colW = [contentW * 0.42, contentW * 0.38, contentW * 0.2]
    tableHeader(cols, colW)
    coautores.forEach((c, i) => {
      tableRow([c.nombre, c.partido, String(c.count)], colW, i % 2 === 0)
    })
  }

  // Page numbers
  const totalPages = (doc.internal as any).getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`${i} / ${totalPages}`, pageW - marginR, pageH - 8, { align: 'right' })
  }

  doc.save(`perfil-${congresista.nombre.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
