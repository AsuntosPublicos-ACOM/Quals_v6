'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MultiSelect } from '@/components/ui/multi-select'
import { SortableHead } from '@/components/ui/sortable-head'
import { useSortableTable } from '@/hooks/use-sortable-table'

interface ElPeruanoViewProps {
  onBack: () => void
}

const resoluciones = [
  { fecha: '2024-03-15', codigo: 'RS-001-2024-PCM',    institucion: 'PCM',    tipoResolucion: 'Resolución Suprema',          medida: 'Aprueban lineamientos para la implementación del gobierno digital en entidades públicas', relevancia: 'Media' },
  { fecha: '2024-03-14', codigo: 'RD-045-2024-MEF',    institucion: 'MEF',    tipoResolucion: 'Resolución Directoral',        medida: 'Establecen disposiciones para la ejecución presupuestal del ejercicio fiscal 2024', relevancia: 'Alta' },
  { fecha: '2024-03-13', codigo: 'RM-089-2024-MINSA',  institucion: 'MINSA',  tipoResolucion: 'Resolución Ministerial',       medida: 'Aprueban protocolo de atención para enfermedades respiratorias en temporada de invierno', relevancia: 'Alta' },
  { fecha: '2024-03-12', codigo: 'RVM-023-2024-MINEDU',institucion: 'MINEDU', tipoResolucion: 'Resolución Viceministerial',   medida: 'Modifican cronograma del año escolar 2024 para instituciones educativas públicas', relevancia: 'Media' },
  { fecha: '2024-03-11', codigo: 'RS-002-2024-MTPE',   institucion: 'MTPE',   tipoResolucion: 'Resolución Suprema',          medida: 'Aprueban reglamento de la Ley de Teletrabajo para el sector privado', relevancia: 'Alta' },
  { fecha: '2024-03-10', codigo: 'RD-078-2024-PRODUCE',institucion: 'PRODUCE',tipoResolucion: 'Resolución Directoral',        medida: 'Establecen vedas temporales para especies marinas en la zona norte del país', relevancia: 'Baja' },
  { fecha: '2024-03-09', codigo: 'RM-156-2024-MTC',    institucion: 'MTC',    tipoResolucion: 'Resolución Ministerial',       medida: 'Aprueban especificaciones técnicas para vehículos de transporte público eléctrico', relevancia: 'Media' },
  { fecha: '2024-03-08', codigo: 'RS-003-2024-MINAM',  institucion: 'MINAM',  tipoResolucion: 'Resolución Suprema',          medida: 'Declaran en emergencia ambiental cuencas hidrográficas afectadas por minería ilegal', relevancia: 'Alta' },
  { fecha: '2024-03-07', codigo: 'RM-201-2024-MINCUL', institucion: 'MINCUL', tipoResolucion: 'Resolución Ministerial',       medida: 'Declaran patrimonio cultural de la nación a manifestaciones del folclore andino', relevancia: 'Baja' },
  { fecha: '2024-03-06', codigo: 'RD-112-2024-MEF',    institucion: 'MEF',    tipoResolucion: 'Resolución Directoral',        medida: 'Aprueban modificaciones al Marco Macroeconómico Multianual 2024-2027', relevancia: 'Alta' },
  { fecha: '2024-03-05', codigo: 'RVM-044-2024-MINSA', institucion: 'MINSA',  tipoResolucion: 'Resolución Viceministerial',   medida: 'Amplían cobertura del Seguro Integral de Salud para población migrante', relevancia: 'Media' },
  { fecha: '2024-03-04', codigo: 'RS-004-2024-MTC',    institucion: 'MTC',    tipoResolucion: 'Resolución Suprema',          medida: 'Declaran de necesidad pública la construcción de tramo vial en la región Loreto', relevancia: 'Alta' },
]

