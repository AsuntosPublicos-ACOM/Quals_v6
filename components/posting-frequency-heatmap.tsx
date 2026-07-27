'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Congresista } from '@/lib/types'
import type { HeatmapFilterState } from './heatmap-filters'
import { HeatmapFilters } from './heatmap-filters'

interface PostingFrequencyHeatmapProps {
  tweets: any[]
  congresistas: Congresista[]
  filters?: HeatmapFilterState
}

type TweetRange = 'Más de 60 tuits' | 'Entre 21 y 60 tuits' | 'Menos de 20 tuits'
type ProjectRange = 'Ningún PL' | '1 a 2 PL' | '3 a 5 PL'

// Mock data generator con nombres realistas
function generateMockLegislators(): Array<{
  nombre: string
  tuits: number
  proyectos: number
  sector: string
}> {
  const nombres = [
    'Juan García López', 'María Rodríguez Silva', 'Carlos Pérez Martínez',
    'Ana López García', 'David Sánchez Ruiz', 'Laura Martín García',
    'Roberto Díaz López', 'Carmen Fernández García', 'Miguel Angel Reyes',
    'Isabel García López', 'Francisco Rodríguez García', 'Teresa Sánchez Martín',
    'José Luis García Ruiz', 'Marta López Fernández', 'Antonio Pérez García',
    'Rosa María Martínez López', 'Manuel García López', 'Susana Rodríguez García',
    'Pedro Sánchez García', 'Marta Martínez Ruiz', 'Luis García Fernández',
    'Elena López García', 'Javier Pérez López', 'Beatriz García Martínez',
    'Fernando Rodríguez López', 'Marta García López', 'Raúl Sánchez Ruiz',
    'Marina López Pérez', 'Sergio García Rodríguez', 'Claudia Martínez García',
    'Andrés Pérez García', 'Paola López Rodríguez', 'Cristian García López',
    'Victoria Sánchez García', 'Bruno López Martínez', 'Alejandra García Ruiz',
    'Eduardo Rodríguez García', 'Daniela López García', 'Guillermo Pérez López',
    'Gabriela García Martínez', 'Marcelo Sánchez López', 'Roxana López García',
    'Hernán Rodríguez Pérez', 'Silvina García López', 'Jorge López Rodríguez',
    'Natalia Sánchez García', 'Matías García López', 'Verónica Pérez García'
  ]

  const sectores = ['Salud', 'Educación', 'Economía', 'Infraestructura', 'Agricultura', 'Energía', 'Minería']

  return nombres.map(nombre => ({
    nombre,
    tuits: Math.floor(Math.random() * 90) + 5,
    proyectos: Math.floor(Math.random() * 6),
    sector: sectores[Math.floor(Math.random() * sectores.length)]
  }))
}

interface CellData {
  nombres: string[]
  count: number
}

interface ExpandedCell {
  row: TweetRange
  col: ProjectRange
}

