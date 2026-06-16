'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MultiSelect } from '@/components/ui/multi-select'
import { Search, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react'

const partidos = [
  'Partido Popular',
  'Alianza para el Progreso',
  'Fuerza Nacional',
  'Union por el Peru',
  'Renovacion Popular',
  'Accion Popular',
  'Peru Libre',
  'Avanza Pais',
  'Somos Peru',
  'Podemos Peru'
]

const nombres = [
  'Maria', 'Carlos', 'Rosa', 'Jorge', 'Ana', 'Luis', 'Patricia', 'Roberto', 'Carmen', 'Miguel',
  'Elena', 'Fernando', 'Lucia', 'Alberto', 'Silvia', 'Enrique', 'Gloria', 'Raul', 'Monica', 'Oscar',
  'Teresa', 'Javier', 'Isabel', 'Andres', 'Claudia', 'Ricardo', 'Angela', 'Pablo', 'Susana', 'Diego'
]

const apellidos = [
  'Torres', 'Mendoza', 'Gutierrez', 'Ramirez', 'Fernandez', 'Vasquez', 'Paredes', 'Quispe', 'Huaman', 'Chavez',
  'Rojas', 'Flores', 'Garcia', 'Sanchez', 'Lopez', 'Martinez', 'Rodriguez', 'Hernandez', 'Diaz', 'Morales',
  'Castillo', 'Reyes', 'Cruz', 'Ortiz', 'Ramos', 'Vargas', 'Romero', 'Jimenez', 'Ruiz', 'Silva'
]

const regiones = [
  'Lima', 'Arequipa', 'La Libertad', 'Cusco', 'Piura', 'Lambayeque', 'Junin', 'Ancash', 'Cajamarca', 'Puno',
  'Loreto', 'Ica', 'San Martin', 'Tacna', 'Huanuco', 'Ayacucho', 'Ucayali', 'Madre de Dios', 'Amazonas', 'Tumbes'
]

interface CongresistaNode {
  id: string
  nombre: string
  partido: string
  region: string
  x: number
  y: number
  cluster: number
}

interface Link {
  source: string
  target: string
  weight: number
  fecha: string
}

const partyColors: Record<string, string> = {
  'Partido Popular':       '#3b82f6',
  'Alianza para el Progreso': '#10b981',
  'Fuerza Nacional':       '#f97316',
  'Union por el Peru':     '#8b5cf6',
  'Renovacion Popular':    '#ef4444',
  'Accion Popular':        '#06b6d4',
  'Peru Libre':            '#dc2626',
  'Avanza Pais':           '#84cc16',
  'Somos Peru':            '#f59e0b',
  'Podemos Peru':          '#ec4899'
}

// ── Static layout: clusters arranged in a ring, nodes in sub-rings ──────────
const generateCongresistas = (): CongresistaNode[] => {
  const W = 900
  const H = 620
  const cx = W / 2
  const cy = H / 2

  // Each party gets a cluster centre placed on a large ring
  const clusterRadius = 210          // distance from canvas centre to cluster centre
  const nodeSpread   = 52            // radius of the cloud within each cluster
  const result: CongresistaNode[] = []

  partidos.forEach((partido, pi) => {
    const angle = (2 * Math.PI * pi) / partidos.length - Math.PI / 2
    const clusterCx = cx + clusterRadius * Math.cos(angle)
    const clusterCy = cy + clusterRadius * Math.sin(angle)

    // Members of this party: distribute in small concentric rings
    const members = 13  // 130 / 10
    for (let m = 0; m < members; m++) {
      const i = pi * members + m + 1
      // Use a seeded pseudo-random placement so it never changes
      const seed  = i * 2654435761
      const r     = nodeSpread * Math.sqrt(((seed & 0xffff) / 0xffff) * 0.85 + 0.15)
      const theta = ((seed >> 16) / 0xffff) * 2 * Math.PI

      result.push({
        id: `c${i}`,
        nombre: `${nombres[i % nombres.length]} ${apellidos[Math.floor(i / nombres.length) % apellidos.length]} ${apellidos[(i * 7) % apellidos.length]}`,
        partido,
        region: regiones[i % regiones.length],
        x: clusterCx + r * Math.cos(theta),
        y: clusterCy + r * Math.sin(theta),
        cluster: pi
      })
    }
  })
  return result
}

const generateLinks = (congresistas: CongresistaNode[]): Link[] => {
  const links: Link[] = []
  const fechas = ['2024-01', '2024-02', '2024-03', '2023-12', '2023-11', '2023-10']

  for (let i = 0; i < congresistas.length; i++) {
    for (let j = i + 1; j < congresistas.length; j++) {
      const sameParty  = congresistas[i].partido === congresistas[j].partido
      const sameRegion = congresistas[i].region  === congresistas[j].region

      // Use a deterministic pseudo-random based on indices so layout never changes
      const seed = (i * 131 + j * 37) % 1000
      const prob = sameParty ? 0.45 : sameRegion ? 0.08 : 0.015

      if (seed / 1000 < prob) {
        const weight = sameParty
          ? ((i * 3 + j * 7) % 10) + 3
          : ((i * 5 + j * 11) % 5) + 1

        links.push({
          source: congresistas[i].id,
          target: congresistas[j].id,
          weight,
          fecha: fechas[(i + j) % fechas.length]
        })
      }
    }
  }
  return links
}

// Computed once at module level — positions never change
const ALL_NODES = generateCongresistas()
const ALL_LINKS = generateLinks(ALL_NODES)

interface NetworkGraphProps {
  sectorId?: string
}

export function NetworkGraph({ sectorId }: NetworkGraphProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 900, height: 620 })
  const [zoom,   setZoom]   = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart,  setDragStart]  = useState({ x: 0, y: 0 })
  const [selectedNode, setSelectedNode] = useState<CongresistaNode | null>(null)
  const [hoveredNode,  setHoveredNode]  = useState<CongresistaNode | null>(null)

  // Filters
  const [searchQuery,      setSearchQuery]      = useState('')
  const [selectedPartidos, setSelectedPartidos] = useState<string[]>([])
  const [fechaDesde,       setFechaDesde]       = useState('')
  const [fechaHasta,       setFechaHasta]       = useState('')

  const partidoOptions = partidos.map(p => ({ value: p, label: p }))

  // Date-filtered links
  const filteredLinks = useMemo(() => {
    return ALL_LINKS.filter(link => {
      if (fechaDesde && link.fecha < fechaDesde) return false
      if (fechaHasta && link.fecha > fechaHasta) return false
      return true
    })
  }, [fechaDesde, fechaHasta])

  // Visible node IDs based on party + search filters
  const filteredNodeIds = useMemo(() => {
    const ids = new Set<string>()
    ALL_NODES.forEach(node => {
      if (selectedPartidos.length > 0 && !selectedPartidos.includes(node.partido)) return
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!node.nombre.toLowerCase().includes(q) &&
            !node.partido.toLowerCase().includes(q) &&
            !node.region.toLowerCase().includes(q)) return
      }
      ids.add(node.id)
    })
    return ids
  }, [selectedPartidos, searchQuery])

  // Connections of the selected node
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>()
    const connected = new Set<string>()
    filteredLinks.forEach(link => {
      if (link.source === selectedNode.id) connected.add(link.target)
      if (link.target === selectedNode.id) connected.add(link.source)
    })
    return connected
  }, [selectedNode, filteredLinks])

  // ── Draw (called manually — no animation loop) ───────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    // Links
    filteredLinks.forEach(link => {
      const source = ALL_NODES.find(n => n.id === link.source)
      const target = ALL_NODES.find(n => n.id === link.target)
      if (!source || !target) return
      if (!filteredNodeIds.has(source.id) || !filteredNodeIds.has(target.id)) return

      const isHighlighted = selectedNode &&
        (link.source === selectedNode.id || link.target === selectedNode.id)

      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)
      ctx.strokeStyle = isHighlighted ? '#3b82f6' : 'rgba(100,116,139,0.15)'
      ctx.lineWidth   = isHighlighted
        ? Math.min(link.weight / 2, 5)
        : Math.min(link.weight / 4, 2)
      ctx.stroke()
    })

    // Nodes
    ALL_NODES.forEach(node => {
      if (!filteredNodeIds.has(node.id)) return

      const isSelected  = selectedNode?.id === node.id
      const isConnected = connectedNodeIds.has(node.id)
      const isHovered   = hoveredNode?.id === node.id
      const isDimmed    = !!selectedNode && !isSelected && !isConnected

      const radius = isSelected ? 10 : isHovered ? 8 : 6
      const color  = partyColors[node.partido] || '#64748b'

      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fillStyle = isDimmed ? `${color}40` : color
      ctx.fill()

      if (isSelected || isHovered) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth   = 2
        ctx.stroke()
      }
    })

    // Labels
    const labelNode = (node: CongresistaNode, bold: boolean) => {
      ctx.font      = bold ? 'bold 11px sans-serif' : '10px sans-serif'
      ctx.fillStyle = bold ? '#1e293b' : '#475569'
      ctx.textAlign = 'center'
      ctx.fillText(node.nombre.split(' ').slice(0, 2).join(' '), node.x, node.y - 14)
    }

    if (selectedNode && filteredNodeIds.has(selectedNode.id)) labelNode(selectedNode, true)
    if (hoveredNode && hoveredNode.id !== selectedNode?.id && filteredNodeIds.has(hoveredNode.id)) {
      labelNode(hoveredNode, false)
    }

    ctx.restore()
  }, [zoom, offset, filteredLinks, filteredNodeIds, selectedNode, connectedNodeIds, hoveredNode])

  // Redraw whenever draw dependencies change (no animation loop)
  useEffect(() => {
    draw()
  }, [draw])

  // Resize observer
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width, height: Math.max(500, height) })
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const getNodeAtPosition = useCallback((clientX: number, clientY: number): CongresistaNode | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left - offset.x) / zoom
    const y = (clientY - rect.top  - offset.y) / zoom

    for (const node of ALL_NODES) {
      if (!filteredNodeIds.has(node.id)) continue
      const dist = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      if (dist < 12) return node
    }
    return null
  }, [zoom, offset, filteredNodeIds])

  const handleMouseDown = (e: React.MouseEvent) => {
    const node = getNodeAtPosition(e.clientX, e.clientY)
    if (node) {
      setSelectedNode(node.id === selectedNode?.id ? null : node)
    } else {
      setIsDragging(true)
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    } else {
      setHoveredNode(getNodeAtPosition(e.clientX, e.clientY))
    }
  }

  const handleMouseUp  = () => setIsDragging(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.3, Math.min(3, z * (e.deltaY > 0 ? 0.9 : 1.1))))
  }

  const resetView   = () => { setZoom(1); setOffset({ x: 0, y: 0 }); setSelectedNode(null) }
  const clearFilters = () => {
    setSearchQuery(''); setSelectedPartidos([])
    setFechaDesde('');  setFechaHasta(''); setSelectedNode(null)
  }

  const visibleNodes = ALL_NODES.filter(n => filteredNodeIds.has(n.id)).length
  const visibleLinks = filteredLinks.filter(l =>
    filteredNodeIds.has(l.source) && filteredNodeIds.has(l.target)
  ).length

  const selectedConnections = useMemo(() => {
    if (!selectedNode) return []
    return filteredLinks
      .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
      .map(l => {
        const otherId = l.source === selectedNode.id ? l.target : l.source
        const other   = ALL_NODES.find(n => n.id === otherId)
        return { nombre: other?.nombre ?? '', partido: other?.partido ?? '', weight: l.weight }
      })
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8)
  }, [selectedNode, filteredLinks])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Buscar congresista</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre, bancada o región..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            <div className="w-[220px]">
              <label className="text-xs text-muted-foreground mb-1 block">Bancada</label>
              <MultiSelect
                options={partidoOptions}
                selected={selectedPartidos}
                onChange={setSelectedPartidos}
                placeholder="Todas las bancadas"
              />
            </div>

            <div className="w-[130px]">
              <label className="text-xs text-muted-foreground mb-1 block">Desde</label>
              <Input type="month" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="h-9" />
            </div>

            <div className="w-[130px]">
              <label className="text-xs text-muted-foreground mb-1 block">Hasta</label>
              <Input type="month" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="h-9" />
            </div>

            <Button variant="outline" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Graph */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Red de Coautorias</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {visibleNodes} congresistas · {visibleLinks} vinculos · Haz clic en un nodo para explorar sus conexiones
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(3, z * 1.2))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.3, z * 0.8))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div
            ref={containerRef}
            className="relative bg-muted/30 rounded-lg overflow-hidden"
            style={{ height: '560px' }}
          >
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="cursor-grab active:cursor-grabbing"
              style={{ width: '100%', height: '100%' }}
            />

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg p-2.5 text-xs">
              <div className="font-medium mb-1.5 text-foreground">Bancadas</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {partidos.map(partido => (
                  <div key={partido} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: partyColors[partido] }} />
                    <span className="text-muted-foreground truncate" style={{ maxWidth: '90px' }}>
                      {partido}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-border text-muted-foreground space-y-0.5">
                <div>Linea gruesa = mas proyectos compartidos</div>
                <div>Arrastra para mover | Rueda para zoom</div>
              </div>
            </div>

            {/* Selected node panel */}
            {selectedNode && (
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg w-[230px]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-semibold text-sm leading-tight">{selectedNode.nombre}</div>
                    <Badge
                      variant="outline"
                      className="mt-1 text-[10px]"
                      style={{ borderColor: partyColors[selectedNode.partido], color: partyColors[selectedNode.partido] }}
                    >
                      {selectedNode.partido}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-0.5">{selectedNode.region}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 flex-shrink-0" onClick={() => setSelectedNode(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mb-1.5 font-medium">
                  {connectedNodeIds.size} conexiones
                </div>
                <div className="space-y-1 max-h-[180px] overflow-y-auto">
                  {selectedConnections.map((c, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="text-xs truncate">{c.nombre.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="text-xs font-semibold text-primary flex-shrink-0">{c.weight} PL</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
