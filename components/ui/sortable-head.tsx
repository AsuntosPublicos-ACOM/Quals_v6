import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { TableHead } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { SortState } from '@/hooks/use-sortable-table'

interface SortableHeadProps {
  column: string
  sort: SortState
  onSort: (column: string) => void
  children: React.ReactNode
  className?: string
}

export function SortableHead({ column, sort, onSort, children, className }: SortableHeadProps) {
  const isActive = sort.column === column
  const direction = isActive ? sort.direction : null

  return (
    <TableHead
      className={cn('cursor-pointer select-none group hover:bg-muted/50 transition-colors', className)}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        <span className={cn(
          'transition-opacity shrink-0',
          isActive ? 'opacity-100 text-primary' : 'opacity-30 group-hover:opacity-70 text-muted-foreground'
        )}>
          {direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : direction === 'desc' ? (
            <ArrowDown className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
    </TableHead>
  )
}
