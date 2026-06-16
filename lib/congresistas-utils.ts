'use client'

import type { Congresista, SectorCongresista } from '@/lib/types'
import { proyectos, congresistas, sectores } from '@/lib/data'

// Additional roles/cargos for congresspeople
const congreistaCargos: Record<string, string> = {
  'cong001': 'Presidente Comisión Economía',
  'cong002': 'Vicepresidenta Comisión Economía',
  'cong003': 'Secretario Comisión Salud',
  'cong004': undefined,
  'cong005': 'Presidente Comisión Educación',
  'cong006': undefined,
  'cong007': 'Presidente Comisión Trabajo',
  'cong008': undefined,
}

/**
 * Obtiene los congresistas vinculados a un sector con sus estadísticas enriquecidas
 */
export function getSectorCongresistas(sectorId: string): SectorCongresista[] {
  const sectorProjects = proyectos.filter(p => p.sectorId === sectorId)
  
  // Agrupar por congresista
  const congresistasMap = new Map<string, { count: number; approved: number; congresista: Congresista }>()
  
  sectorProjects.forEach(proyecto => {
    proyecto.autores.forEach(autor => {
      if (!congresistasMap.has(autor.id)) {
        // Calcular top sectores globales
        const globalProjects = proyectos.filter(p => p.autores.some(a => a.id === autor.id))
        const sectorStats = new Map<string, number>()
        globalProjects.forEach(p => {
          const sector = sectores.find(s => s.id === p.sectorId)
          if (sector) {
            sectorStats.set(sector.name, (sectorStats.get(sector.name) || 0) + 1)
          }
        })
        
        const topSectores = Array.from(sectorStats.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, count]) => ({
            sectorId: sectores.find(s => s.name === name)?.id || '',
            sectorName: name,
            count
          }))
        
        const leyesAprobadas = globalProjects.filter(p => p.estado === 'Aprobado' || p.estado === 'Publicado').length
        
        congresistasMap.set(autor.id, { 
          count: 0, 
          approved: 0, 
          congresista: { 
            ...autor,
            topSectores,
            leyesAprobadas
          } 
        })
      }
      const stats = congresistasMap.get(autor.id)!
      stats.count++
      if (proyecto.estado === 'Aprobado' || proyecto.estado === 'Publicado') {
        stats.approved++
      }
    })
  })
  
  // Convertir a SectorCongresista
  const result = Array.from(congresistasMap.values())
    .map(({ congresista, count, approved }) => {
      const cargoEnriquecido = congreistaCargos[congresista.id]
      return {
        congresista: { 
          ...congresista, 
          cargo: cargoEnriquecido || congresista.cargo 
        },
        proyectosCount: count,
        porcentajeAprobacion: Math.round((approved / count) * 100),
      }
    })
    .sort((a, b) => b.proyectosCount - a.proyectosCount)
  
  return result
}

/**
 * Obtiene datos enriquecidos de un congresista con todas sus estadísticas globales
 */
export function getCongresistaTotalStats(congresistId: string) {
  const allProjects = proyectos.filter(p => p.autores.some(a => a.id === congresistId))
  
  // Contar por sector
  const sectorStats = new Map<string, number>()
  allProjects.forEach(p => {
    const sectorName = sectores.find(s => s.id === p.sectorId)?.name || p.sectorId
    sectorStats.set(sectorName, (sectorStats.get(sectorName) || 0) + 1)
  })
  
  // Top 3 sectores
  const topSectores = Array.from(sectorStats.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({
      sectorId: sectores.find(s => s.name === name)?.id || '',
      sectorName: name,
      count
    }))
  
  // Contar leyes aprobadas
  const leyesAprobadas = allProjects.filter(p => p.estado === 'Aprobado' || p.estado === 'Publicado').length
  
  return {
    proyectosCount: allProjects.length,
    leyesAprobadas,
    topSectores,
    porcentajeAprobacion: allProjects.length > 0 ? Math.round((leyesAprobadas / allProjects.length) * 100) : 0,
  }
}
