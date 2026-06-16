import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  column: string | null
  direction: SortDirection
}

export function useSortableTable<T>(data: T[], initialSort: SortState = { column: null, direction: null }) {
  const [sort, setSort] = useState<SortState>(initialSort)

  const toggleSort = (column: string) => {
    setSort(prev => {
      if (prev.column !== column) return { column, direction: 'asc' }
      if (prev.direction === 'asc') return { column, direction: 'desc' }
      return { column: null, direction: null }
    })
  }

  const sortedData = useMemo(() => {
    if (!sort.column || !sort.direction) return data
    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sort.column!)
      const bVal = getNestedValue(b, sort.column!)
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      if (aStr < bStr) return sort.direction === 'asc' ? -1 : 1
      if (aStr > bStr) return sort.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sort])

  return { sort, toggleSort, sortedData }
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key]
    return undefined
  }, obj)
}
