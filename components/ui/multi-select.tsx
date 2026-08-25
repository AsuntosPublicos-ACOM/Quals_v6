'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options: optionsProp,
  selected: selectedProp,
  onChange,
  placeholder = 'Seleccionar...',
  className,
}: MultiSelectProps) {
  /**
   * Lectura tolerante: si un consumidor omite `options` o `selected`, se usa un
   * arreglo vacío en lugar de romper el render con `undefined.map(...)`.
   */
  const options = Array.isArray(optionsProp) ? optionsProp : []
  const selected = Array.isArray(selectedProp) ? selectedProp : []
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggle = (value: string) => {
    onChange?.(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  }

  const removeOne = (e: React.MouseEvent, value: string) => {
    e.stopPropagation()
    onChange?.(selected.filter(v => v !== value))
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex min-h-[36px] w-full items-center justify-between gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map(val => {
              const label = options.find(o => o.value === val)?.label ?? val
              return (
                <Badge key={val} variant="secondary" className="text-[10px] h-5 gap-0.5 pr-1">
                  <span className="truncate max-w-[80px]">{label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`Quitar ${label}`}
                    onClick={(e) => removeOne(e, val)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') removeOne(e as never, val)
                    }}
                    className="ml-0.5 cursor-pointer hover:text-destructive"
                  >
                    <X className="h-2.5 w-2.5" />
                  </span>
                </Badge>
              )
            })
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {options.map(option => {
              const isSelected = selected.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(option.value)}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground text-left"
                >
                  <div className={cn(
                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                    isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                  )}>
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span className="truncate">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