export function PostingFrequencyHeatmap({
  tweets,
  congresistas,
  filters
}: PostingFrequencyHeatmapProps) {
  const [localFilters, setLocalFilters] = useState<HeatmapFilterState>({
    dateFrom: filters?.dateFrom,
    dateTo: filters?.dateTo,
    sectors: filters?.sectors || []
  })
  const [expandedCell, setExpandedCell] = useState<ExpandedCell | null>(null)

  const { tableData, selectedSector, allSectors } = useMemo(() => {
    const mockData = generateMockLegislators()

    // Apply filters
    let filteredData = mockData
    if (localFilters.sectors.length > 0) {
      filteredData = filteredData.filter(l => localFilters.sectors.includes(l.sector))
    }

    // Categorize by tweet range and project range
    const matrix: Record<TweetRange, Record<ProjectRange, CellData>> = {
      'Más de 60 tuits': {
        'Ningún PL': { nombres: [], count: 0 },
        '1 a 2 PL': { nombres: [], count: 0 },
        '3 a 5 PL': { nombres: [], count: 0 }
      },
      'Entre 21 y 60 tuits': {
        'Ningún PL': { nombres: [], count: 0 },
        '1 a 2 PL': { nombres: [], count: 0 },
        '3 a 5 PL': { nombres: [], count: 0 }
      },
      'Menos de 20 tuits': {
        'Ningún PL': { nombres: [], count: 0 },
        '1 a 2 PL': { nombres: [], count: 0 },
        '3 a 5 PL': { nombres: [], count: 0 }
      }
    }

    filteredData.forEach(legislator => {
      let tweetRange: TweetRange
      if (legislator.tuits > 60) tweetRange = 'Más de 60 tuits'
      else if (legislator.tuits >= 21) tweetRange = 'Entre 21 y 60 tuits'
      else tweetRange = 'Menos de 20 tuits'

      let projectRange: ProjectRange
      if (legislator.proyectos === 0) projectRange = 'Ningún PL'
      else if (legislator.proyectos <= 2) projectRange = '1 a 2 PL'
      else projectRange = '3 a 5 PL'

      matrix[tweetRange][projectRange].nombres.push(legislator.nombre)
      matrix[tweetRange][projectRange].count++
    })

    // Find sector with most activity
    const sectorCounts = new Map<string, number>()
    mockData.forEach(l => {
      sectorCounts.set(l.sector, (sectorCounts.get(l.sector) || 0) + 1)
    })

    let topSector = 'Minería' // default
    let maxCount = 0
    sectorCounts.forEach((count, sector) => {
      if (count > maxCount) {
        maxCount = count
        topSector = sector
      }
    })

    return {
      tableData: matrix,
      selectedSector: topSector,
      allSectors: Array.from(sectorCounts.keys())
    }
  }, [localFilters])

  const tweetRanges: TweetRange[] = ['Más de 60 tuits', 'Entre 21 y 60 tuits', 'Menos de 20 tuits']
  const projectRanges: ProjectRange[] = ['Ningún PL', '1 a 2 PL', '3 a 5 PL']

  const renderCellContent = (cellData: CellData): React.ReactNode => {
    if (cellData.count === 0) {
      return <span className="text-muted-foreground text-xs">—</span>
    }

    if (cellData.count <= 8) {
      return (
        <div className="text-xs space-y-0.5">
          {cellData.nombres.map((nombre, idx) => (
            <div key={idx} className="text-foreground">
              {nombre}
            </div>
          ))}
        </div>
      )
    }

    return (
      <button
        onClick={() => {
          // Find the row and col this cell belongs to
          for (const row of tweetRanges) {
            for (const col of projectRanges) {
              if (tableData[row][col] === cellData) {
                setExpandedCell({ row, col })
                return
              }
            }
          }
        }}
        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        {cellData.count} congresistas
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <HeatmapFilters
        congresistas={congresistas}
        onFiltersChange={setLocalFilters}
      />

      {/* Subtitle with selected sector */}
      <p className="text-xs text-muted-foreground">
        Sector: <span className="font-semibold text-foreground">{selectedSector}</span>
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground border-r border-border">
                Frecuencia de tuits
              </th>
              {projectRanges.map(range => (
                <th
                  key={range}
                  className="px-4 py-3 text-center text-sm font-bold text-foreground border-r border-border last:border-r-0"
                >
                  {range}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tweetRanges.map((tweetRange, rowIdx) => (
              <tr
                key={tweetRange}
                className={rowIdx < tweetRanges.length - 1 ? 'border-b border-border' : ''}
              >
                <td className="px-4 py-3 text-sm font-bold text-foreground bg-muted/30 border-r border-border">
                  {tweetRange}
                </td>
                {projectRanges.map(projectRange => (
                  <td
                    key={`${tweetRange}-${projectRange}`}
                    className="px-4 py-3 text-sm border-r border-border last:border-r-0 bg-background hover:bg-muted/30 transition-colors"
                  >
                    {renderCellContent(tableData[tweetRange][projectRange])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded cell modal */}
      {expandedCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg border border-border max-w-2xl w-full max-h-96 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {expandedCell.row} × {expandedCell.col}
              </h3>
              <button
                onClick={() => setExpandedCell(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {tableData[expandedCell.row][expandedCell.col].nombres.map((nombre, idx) => (
                <div key={idx} className="text-xs text-foreground py-1">
                  {nombre}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