const designaciones = [
  { fecha: '2024-03-15', codigo: 'RD-001-2024-PCM',    institucion: 'PCM',    cargo: 'Secretario General',                        medida: 'Designan Secretario General de la Presidencia del Consejo de Ministros', relevancia: 'Alta' },
  { fecha: '2024-03-14', codigo: 'RM-012-2024-MEF',    institucion: 'MEF',    cargo: 'Director General',                          medida: 'Designan Director General de Presupuesto Público del MEF', relevancia: 'Alta' },
  { fecha: '2024-03-13', codigo: 'RD-034-2024-MINSA',  institucion: 'MINSA',  cargo: 'Director Ejecutivo',                        medida: 'Designan Director Ejecutivo de la Dirección de Medicamentos, Insumos y Drogas', relevancia: 'Media' },
  { fecha: '2024-03-12', codigo: 'RM-067-2024-MINEDU', institucion: 'MINEDU', cargo: 'Directora de Área',                         medida: 'Designan Directora de la Dirección de Educación Básica Regular', relevancia: 'Media' },
  { fecha: '2024-03-11', codigo: 'RD-089-2024-MTPE',   institucion: 'MTPE',   cargo: 'Superintendente',                           medida: 'Designan Superintendente de SUNAFIL', relevancia: 'Alta' },
  { fecha: '2024-03-10', codigo: 'RM-045-2024-MIDIS',  institucion: 'MIDIS',  cargo: 'Coordinador Nacional',                      medida: 'Designan Coordinador Nacional del Programa Qali Warma', relevancia: 'Media' },
  { fecha: '2024-03-09', codigo: 'RS-007-2024-PCM',    institucion: 'PCM',    cargo: 'Viceministro',                              medida: 'Designan Viceministro de Gobernanza Territorial de la PCM', relevancia: 'Alta' },
  { fecha: '2024-03-08', codigo: 'RM-033-2024-MTC',    institucion: 'MTC',    cargo: 'Director General',                          medida: 'Designan Director General de Caminos y Ferrocarriles del MTC', relevancia: 'Media' },
  { fecha: '2024-03-07', codigo: 'RD-056-2024-PRODUCE',institucion: 'PRODUCE',cargo: 'Gerente de Área',                           medida: 'Designan Gerente General de Innóvate Perú', relevancia: 'Baja' },
  { fecha: '2024-03-06', codigo: 'RM-091-2024-MINAM',  institucion: 'MINAM',  cargo: 'Director Ejecutivo',                        medida: 'Designan Director Ejecutivo del Servicio Nacional de Áreas Naturales Protegidas', relevancia: 'Media' },
  { fecha: '2024-03-05', codigo: 'RD-078-2024-MINCUL', institucion: 'MINCUL', cargo: 'Directora Nacional',                        medida: 'Designan Directora Nacional de Industrias Culturales y Artes', relevancia: 'Baja' },
  { fecha: '2024-03-04', codigo: 'RM-014-2024-MEF',    institucion: 'MEF',    cargo: 'Asesor',                                    medida: 'Designan Asesor de la Alta Dirección del MEF en materia de política fiscal', relevancia: 'Baja' },
]

export function ElPeruanoView({ onBack }: ElPeruanoViewProps) {
  const [activeTab, setActiveTab] = useState('resoluciones')

  // Shared filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstituciones, setSelectedInstituciones] = useState<string[]>([])
  const [selectedTipoResolucion, setSelectedTipoResolucion] = useState<string[]>([])
  const [selectedRelevancia, setSelectedRelevancia] = useState<string[]>([])
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const institucionesResol = useMemo(() => [...new Set(resoluciones.map(r => r.institucion))].sort().map(i => ({ label: i, value: i })), [])
  const institucionesDesig = useMemo(() => [...new Set(designaciones.map(d => d.institucion))].sort().map(i => ({ label: i, value: i })), [])
  const todasInstituciones = useMemo(() => {
    const all = [...new Set([...resoluciones, ...designaciones].map(r => r.institucion))].sort()
    return all.map(i => ({ label: i, value: i }))
  }, [])
  const tiposResolucion = useMemo(() => [...new Set(resoluciones.map(r => r.tipoResolucion))].sort().map(t => ({ label: t, value: t })), [])
  const relevanciaOptions = [
    { label: 'Alta', value: 'Alta' },
    { label: 'Media', value: 'Media' },
    { label: 'Baja', value: 'Baja' },
  ]

  const applyFilters = <T extends { fecha: string; codigo: string; institucion: string; medida: string; relevancia?: string; tipoResolucion?: string }>(data: T[]): T[] => {
    return data.filter(item => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || (
        item.codigo.toLowerCase().includes(q) ||
        item.medida.toLowerCase().includes(q) ||
        item.institucion.toLowerCase().includes(q)
      )
      const matchesInstitucion = selectedInstituciones.length === 0 || selectedInstituciones.includes(item.institucion)
      const matchesTipoResolucion = selectedTipoResolucion.length === 0 || (item.tipoResolucion && selectedTipoResolucion.includes(item.tipoResolucion))
      const matchesRelevancia = selectedRelevancia.length === 0 || (item.relevancia && selectedRelevancia.includes(item.relevancia))
      const matchesFechaDesde = !fechaDesde || item.fecha >= fechaDesde
      const matchesFechaHasta = !fechaHasta || item.fecha <= fechaHasta
      return matchesSearch && matchesInstitucion && matchesTipoResolucion && matchesRelevancia && matchesFechaDesde && matchesFechaHasta
    })
  }

  const filteredResoluciones = useMemo(() => applyFilters(resoluciones), [searchQuery, selectedInstituciones, selectedTipoResolucion, selectedRelevancia, fechaDesde, fechaHasta])
  const filteredDesignaciones = useMemo(() => applyFilters(designaciones), [searchQuery, selectedInstituciones, fechaDesde, fechaHasta])

  const { sort: sortResol, toggleSort: toggleResol, sortedData: sortedResoluciones } = useSortableTable(filteredResoluciones)
  const { sort: sortDesig, toggleSort: toggleDesig, sortedData: sortedDesignaciones } = useSortableTable(filteredDesignaciones)

  const hasFilters = searchQuery || selectedInstituciones.length > 0 || selectedTipoResolucion.length > 0 || selectedRelevancia.length > 0 || fechaDesde || fechaHasta

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedInstituciones([])
    setSelectedTipoResolucion([])
    setSelectedRelevancia([])
    setFechaDesde('')
    setFechaHasta('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">El Peruano</h1>
          <p className="text-sm text-muted-foreground">Diario Oficial — Normas Legales</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Text search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, medida o institución..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Institution filter */}
            <div className="min-w-[200px]">
              <MultiSelect
                options={todasInstituciones}
                selected={selectedInstituciones}
                onChange={setSelectedInstituciones}
                placeholder="Institución"
              />
            </div>

            {/* Tipo de resolución filter (only for resoluciones tab) */}
            {activeTab === 'resoluciones' && (
              <div className="min-w-[220px]">
                <MultiSelect
                  options={tiposResolucion}
                  selected={selectedTipoResolucion}
                  onChange={setSelectedTipoResolucion}
                  placeholder="Tipo de resolución"
                />
              </div>
            )}

            {/* Relevancia filter (only for resoluciones tab) */}
            {activeTab === 'resoluciones' && (
              <div className="min-w-[160px]">
                <MultiSelect
                  options={relevanciaOptions}
                  selected={selectedRelevancia}
                  onChange={setSelectedRelevancia}
                  placeholder="Relevancia"
                />
              </div>
            )}

            {/* Date range */}
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                className="w-[140px] text-xs"
                placeholder="Desde"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <Input
                type="date"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                className="w-[140px] text-xs"
                placeholder="Hasta"
              />
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                <X className="h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publicaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="resoluciones">
                Resoluciones
                <Badge variant="secondary" className="ml-2 text-[10px]">{filteredResoluciones.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="designaciones">
                Designaciones
                <Badge variant="secondary" className="ml-2 text-[10px]">{filteredDesignaciones.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Resoluciones */}
            <TabsContent value="resoluciones">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <SortableHead column="fecha"          sort={sortResol} onSort={toggleResol} className="w-[100px]">Fecha</SortableHead>
                      <SortableHead column="codigo"         sort={sortResol} onSort={toggleResol} className="w-[180px]">Código</SortableHead>
                      <SortableHead column="institucion"    sort={sortResol} onSort={toggleResol} className="w-[110px]">Institución</SortableHead>
                      <SortableHead column="tipoResolucion" sort={sortResol} onSort={toggleResol} className="w-[170px]">Tipo de resolución</SortableHead>
                      <SortableHead column="relevancia"     sort={sortResol} onSort={toggleResol} className="w-[120px]">Relevancia</SortableHead>
                      <SortableHead column="medida"         sort={sortResol} onSort={toggleResol}>Medida</SortableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedResoluciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron resoluciones</TableCell>
                      </TableRow>
                    ) : sortedResoluciones.map((item, i) => (
                      <TableRow key={i} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">{item.fecha}</TableCell>
                        <TableCell className="font-mono text-xs text-primary">{item.codigo}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{item.institucion}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.tipoResolucion}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold ${
                            item.relevancia === 'Alta' ? 'text-emerald-600 dark:text-emerald-400' :
                            item.relevancia === 'Media' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>{item.relevancia}</span>
                        </TableCell>
                        <TableCell className="text-sm">{item.medida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Designaciones */}
            <TabsContent value="designaciones">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <SortableHead column="fecha"       sort={sortDesig} onSort={toggleDesig} className="w-[100px]">Fecha</SortableHead>
                      <SortableHead column="codigo"      sort={sortDesig} onSort={toggleDesig} className="w-[180px]">Código</SortableHead>
                      <SortableHead column="institucion" sort={sortDesig} onSort={toggleDesig} className="w-[110px]">Institución</SortableHead>
                      <SortableHead column="cargo"       sort={sortDesig} onSort={toggleDesig} className="w-[160px]">Cargo</SortableHead>
                      <SortableHead column="relevancia"  sort={sortDesig} onSort={toggleDesig} className="w-[120px]">Relevancia</SortableHead>
                      <SortableHead column="medida"      sort={sortDesig} onSort={toggleDesig}>Medida</SortableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedDesignaciones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No se encontraron designaciones</TableCell>
                      </TableRow>
                    ) : sortedDesignaciones.map((item, i) => (
                      <TableRow key={i} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-xs">{item.fecha}</TableCell>
                        <TableCell className="font-mono text-xs text-primary">{item.codigo}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{item.institucion}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.cargo}</TableCell>
                        <TableCell>
                          <span className={`text-xs font-semibold ${
                            item.relevancia === 'Alta' ? 'text-emerald-600 dark:text-emerald-400' :
                            item.relevancia === 'Media' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>{item.relevancia}</span>
                        </TableCell>
                        <TableCell className="text-sm">{item.medida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
