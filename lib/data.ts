import type { Sector, ProyectoLey, Congresista, LeyAprobada } from './types'

// Meses disponibles para seleccion
export const availableMonths = [
  { value: '2024-03', label: 'Marzo 2024' },
  { value: '2024-02', label: 'Febrero 2024' },
  { value: '2024-01', label: 'Enero 2024' },
  { value: '2023-12', label: 'Diciembre 2023' },
  { value: '2023-11', label: 'Noviembre 2023' },
  { value: '2023-10', label: 'Octubre 2023' },
]

export const comisiones = [
  'Comisión de Economía',
  'Comisión de Salud',
  'Comisión de Educación',
  'Comisión de Energía y Minas',
  'Comisión de Transportes',
  'Comisión de Justicia',
  'Comisión de Trabajo',
  'Comisión Agraria',
  'Comisión de Defensa Nacional',
  'Comisión de Pueblos Amazónicos',
  'Comisión de Vivienda',
  'Comisión de Cultura',
  'Comisión de la Mujer',
  'Comisión de Relaciones Exteriores',
]

export const partidos = [
  'Partido Popular',
  'Alianza para el Progreso',
  'Fuerza Nacional',
  'Union por el Peru',
  'Movimiento Regional',
  'Accion Popular',
  'Peru Libre',
  'Renovacion Popular',
]

export const sectores: Sector[] = [
  {
    id: 'economia',
    name: 'Economia y Finanzas',
    icon: 'TrendingUp',
    description: 'Politica economica, tributacion y finanzas publicas',
    monthlyData: [
      { month: '2024-03', projectCount: 18, dictamenCount: 5, leyCount: 2 },
      { month: '2024-02', projectCount: 12, dictamenCount: 3, leyCount: 1 },
      { month: '2024-01', projectCount: 15, dictamenCount: 4, leyCount: 1 },
      { month: '2023-12', projectCount: 8, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 10, dictamenCount: 3, leyCount: 1 },
      { month: '2023-10', projectCount: 7, dictamenCount: 2, leyCount: 0 },
    ],
    trends: [
      { tema: 'Reforma tributaria', frecuencia: 12, tendencia: 'subiendo' },
      { tema: 'Simplificacion administrativa', frecuencia: 8, tendencia: 'estable' },
      { tema: 'Presupuesto publico', frecuencia: 6, tendencia: 'bajando' },
      { tema: 'Deuda externa', frecuencia: 4, tendencia: 'estable' },
    ]
  },
  {
    id: 'salud',
    name: 'Salud',
    icon: 'Heart',
    description: 'Salud publica, seguros y atencion medica',
    monthlyData: [
      { month: '2024-03', projectCount: 14, dictamenCount: 4, leyCount: 1 },
      { month: '2024-02', projectCount: 16, dictamenCount: 5, leyCount: 2 },
      { month: '2024-01', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2023-12', projectCount: 9, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 12, dictamenCount: 4, leyCount: 1 },
      { month: '2023-10', projectCount: 8, dictamenCount: 2, leyCount: 0 },
    ],
    trends: [
      { tema: 'Acceso a medicamentos', frecuencia: 10, tendencia: 'subiendo' },
      { tema: 'Infraestructura hospitalaria', frecuencia: 7, tendencia: 'subiendo' },
      { tema: 'Salud mental', frecuencia: 5, tendencia: 'estable' },
      { tema: 'Personal medico', frecuencia: 4, tendencia: 'bajando' },
    ]
  },
  {
    id: 'educacion',
    name: 'Educacion',
    icon: 'GraduationCap',
    description: 'Educacion basica, superior y formacion tecnica',
    monthlyData: [
      { month: '2024-03', projectCount: 22, dictamenCount: 6, leyCount: 3 },
      { month: '2024-02', projectCount: 18, dictamenCount: 5, leyCount: 2 },
      { month: '2024-01', projectCount: 20, dictamenCount: 4, leyCount: 2 },
      { month: '2023-12', projectCount: 14, dictamenCount: 3, leyCount: 1 },
      { month: '2023-11', projectCount: 16, dictamenCount: 4, leyCount: 1 },
      { month: '2023-10', projectCount: 12, dictamenCount: 3, leyCount: 1 },
    ],
    trends: [
      { tema: 'Educacion digital', frecuencia: 15, tendencia: 'subiendo' },
      { tema: 'Infraestructura escolar', frecuencia: 9, tendencia: 'estable' },
      { tema: 'Educacion superior', frecuencia: 7, tendencia: 'subiendo' },
      { tema: 'Docentes', frecuencia: 6, tendencia: 'estable' },
    ]
  },
  {
    id: 'energia',
    name: 'Energia y Minas',
    icon: 'Zap',
    description: 'Recursos energeticos, mineria y medio ambiente',
    monthlyData: [
      { month: '2024-03', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2024-02', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2024-01', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2023-12', projectCount: 9, dictamenCount: 2, leyCount: 1 },
      { month: '2023-11', projectCount: 7, dictamenCount: 2, leyCount: 0 },
      { month: '2023-10', projectCount: 5, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Energias renovables', frecuencia: 8, tendencia: 'subiendo' },
      { tema: 'Mineria artesanal', frecuencia: 5, tendencia: 'estable' },
      { tema: 'Hidrocarburos', frecuencia: 3, tendencia: 'bajando' },
    ]
  },
  {
    id: 'transporte',
    name: 'Transporte',
    icon: 'Truck',
    description: 'Infraestructura vial, transporte publico y aviacion',
    monthlyData: [
      { month: '2024-03', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2024-02', projectCount: 9, dictamenCount: 2, leyCount: 0 },
      { month: '2024-01', projectCount: 13, dictamenCount: 4, leyCount: 2 },
      { month: '2023-12', projectCount: 7, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2023-10', projectCount: 6, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Transporte urbano', frecuencia: 9, tendencia: 'subiendo' },
      { tema: 'Infraestructura vial', frecuencia: 6, tendencia: 'estable' },
      { tema: 'Seguridad vial', frecuencia: 4, tendencia: 'estable' },
    ]
  },
  {
    id: 'justicia',
    name: 'Justicia',
    icon: 'Scale',
    description: 'Sistema judicial, derechos y reformas legales',
    monthlyData: [
      { month: '2024-03', projectCount: 19, dictamenCount: 6, leyCount: 2 },
      { month: '2024-02', projectCount: 22, dictamenCount: 7, leyCount: 3 },
      { month: '2024-01', projectCount: 17, dictamenCount: 5, leyCount: 2 },
      { month: '2023-12', projectCount: 15, dictamenCount: 4, leyCount: 1 },
      { month: '2023-11', projectCount: 18, dictamenCount: 5, leyCount: 2 },
      { month: '2023-10', projectCount: 14, dictamenCount: 4, leyCount: 1 },
    ],
    trends: [
      { tema: 'Reforma judicial', frecuencia: 14, tendencia: 'subiendo' },
      { tema: 'Lucha anticorrupcion', frecuencia: 10, tendencia: 'subiendo' },
      { tema: 'Sistema penitenciario', frecuencia: 6, tendencia: 'estable' },
      { tema: 'Derechos humanos', frecuencia: 5, tendencia: 'estable' },
    ]
  },
  {
    id: 'trabajo',
    name: 'Trabajo',
    icon: 'Briefcase',
    description: 'Legislacion laboral, empleo y seguridad social',
    monthlyData: [
      { month: '2024-03', projectCount: 13, dictamenCount: 4, leyCount: 1 },
      { month: '2024-02', projectCount: 10, dictamenCount: 3, leyCount: 1 },
      { month: '2024-01', projectCount: 14, dictamenCount: 4, leyCount: 2 },
      { month: '2023-12', projectCount: 8, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2023-10', projectCount: 9, dictamenCount: 2, leyCount: 0 },
    ],
    trends: [
      { tema: 'Trabajo remoto', frecuencia: 8, tendencia: 'subiendo' },
      { tema: 'Derechos laborales', frecuencia: 7, tendencia: 'estable' },
      { tema: 'Pensiones', frecuencia: 5, tendencia: 'estable' },
    ]
  },
  {
    id: 'agricultura',
    name: 'Agricultura',
    icon: 'Leaf',
    description: 'Desarrollo agrario, riego y produccion alimentaria',
    monthlyData: [
      { month: '2024-03', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2024-02', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2024-01', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2023-12', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2023-11', projectCount: 6, dictamenCount: 2, leyCount: 1 },
      { month: '2023-10', projectCount: 3, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Agricultura familiar', frecuencia: 5, tendencia: 'estable' },
      { tema: 'Riego tecnificado', frecuencia: 4, tendencia: 'subiendo' },
      { tema: 'Agroexportacion', frecuencia: 3, tendencia: 'estable' },
    ]
  },
  {
    id: 'defensa',
    name: 'Defensa Nacional',
    icon: 'Shield',
    description: 'Fuerzas armadas, seguridad nacional y defensa',
    monthlyData: [
      { month: '2024-03', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2024-02', projectCount: 6, dictamenCount: 2, leyCount: 1 },
      { month: '2024-01', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2023-12', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2023-11', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2023-10', projectCount: 2, dictamenCount: 0, leyCount: 0 },
    ],
    trends: [
      { tema: 'Modernizacion FFAA', frecuencia: 4, tendencia: 'estable' },
      { tema: 'Fronteras', frecuencia: 2, tendencia: 'estable' },
    ]
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: 'Building2',
    description: 'Seguridad ciudadana, policia y orden interno',
    monthlyData: [
      { month: '2024-03', projectCount: 16, dictamenCount: 5, leyCount: 2 },
      { month: '2024-02', projectCount: 14, dictamenCount: 4, leyCount: 1 },
      { month: '2024-01', projectCount: 18, dictamenCount: 5, leyCount: 2 },
      { month: '2023-12', projectCount: 12, dictamenCount: 3, leyCount: 1 },
      { month: '2023-11', projectCount: 15, dictamenCount: 4, leyCount: 1 },
      { month: '2023-10', projectCount: 11, dictamenCount: 3, leyCount: 1 },
    ],
    trends: [
      { tema: 'Seguridad ciudadana', frecuencia: 12, tendencia: 'subiendo' },
      { tema: 'Policia Nacional', frecuencia: 8, tendencia: 'estable' },
      { tema: 'Crimen organizado', frecuencia: 6, tendencia: 'subiendo' },
    ]
  },
  {
    id: 'ambiente',
    name: 'Medio Ambiente',
    icon: 'TreePine',
    description: 'Proteccion ambiental, recursos naturales y biodiversidad',
    monthlyData: [
      { month: '2024-03', projectCount: 9, dictamenCount: 3, leyCount: 1 },
      { month: '2024-02', projectCount: 7, dictamenCount: 2, leyCount: 0 },
      { month: '2024-01', projectCount: 10, dictamenCount: 3, leyCount: 1 },
      { month: '2023-12', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2023-10', projectCount: 5, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Cambio climatico', frecuencia: 7, tendencia: 'subiendo' },
      { tema: 'Amazonia', frecuencia: 5, tendencia: 'subiendo' },
      { tema: 'Residuos solidos', frecuencia: 4, tendencia: 'estable' },
    ]
  },
  {
    id: 'cultura',
    name: 'Cultura',
    icon: 'Palette',
    description: 'Patrimonio cultural, artes y promocion cultural',
    monthlyData: [
      { month: '2024-03', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2024-02', projectCount: 5, dictamenCount: 1, leyCount: 1 },
      { month: '2024-01', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2023-12', projectCount: 2, dictamenCount: 0, leyCount: 0 },
      { month: '2023-11', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2023-10', projectCount: 2, dictamenCount: 0, leyCount: 0 },
    ],
    trends: [
      { tema: 'Patrimonio cultural', frecuencia: 3, tendencia: 'estable' },
      { tema: 'Industrias culturales', frecuencia: 2, tendencia: 'subiendo' },
    ]
  },
  {
    id: 'vivienda',
    name: 'Vivienda',
    icon: 'Home',
    description: 'Construccion, saneamiento y desarrollo urbano',
    monthlyData: [
      { month: '2024-03', projectCount: 7, dictamenCount: 2, leyCount: 1 },
      { month: '2024-02', projectCount: 9, dictamenCount: 3, leyCount: 1 },
      { month: '2024-01', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2023-12', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2023-11', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2023-10', projectCount: 4, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Vivienda social', frecuencia: 6, tendencia: 'subiendo' },
      { tema: 'Saneamiento', frecuencia: 4, tendencia: 'estable' },
      { tema: 'Urbanismo', frecuencia: 3, tendencia: 'estable' },
    ]
  },
  {
    id: 'mujer',
    name: 'Mujer y Poblaciones Vulnerables',
    icon: 'Users',
    description: 'Igualdad de genero, ninez y poblaciones vulnerables',
    monthlyData: [
      { month: '2024-03', projectCount: 12, dictamenCount: 4, leyCount: 1 },
      { month: '2024-02', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2024-01', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2023-12', projectCount: 7, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 9, dictamenCount: 3, leyCount: 1 },
      { month: '2023-10', projectCount: 6, dictamenCount: 2, leyCount: 0 },
    ],
    trends: [
      { tema: 'Violencia de genero', frecuencia: 9, tendencia: 'subiendo' },
      { tema: 'Proteccion infantil', frecuencia: 6, tendencia: 'estable' },
      { tema: 'Adulto mayor', frecuencia: 4, tendencia: 'estable' },
    ]
  },
  {
    id: 'turismo',
    name: 'Turismo y Comercio',
    icon: 'Globe',
    description: 'Turismo, comercio exterior e inversion',
    monthlyData: [
      { month: '2024-03', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2024-02', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2024-01', projectCount: 6, dictamenCount: 2, leyCount: 1 },
      { month: '2023-12', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2023-11', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2023-10', projectCount: 2, dictamenCount: 0, leyCount: 0 },
    ],
    trends: [
      { tema: 'Reactivacion turistica', frecuencia: 4, tendencia: 'subiendo' },
      { tema: 'Exportaciones', frecuencia: 3, tendencia: 'estable' },
    ]
  },
  {
    id: 'ciencia',
    name: 'Ciencia y Tecnologia',
    icon: 'Zap',
    description: 'Investigacion, desarrollo e innovacion',
    monthlyData: [
      { month: '2024-03', projectCount: 7, dictamenCount: 2, leyCount: 1 },
      { month: '2024-02', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2024-01', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2023-12', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2023-11', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2023-10', projectCount: 3, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Transformacion digital', frecuencia: 6, tendencia: 'subiendo' },
      { tema: 'Investigacion', frecuencia: 4, tendencia: 'estable' },
      { tema: 'Startups', frecuencia: 3, tendencia: 'subiendo' },
    ]
  },
  {
    id: 'telecomunicaciones',
    name: 'Telecomunicaciones',
    icon: 'Zap',
    description: 'Telecomunicaciones, radiodifusion e internet',
    monthlyData: [
      { month: '2024-03', projectCount: 9, dictamenCount: 3, leyCount: 1 },
      { month: '2024-02', projectCount: 7, dictamenCount: 2, leyCount: 0 },
      { month: '2024-01', projectCount: 11, dictamenCount: 3, leyCount: 1 },
      { month: '2023-12', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2023-11', projectCount: 9, dictamenCount: 2, leyCount: 1 },
      { month: '2023-10', projectCount: 5, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Conectividad rural', frecuencia: 7, tendencia: 'subiendo' },
      { tema: 'Ciberseguridad', frecuencia: 5, tendencia: 'subiendo' },
      { tema: 'Espectro radioelectrico', frecuencia: 3, tendencia: 'estable' },
    ]
  },
  {
    id: 'deporte',
    name: 'Deporte y Recreacion',
    icon: 'Briefcase',
    description: 'Promocion del deporte y actividad fisica',
    monthlyData: [
      { month: '2024-03', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2024-02', projectCount: 2, dictamenCount: 0, leyCount: 0 },
      { month: '2024-01', projectCount: 4, dictamenCount: 1, leyCount: 0 },
      { month: '2023-12', projectCount: 1, dictamenCount: 0, leyCount: 0 },
      { month: '2023-11', projectCount: 3, dictamenCount: 1, leyCount: 0 },
      { month: '2023-10', projectCount: 1, dictamenCount: 0, leyCount: 0 },
    ],
    trends: [
      { tema: 'Deporte escolar', frecuencia: 2, tendencia: 'estable' },
      { tema: 'Alto rendimiento', frecuencia: 2, tendencia: 'estable' },
    ]
  },
  {
    id: 'cooperacion',
    name: 'Cooperacion Internacional',
    icon: 'Globe',
    description: 'Tratados, acuerdos y cooperacion bilateral',
    monthlyData: [
      { month: '2024-03', projectCount: 1, dictamenCount: 0, leyCount: 0 },
      { month: '2024-02', projectCount: 2, dictamenCount: 1, leyCount: 0 },
      { month: '2024-01', projectCount: 1, dictamenCount: 0, leyCount: 0 },
      { month: '2023-12', projectCount: 0, dictamenCount: 0, leyCount: 0 },
      { month: '2023-11', projectCount: 1, dictamenCount: 0, leyCount: 0 },
      { month: '2023-10', projectCount: 0, dictamenCount: 0, leyCount: 0 },
    ],
    trends: [
      { tema: 'Tratados comerciales', frecuencia: 1, tendencia: 'estable' },
    ]
  },
  {
    id: 'descentralizacion',
    name: 'Descentralizacion',
    icon: 'Building2',
    description: 'Gobiernos regionales y locales',
    monthlyData: [
      { month: '2024-03', projectCount: 8, dictamenCount: 2, leyCount: 1 },
      { month: '2024-02', projectCount: 6, dictamenCount: 2, leyCount: 0 },
      { month: '2024-01', projectCount: 9, dictamenCount: 3, leyCount: 1 },
      { month: '2023-12', projectCount: 5, dictamenCount: 1, leyCount: 0 },
      { month: '2023-11', projectCount: 7, dictamenCount: 2, leyCount: 1 },
      { month: '2023-10', projectCount: 4, dictamenCount: 1, leyCount: 0 },
    ],
    trends: [
      { tema: 'Transferencia competencias', frecuencia: 5, tendencia: 'estable' },
      { tema: 'Presupuesto regional', frecuencia: 4, tendencia: 'subiendo' },
    ]
  },
]

export const congresistas: Congresista[] = [
  { 
    id: '1', 
    nombre: 'Maria Elena Torres', 
    partido: 'Partido Popular', 
    region: 'Lima',
    tipo: 'diputado',
    proyectosCount: 28,
    leyesAprobadas: 8,
    topComisiones: [
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] },
      { sectorId: 'justicia', comisiones: ['Comisión de Justicia'] }
    ],
    cargosHistoria: [
      { cargo: 'Vicepresidenta de Comisión de Economía', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con destacada trayectoria en políticas económicas y fiscales, conocida por su postura técnica y propositiva en el debate legislativo. Ha liderado iniciativas orientadas a la formalización del sector empresarial y la reducción de barreras burocráticas para la inversión privada.\n\nSu estilo legislativo se caracteriza por la construcción de consensos entre bancadas y la articulación con gremios empresariales. Mantiene una posición favorable a la desregulación sectorial y ha mostrado interés constante en reformas tributarias que amplíen la base de contribuyentes.',
    hitosClaves: [
      {
        id: 'hito-1-1',
        descripcion: 'Votó a favor de la Ley de Reforma Tributaria 2024 que amplió la base de contribuyentes',
        fecha: '2024-03-15',
        tipo: 'votacion'
      },
      {
        id: 'hito-1-2',
        descripcion: 'Entrevista en "Panorama" sobre flexibilización de regulaciones empresariales',
        fecha: '2024-03-10',
        tipo: 'entrevista'
      },
      {
        id: 'hito-1-3',
        descripcion: 'Presentó proyecto de ley para reducción de barreras administrativas para MYPES',
        fecha: '2024-02-28',
        tipo: 'evento'
      },
      {
        id: 'hito-1-4',
        descripcion: 'Dictamen favorable de proyecto sobre formalización del comercio informal',
        fecha: '2024-02-15',
        tipo: 'votacion'
      },
      {
        id: 'hito-1-5',
        descripcion: 'Investigación por presunta influencia de gremios en su voto',
        fecha: '2024-01-20',
        tipo: 'investigacion'
      }
    ]
  },
  { 
    id: '2', 
    nombre: 'Carlos Mendoza Rivera', 
    partido: 'Alianza para el Progreso', 
    region: 'Arequipa',
    tipo: 'diputado',
    proyectosCount: 15,
    leyesAprobadas: 4,
    topComisiones: [
      { sectorId: 'educacion', comisiones: ['Comisión de Educación'] },
      { sectorId: 'cultura', comisiones: ['Comisión de Cultura'] },
      { sectorId: 'trabajo', comisiones: ['Comisión de Trabajo'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Educación', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista enfocado en políticas educativas y culturales, con especial énfasis en la educación rural y la reducción de brechas de acceso en regiones alejadas. Su agenda legislativa ha priorizado el incremento del presupuesto para infraestructura escolar y la profesionalización docente.\n\nEn el ámbito laboral, ha promovido reformas para mejorar las condiciones de los trabajadores del sector público. Es reconocido por su trabajo de campo en la región Arequipa y su capacidad para traducir demandas locales en iniciativas legislativas concretas.',
  },
  { 
    id: '3', 
    nombre: 'Rosa Gutierrez Perez', 
    partido: 'Fuerza Nacional', 
    region: 'La Libertad',
    tipo: 'diputado',
    proyectosCount: 32,
    leyesAprobadas: 12,
    topComisiones: [
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'trabajo', comisiones: ['Comisión de Trabajo'] },
      { sectorId: 'energia', comisiones: ['Comisión de Energía y Minas'] }
    ],
    cargosHistoria: [
      { cargo: 'Presidenta de Comisión de Trabajo', desde: '2023-06' }
    ],
    perfilCualitativo: 'Una de las parlamentarias más activas en materia económica y laboral, con una visión pro-empleo y de fortalecimiento de la competitividad industrial. Ha impulsado proyectos orientados a la flexibilización regulatoria en sectores de energía y minería, alineados con las demandas de la región La Libertad.\n\nCon experiencia previa en gestión regional, aporta al debate legislativo una perspectiva práctica sobre la implementación de políticas públicas. Su postura suele ser crítica frente a regulaciones que considera restrictivas para la inversión y el desarrollo productivo.',
    hitosClaves: [
      {
        id: 'hito-3-1',
        descripcion: 'Votó a favor de la Ley de Flexibilización Laboral que redujo restricciones para contrataciones',
        fecha: '2024-03-18',
        tipo: 'votacion'
      },
      {
        id: 'hito-3-2',
        descripcion: 'Presentó proyecto de promoción de minería responsable en regiones',
        fecha: '2024-03-05',
        tipo: 'evento'
      },
      {
        id: 'hito-3-3',
        descripcion: 'Debate en comisión sobre competitividad y empleo se viralizó en redes sociales',
        fecha: '2024-02-20',
        tipo: 'entrevista'
      },
      {
        id: 'hito-3-4',
        descripcion: 'Ley de Energías Renovables aprobada con su presidencia de comisión',
        fecha: '2024-02-10',
        tipo: 'votacion'
      }
    ]
  },
  { 
    id: '4', 
    nombre: 'Jorge Ramirez Silva', 
    partido: 'Partido Popular', 
    region: 'Cusco',
    tipo: 'diputado',
    proyectosCount: 22,
    leyesAprobadas: 6,
    topComisiones: [
      { sectorId: 'educacion', comisiones: ['Comisión de Educación'] },
      { sectorId: 'cultura', comisiones: ['Comisión de Cultura'] },
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Cultura', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con perfil regionalista y vocación por la defensa del patrimonio cultural e identidad cusqueña. Sus iniciativas legislativas han buscado proteger los derechos de las comunidades andinas y fortalecer el turismo sostenible como motor económico regional.\n\nEn materia educativa, ha defendido la educación intercultural bilingüe y la inclusión de saberes ancestrales en el currículo nacional. Mantiene una postura crítica frente a proyectos extractivos que considera amenazas para los ecosistemas y las comunidades originarias.',
  },
  { 
    id: '5', 
    nombre: 'Ana Lucia Fernandez', 
    partido: 'Union por el Peru', 
    region: 'Piura',
    tipo: 'diputado',
    proyectosCount: 18,
    leyesAprobadas: 3,
    topComisiones: [
      { sectorId: 'educacion', comisiones: ['Comisión de Educación'] },
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] },
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Salud', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con enfoque social y sanitario, comprometida con el acceso universal a la salud en zonas rurales de Piura. Ha presentado proyectos para ampliar la cobertura del SIS y mejorar la infraestructura hospitalaria en provincias con altos índices de pobreza.\n\nEn educación, promueve programas de becas y acceso a internet en comunidades alejadas. Su perfil legislativo responde directamente a las necesidades de su región y mantiene una agenda consistente con las demandas de los sectores más vulnerables.',
  },
  { 
    id: '6', 
    nombre: 'Pedro Castillo Vargas', 
    partido: 'Movimiento Regional', 
    region: 'Cajamarca',
    tipo: 'senador',
    proyectosCount: 12,
    leyesAprobadas: 2,
    topComisiones: [
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'energia', comisiones: ['Comisión de Energía y Minas'] },
      { sectorId: 'agricultura', comisiones: ['Comisión Agraria'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión Agraria', desde: '2023-06' }
    ],
    perfilCualitativo: 'Representante con fuerte arraigo en el sector agrario y minero de Cajamarca, cuya agenda legislativa gira en torno a la defensa de los pequeños productores y la regulación de las actividades extractivas. Ha sido crítico de los grandes proyectos mineros que generan conflictos socioambientales en su región.\n\nSus propuestas buscan equilibrar el desarrollo económico con la protección ambiental y los derechos de las comunidades campesinas. Tiene una postura favorable a la descentralización fiscal y a mayores transferencias del canon minero hacia los gobiernos locales.',
  },
  { 
    id: '7', 
    nombre: 'Isabel Morales Cruz', 
    partido: 'Alianza para el Progreso', 
    region: 'Junin',
    tipo: 'senador',
    proyectosCount: 20,
    leyesAprobadas: 5,
    topComisiones: [
      { sectorId: 'transporte', comisiones: ['Comisión de Transportes'] },
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'energia', comisiones: ['Comisión de Energía y Minas'] }
    ],
    cargosHistoria: [
      { cargo: 'Vicepresidenta de Comisión de Transportes', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista especializada en infraestructura vial y conectividad, con especial atención a los proyectos de integración de la región Junín con la selva central. Ha impulsado iniciativas para mejorar carreteras, puentes y el transporte multimodal en zonas de difícil acceso.\n\nEn materia energética, defiende la ampliación de la cobertura eléctrica rural y el aprovechamiento sostenible de recursos hídricos. Su trabajo legislativo se distingue por la coordinación con gobiernos regionales y la búsqueda de financiamiento para obras de infraestructura prioritarias.',
  },
  { 
    id: '8', 
    nombre: 'Roberto Sanchez Luna', 
    partido: 'Fuerza Nacional', 
    region: 'Lambayeque',
    tipo: 'senador',
    proyectosCount: 26,
    leyesAprobadas: 7,
    topComisiones: [
      { sectorId: 'justicia', comisiones: ['Comisión de Justicia'] },
      { sectorId: 'defensa', comisiones: ['Comisión de Defensa Nacional'] },
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Justicia', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con perfil jurídico y enfoque en seguridad ciudadana y reforma del sistema de justicia. Ha presentado proyectos para endurecer penas en delitos de corrupción y mejorar la eficiencia del sistema penitenciario, alineándose con una postura de mano dura frente a la criminalidad.\n\nEn defensa nacional, apoya el fortalecimiento de las fuerzas del orden y ha respaldado iniciativas para modernizar el equipamiento policial y militar. Su discurso legislativo combina el garantismo con la necesidad de mayor eficacia en la persecución penal.',
  },
  { 
    id: '9', 
    nombre: 'Carmen Diaz Quispe', 
    partido: 'Accion Popular', 
    region: 'Puno',
    tipo: 'senador',
    proyectosCount: 14,
    leyesAprobadas: 3,
    topComisiones: [
      { sectorId: 'agricultura', comisiones: ['Comisión Agraria'] },
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] },
      { sectorId: 'educacion', comisiones: ['Comisión de Educación'] }
    ],
    cargosHistoria: [
      { cargo: 'Presidenta de Comisión Agraria', desde: '2023-06' }
    ],
    perfilCualitativo: 'Presidenta de la Comisión Agraria con vasta experiencia en políticas de desarrollo rural y seguridad alimentaria. Representa a Puno, una de las regiones con mayor concentración de comunidades campesinas y alpaqueras, lo que marca profundamente su agenda legislativa.\n\nHa liderado proyectos de ley para mejorar los precios de garantía agropecuarios, fortalecer las cooperativas rurales y ampliar la cobertura del seguro agrario. En salud, promueve la interculturalidad en los servicios sanitarios y el reconocimiento de la medicina tradicional andina.',
  },
  { 
    id: '10', 
    nombre: 'Luis Alberto Vargas', 
    partido: 'Peru Libre', 
    region: 'Tacna',
    tipo: 'diputado',
    proyectosCount: 19,
    leyesAprobadas: 5,
    topComisiones: [
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'trabajo', comisiones: ['Comisión de Trabajo'] },
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Trabajo', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con enfoque en derechos laborales y desarrollo económico regional, proveniente de Tacna, zona fronteriza con alta actividad comercial e industrial. Ha impulsado proyectos para regular las zonas francas y mejorar las condiciones del comercio binacional.\n\nEn materia económica, defiende políticas de reactivación productiva y mayor protección al trabajador formal. Su postura frente a la reforma del sistema de pensiones ha sido propensión a soluciones mixtas que combinen seguridad y sostenibilidad financiera.',
  },
  { 
    id: '11', 
    nombre: 'Patricia Huaman Rojas', 
    partido: 'Renovacion Popular', 
    region: 'Ancash',
    tipo: 'diputado',
    proyectosCount: 24,
    leyesAprobadas: 7,
    topComisiones: [
      { sectorId: 'salud', comisiones: ['Comisión de Salud'] },
      { sectorId: 'educacion', comisiones: ['Comisión de Educación'] },
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] }
    ],
    cargosHistoria: [
      { cargo: 'Vicepresidenta de Comisión de Salud', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista destacada en políticas de salud pública con experiencia en el sector sanitario previo a su labor parlamentaria. Representa a Ancash y ha centrado su trabajo legislativo en la atención primaria, la salud materna y la lucha contra la desnutrición infantil en zonas altoandinas.\n\nEn educación, promueve programas de alimentación escolar y el acceso a tecnología en colegios rurales. Es reconocida por su capacidad técnica en el debate sobre el presupuesto del sector salud y por su trabajo coordinado con el Ministerio de Salud para impulsar reformas institucionales.',
  },
  { 
    id: '12', 
    nombre: 'Miguel Angel Castro', 
    partido: 'Partido Popular', 
    region: 'Ica',
    tipo: 'senador',
    proyectosCount: 17,
    leyesAprobadas: 4,
    topComisiones: [
      { sectorId: 'transporte', comisiones: ['Comisión de Transportes'] },
      { sectorId: 'economia', comisiones: ['Comisión de Economía'] },
      { sectorId: 'energia', comisiones: ['Comisión de Energía y Minas'] }
    ],
    cargosHistoria: [
      { cargo: 'Miembro de Comisión de Transportes', desde: '2023-06' }
    ],
    perfilCualitativo: 'Congresista con perfil técnico en infraestructura y logística, enfocado en el desarrollo vial y portuario de la región Ica. Ha promovido proyectos de concesión de carreteras y mejora de la red de transporte de carga agrícola, claves para la competitividad exportadora de su región.\n\nEn energía y minas, apoya la expansión de las energías renovables y ha respaldado proyectos de electrificación rural en zonas aún no conectadas a la red nacional. Su estilo legislativo es pragmático y orientado a resultados concretos para el desarrollo productivo regional.',
  },
]

export const proyectos: ProyectoLey[] = [
  {
    id: '1',
    numero: 'PL-2024-00145',
    titulo: 'Ley que modifica el Codigo Tributario para mejorar la recaudacion fiscal',
    sumilla: 'Propone modificaciones al Codigo Tributario para establecer nuevos mecanismos de fiscalizacion y control de evasion tributaria.',
    resumen: 'Este proyecto busca modernizar el sistema de recaudacion fiscal mediante la incorporacion de herramientas tecnologicas de fiscalizacion. Se propone crear un registro unificado de contribuyentes y establecer sanciones mas severas para casos de evasion tributaria comprobada, con especial enfasis en grandes contribuyentes y operaciones internacionales.',
    fechaPresentacion: '2024-01-15',
    estado: 'En Comisión',
    sectorId: 'economia',
    autorPrincipal: congresistas[0],
    autores: [congresistas[0], congresistas[1]],
    comision: 'Comisión de Economía',
    ultimaActualizacion: '2024-02-20',
    prioridad: 'Alta',
    tags: ['tributacion', 'fiscalizacion', 'evasion'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 65,
    enAgenda: false,
    nivel: 2,
  },
  {
    id: '2',
    numero: 'PL-2024-00156',
    titulo: 'Ley de fortalecimiento del sistema de salud publica',
    sumilla: 'Establece medidas para el fortalecimiento de la infraestructura hospitalaria y la mejora de la atencion primaria.',
    resumen: 'La iniciativa contempla la construccion y equipamiento de al menos 50 nuevos centros de salud primaria en zonas rurales y periurbanas, ademas de la contratacion de 3,000 profesionales de salud. Se incluyen disposiciones para la mejora salarial del personal medico y la implementacion de telemedicina en regiones de dificil acceso.',
    fechaPresentacion: '2024-01-22',
    estado: 'En Pleno',
    sectorId: 'salud',
    autorPrincipal: congresistas[2],
    autores: [congresistas[2]],
    comision: 'Comisión de Salud',
    ultimaActualizacion: '2024-03-01',
    prioridad: 'Alta',
    tags: ['hospitales', 'atencion primaria', 'infraestructura'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'no_regulatorio',
    probabilidadAprobacion: 78,
    enAgenda: true,
    nivel: 4,
  },
  {
    id: '3',
    numero: 'PL-2024-00178',
    titulo: 'Ley de reforma educativa para la era digital',
    sumilla: 'Propone la incorporacion obligatoria de tecnologias digitales en el curriculo nacional.',
    resumen: 'El proyecto establece la ensenanza obligatoria de programacion basica, pensamiento computacional e inteligencia artificial desde la educacion primaria. Incluye un programa de capacitacion docente a nivel nacional y la dotacion de dispositivos tecnologicos a estudiantes de instituciones publicas en situacion de vulnerabilidad economica.',
    fechaPresentacion: '2024-02-05',
    estado: 'En Comisión',
    sectorId: 'educacion',
    autorPrincipal: congresistas[3],
    autores: [congresistas[3], congresistas[4]],
    comision: 'Comisión de Educación',
    ultimaActualizacion: '2024-02-28',
    prioridad: 'Media',
    tags: ['tecnologia', 'curriculo', 'docentes'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 55,
    enAgenda: false,
    nivel: 1,
  },
  {
    id: '4',
    numero: 'DIC-2024-00015',
    titulo: 'Dictamen de promocion de energias renovables',
    sumilla: 'Dictamen favorable que establece incentivos fiscales para proyectos de energia solar y eolica.',
    resumen: 'El dictamen aprobado en comision propone exoneraciones del IGV y reduccion del impuesto a la renta por 10 anos para inversiones en parques solares y eolicos mayores a 5 MW. Incluye un fondo de garantia estatal para facilitar el financiamiento de pequenos proyectos de energia renovable en comunidades rurales.',
    fechaPresentacion: '2024-02-12',
    estado: 'En Pleno',
    sectorId: 'energia',
    autorPrincipal: congresistas[5],
    autores: [congresistas[5]],
    comision: 'Comisión de Energía y Minas',
    ultimaActualizacion: '2024-03-10',
    prioridad: 'Alta',
    tags: ['energia solar', 'renovables', 'incentivos'],
    tipoMedida: 'dictamen',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 82,
    enAgenda: true,
    nivel: 3,
  },
  {
    id: '5',
    numero: 'PL-2024-00201',
    titulo: 'Ley de modernizacion del transporte publico urbano',
    sumilla: 'Propone un marco regulatorio para sistemas de transporte masivo eficientes y sostenibles.',
    resumen: 'Se propone la creacion de la Autoridad Nacional de Transporte Urbano, encargada de regular y supervisar los sistemas de bus rapido, metro y tren urbano en ciudades con mas de 500,000 habitantes. Contempla la electrificacion progresiva de la flota publica y subsidios diferenciados para usuarios de bajos ingresos.',
    fechaPresentacion: '2024-02-18',
    estado: 'En Comisión',
    sectorId: 'transporte',
    autorPrincipal: congresistas[6],
    autores: [congresistas[6], congresistas[7]],
    comision: 'Comisión de Transportes',
    ultimaActualizacion: '2024-03-05',
    prioridad: 'Media',
    tags: ['transporte masivo', 'sostenibilidad', 'ciudades'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 45,
    enAgenda: false,
    nivel: 2,
  },
  {
    id: '6',
    numero: 'PL-2024-00215',
    titulo: 'Ley de reforma del sistema penitenciario',
    sumilla: 'Establece medidas para la rehabilitacion efectiva de internos y reduccion de reincidencia.',
    resumen: 'El proyecto reforma el sistema penitenciario incorporando programas obligatorios de educacion, trabajo y salud mental para todos los internos. Propone la creacion de centros de reinsercion post-penitenciaria y la revision de penas para delitos menores, con enfoque en alternativas a la privacion de libertad como la prestacion de servicios a la comunidad.',
    fechaPresentacion: '2024-02-25',
    estado: 'Observado',
    sectorId: 'justicia',
    autores: [congresistas[0], congresistas[2]],
    comision: 'Comisión de Justicia',
    ultimaActualizacion: '2024-03-12',
    prioridad: 'Alta',
    tags: ['penitenciario', 'rehabilitacion', 'reincidencia'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'no_regulatorio',
    probabilidadAprobacion: 35,
    enAgenda: false,
    nivel: 1,
  },
  {
    id: '7',
    numero: 'PL-2024-00228',
    titulo: 'Ley de proteccion del trabajador independiente',
    sumilla: 'Crea un marco legal para la proteccion social de trabajadores independientes.',
    resumen: 'La ley propone la creacion del Regimen de Proteccion del Trabajador Independiente, que incluye acceso obligatorio a seguro de salud y sistema de pensiones con contribuciones diferenciadas segun nivel de ingresos. Establece un fondo de contingencia para periodos de inactividad involuntaria y simplifica los tramites de formalizacion para freelancers y emprendedores.',
    fechaPresentacion: '2024-03-01',
    estado: 'En Comisión',
    sectorId: 'trabajo',
    autorPrincipal: congresistas[1],
    autores: [congresistas[1], congresistas[4]],
    comision: 'Comisión de Trabajo',
    ultimaActualizacion: '2024-03-15',
    prioridad: 'Media',
    tags: ['independientes', 'seguro social', 'pensiones'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 50,
    enAgenda: false,
    nivel: 2,
  },
  {
    id: '8',
    numero: 'LEY-2024-31245',
    titulo: 'Ley de fomento a la agricultura familiar',
    sumilla: 'Establece programas de apoyo tecnico y financiero para pequenos agricultores.',
    resumen: 'La ley crea el Fondo Nacional de Agricultura Familiar con un presupuesto inicial de S/ 500 millones anuales para otorgar creditos blandos, asistencia tecnica y seguros agrarios a familias agricultoras con menos de 5 hectareas. Incluye programas de asociatividad, acceso a mercados y certificacion organica para productos de exportacion.',
    fechaPresentacion: '2024-03-05',
    estado: 'Publicado',
    sectorId: 'agricultura',
    autorPrincipal: congresistas[0],
    autores: [congresistas[0], congresistas[2]],
    comision: 'Comisión Agraria',
    ultimaActualizacion: '2024-03-18',
    prioridad: 'Baja',
    tags: ['agricultura familiar', 'desarrollo rural', 'seguridad alimentaria'],
    tipoMedida: 'ley_aprobada',
    tipoProyecto: 'no_regulatorio',
    probabilidadAprobacion: 100,
    enAgenda: false,
    nivel: 5,
  },
  {
    id: '9',
    numero: 'DIC-2024-00023',
    titulo: 'Dictamen de simplificacion de tramites tributarios',
    sumilla: 'Propone la digitalizacion y simplificacion de procesos de declaracion de impuestos.',
    resumen: 'El dictamen implementa la declaracion tributaria automatica para personas naturales y mypes, reduciendo el numero de formularios de 48 a 12. Propone la interoperabilidad entre SUNAT, bancos y registros publicos para prellenar automaticamente las declaraciones, y establece un canal de atencion digital exclusivo para contribuyentes con facturacion electronica.',
    fechaPresentacion: '2024-03-10',
    estado: 'En Pleno',
    sectorId: 'economia',
    autorPrincipal: congresistas[5],
    autores: [congresistas[5]],
    comision: 'Comisión de Economía',
    ultimaActualizacion: '2024-03-20',
    prioridad: 'Alta',
    tags: ['digitalizacion', 'tramites', 'pymes'],
    tipoMedida: 'dictamen',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 72,
    enAgenda: true,
    nivel: 3,
  },
  {
    id: '10',
    numero: 'PL-2024-00256',
    titulo: 'Ley de acceso universal a medicamentos esenciales',
    sumilla: 'Garantiza el acceso gratuito a medicamentos esenciales para poblaciones vulnerables.',
    resumen: 'El proyecto establece una lista de 500 medicamentos esenciales de provision gratuita obligatoria en todos los establecimientos del sector publico de salud. Crea el Registro Nacional de Poblacion Vulnerable para la distribucion focalizada y dispone la produccion nacional de farmacos genericos a traves de laboratorios publicos, reduciendo la dependencia de importaciones.',
    fechaPresentacion: '2024-03-12',
    estado: 'En Comisión',
    sectorId: 'salud',
    autorPrincipal: congresistas[7],
    autores: [congresistas[7], congresistas[0]],
    comision: 'Comisión de Salud',
    ultimaActualizacion: '2024-03-22',
    prioridad: 'Alta',
    tags: ['medicamentos', 'acceso universal', 'vulnerables'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 60,
    enAgenda: false,
    nivel: 1,
  },
  {
    id: '11',
    numero: 'PL-2024-00267',
    titulo: 'Ley de seguridad ciudadana integral',
    sumilla: 'Establece un sistema integrado de seguridad ciudadana con coordinacion entre PNP y serenazgo.',
    resumen: 'La iniciativa crea el Sistema Nacional Integrado de Seguridad Ciudadana que unifica los protocolos de actuacion entre la Policia Nacional, serenazgos municipales y juntas vecinales. Incluye la implementacion de un centro de monitoreo unificado en cada provincia, dotacion de equipamiento tecnologico y un regimen de incentivos para el personal policial destacado en zonas de alta incidencia delictiva.',
    fechaPresentacion: '2024-03-14',
    estado: 'En Comisión',
    sectorId: 'interior',
    autorPrincipal: congresistas[1],
    autores: [congresistas[1], congresistas[3]],
    comision: 'Comisión de Defensa Nacional',
    ultimaActualizacion: '2024-03-24',
    prioridad: 'Alta',
    tags: ['seguridad', 'policia', 'serenazgo'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 68,
    enAgenda: true,
    nivel: 2,
  },
  {
    id: '12',
    numero: 'DIC-2024-00028',
    titulo: 'Dictamen de proteccion de bosques amazonicos',
    sumilla: 'Fortalece los mecanismos de proteccion de bosques frente a la deforestacion ilegal.',
    resumen: 'El dictamen eleva a delito grave la deforestacion de bosques primarios amazónicos, con penas de 8 a 15 años de prision. Crea la Fiscalia Especializada en Delitos Ambientales y dota al SERNANP de capacidad coercitiva para intervenciones de emergencia. Establece un sistema satelital de monitoreo en tiempo real con alertas automaticas ante cambios en la cobertura boscosa.',
    fechaPresentacion: '2024-03-16',
    estado: 'En Pleno',
    sectorId: 'ambiente',
    autorPrincipal: congresistas[4],
    autores: [congresistas[4], congresistas[6]],
    comision: 'Comisión de Pueblos Amazónicos',
    ultimaActualizacion: '2024-03-26',
    prioridad: 'Alta',
    tags: ['amazonia', 'deforestacion', 'conservacion'],
    tipoMedida: 'dictamen',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 75,
    enAgenda: true,
    nivel: 4,
  },
  {
    id: '13',
    numero: 'LEY-2024-31250',
    titulo: 'Ley de promocion de vivienda social',
    sumilla: 'Establece subsidios para la adquisicion de viviendas para familias de bajos recursos.',
    resumen: 'La ley amplia el Fondo MiVivienda con un presupuesto adicional de S/ 1,200 millones para otorgar bonos de hasta S/ 60,000 a familias con ingresos mensuales inferiores a S/ 2,500. Prioriza a madres solteras, personas con discapacidad y victimas de violencia familiar, e incluye facilidades para la construccion progresiva en lotes propios ya titulados.',
    fechaPresentacion: '2024-02-20',
    estado: 'Publicado',
    sectorId: 'vivienda',
    autorPrincipal: congresistas[8],
    autores: [congresistas[8], congresistas[9]],
    comision: 'Comisión de Vivienda',
    ultimaActualizacion: '2024-03-15',
    prioridad: 'Alta',
    tags: ['vivienda social', 'subsidios', 'familias'],
    tipoMedida: 'ley_aprobada',
    tipoProyecto: 'no_regulatorio',
    probabilidadAprobacion: 100,
    enAgenda: false,
    nivel: 5,
  },
  {
    id: '14',
    numero: 'PL-2024-00280',
    titulo: 'Ley de proteccion contra la violencia familiar',
    sumilla: 'Fortalece mecanismos de prevencion y sancion de la violencia domestica.',
    resumen: 'El proyecto agrava las penas para agresores reincidentes y establece la orden de alejamiento automatica en casos de violencia fisica grave. Crea 30 nuevos centros de atencion integral para victimas a nivel nacional y dispone la capacitacion obligatoria en perspectiva de genero para todo el personal del Poder Judicial, Ministerio Publico y PNP.',
    fechaPresentacion: '2024-03-18',
    estado: 'En Comisión',
    sectorId: 'mujer',
    autorPrincipal: congresistas[10],
    autores: [congresistas[10], congresistas[11]],
    comision: 'Comisión de la Mujer',
    ultimaActualizacion: '2024-03-25',
    prioridad: 'Alta',
    tags: ['violencia', 'familia', 'proteccion'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 70,
    enAgenda: false,
    nivel: 3,
  },
  {
    id: '15',
    numero: 'PL-2024-00290',
    titulo: 'Ley de transformacion digital del Estado',
    sumilla: 'Establece lineamientos para la digitalizacion de servicios publicos.',
    resumen: 'El proyecto crea la Plataforma Digital del Estado Peruano como ventanilla unica para el 100% de tramites gubernamentales, con implementacion progresiva en 5 años. Establece la identidad digital obligatoria para ciudadanos mayores de 18 años, interoperabilidad entre todas las entidades publicas y un sistema de trazabilidad ciudadana para el seguimiento de solicitudes y expedientes.',
    fechaPresentacion: '2024-03-20',
    estado: 'En Comisión',
    sectorId: 'ciencia',
    autorPrincipal: congresistas[2],
    autores: [congresistas[2], congresistas[8]],
    comision: 'Comisión de Educación',
    ultimaActualizacion: '2024-03-27',
    prioridad: 'Media',
    tags: ['digitalizacion', 'gobierno digital', 'servicios'],
    tipoMedida: 'proyecto_ley',
    tipoProyecto: 'regulatorio',
    probabilidadAprobacion: 58,
    enAgenda: false,
  },
]

// Funciones utilitarias
export function getActivityLevel(projectCount: number): 'critico' | 'alto' | 'moderado' | 'bajo' {
  if (projectCount >= 15) return 'critico'
  if (projectCount >= 10) return 'alto'
  if (projectCount >= 5) return 'moderado'
  return 'bajo'
}

export function getMonthLabel(monthValue: string): string {
  const month = availableMonths.find(m => m.value === monthValue)
  return month?.label || monthValue
}

export function getPreviousMonth(currentMonth: string): string | null {
  const currentIndex = availableMonths.findIndex(m => m.value === currentMonth)
  if (currentIndex === -1 || currentIndex >= availableMonths.length - 1) return null
  return availableMonths[currentIndex + 1].value
}

export function getTipoMedidaLabel(tipo: string): string {
  const labels: Record<string, string> = {
    proyecto_ley: 'Proyecto de Ley',
    dictamen: 'Dictamen',
    ley_aprobada: 'Ley Aprobada',
  }
  return labels[tipo] || tipo
}

export function getTipoProyectoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    regulatorio: 'Regulatorio',
    no_regulatorio: 'No Regulatorio',
  }
  return labels[tipo] || tipo
}

// Leyes Aprobadas
export const leyesAprobadas: LeyAprobada[] = [
  {
    id: 'ley-1',
    numeroLey: 'Ley N° 31814',
    titulo: 'Ley que promueve la transparencia y el acceso a la información en la gestión pública',
    sumilla: 'Establece mecanismos de transparencia activa y acceso a datos abiertos para todas las entidades del Estado.',
    resumen: 'Esta ley establece la obligación de todas las entidades públicas de publicar información relevante en formatos abiertos y accesibles. Incluye la creación de un portal único de datos abiertos del Estado, la obligatoriedad de publicar información presupuestal en tiempo real, y sanciones para funcionarios que incumplan con los plazos de respuesta a solicitudes de acceso a la información.',
    fechaPublicacion: '2024-03-15',
    fechaAprobacion: '2024-03-08',
    fechaPromulgacion: '2024-03-12',
    sectorId: 'justicia',
    autorPrincipal: congresistas[0],
    autores: [congresistas[0], congresistas[2], congresistas[4]],
    comisionDictaminadora: 'Comisión de Constitución y Reglamento',
    proyectoOrigenId: 'pl-001',
    proyectoOrigenNumero: 'PL 1234/2023-CR',
    tags: ['transparencia', 'datos abiertos', 'acceso información', 'gestión pública'],
    impacto: 'Alto',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31814',
    textoCompleto: 'Artículo 1.- Objeto de la Ley\nLa presente ley tiene por objeto establecer mecanismos que garanticen la transparencia activa y el acceso a la información pública en todas las entidades del Estado.\n\nArtículo 2.- Ámbito de aplicación\nLa presente ley es de aplicación a todas las entidades de la Administración Pública comprendidas en el artículo I del Título Preliminar de la Ley Nº 27444.\n\nArtículo 3.- Portal de Datos Abiertos\nCréase el Portal Único de Datos Abiertos del Estado Peruano, a cargo de la Secretaría de Gobierno y Transformación Digital de la PCM.',
    vigencia: 'En vigor',
  },
  {
    id: 'ley-2',
    numeroLey: 'Ley N° 31798',
    titulo: 'Ley de protección al consumidor financiero',
    sumilla: 'Establece el marco de protección de los derechos de los usuarios de servicios financieros.',
    resumen: 'Norma que fortalece la protección de los consumidores financieros frente a prácticas abusivas de entidades bancarias y financieras. Incluye la regulación de comisiones, la prohibición de cláusulas abusivas en contratos de adhesión, y la creación de un defensor del consumidor financiero.',
    fechaPublicacion: '2024-02-28',
    fechaAprobacion: '2024-02-20',
    fechaPromulgacion: '2024-02-25',
    sectorId: 'economia',
    autorPrincipal: congresistas[1],
    autores: [congresistas[1], congresistas[3]],
    comisionDictaminadora: 'Comisión de Economía, Banca, Finanzas e Inteligencia Financiera',
    proyectoOrigenNumero: 'PL 2456/2023-CR',
    tags: ['consumidor', 'finanzas', 'banca', 'protección'],
    impacto: 'Alto',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31798',
    vigencia: 'Pendiente reglamentación',
  },
  {
    id: 'ley-3',
    numeroLey: 'Ley N° 31785',
    titulo: 'Ley que declara de necesidad pública e interés nacional la construcción de hospitales regionales',
    sumilla: 'Declara prioritaria la construcción y equipamiento de hospitales de alta complejidad en regiones.',
    resumen: 'Esta ley autoriza al Ministerio de Salud a ejecutar proyectos de inversión para la construcción de hospitales de nivel III en las regiones que actualmente carecen de establecimientos de alta complejidad. Establece un cronograma de implementación de 5 años y asigna recursos del canon minero para su financiamiento.',
    fechaPublicacion: '2024-02-15',
    fechaAprobacion: '2024-02-08',
    fechaPromulgacion: '2024-02-12',
    sectorId: 'salud',
    autorPrincipal: congresistas[2],
    autores: [congresistas[2], congresistas[5], congresistas[8]],
    comisionDictaminadora: 'Comisión de Salud y Población',
    proyectoOrigenNumero: 'PL 3012/2023-CR',
    tags: ['salud', 'hospitales', 'infraestructura', 'regiones'],
    impacto: 'Alto',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31785',
    vigencia: 'En vigor',
  },
  {
    id: 'ley-4',
    numeroLey: 'Ley N° 31772',
    titulo: 'Ley que promueve la educación digital y el acceso a internet en zonas rurales',
    sumilla: 'Establece el programa nacional de conectividad educativa para zonas rurales.',
    resumen: 'Crea el Programa Nacional de Conectividad Educativa Rural que garantiza el acceso a internet de alta velocidad en todas las instituciones educativas públicas ubicadas en zonas rurales. Incluye la entrega de dispositivos tecnológicos a estudiantes de bajos recursos y la capacitación docente en competencias digitales.',
    fechaPublicacion: '2024-01-30',
    fechaAprobacion: '2024-01-22',
    fechaPromulgacion: '2024-01-27',
    sectorId: 'educacion',
    autorPrincipal: congresistas[4],
    autores: [congresistas[4], congresistas[6]],
    comisionDictaminadora: 'Comisión de Educación, Juventud y Deporte',
    proyectoOrigenNumero: 'PL 2890/2023-CR',
    tags: ['educación', 'internet', 'rural', 'tecnología', 'digital'],
    impacto: 'Alto',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31772',
    vigencia: 'En vigor',
  },
  {
    id: 'ley-5',
    numeroLey: 'Ley N° 31760',
    titulo: 'Ley de fomento del trabajo remoto y teletrabajo',
    sumilla: 'Regula las modalidades de trabajo a distancia en el sector público y privado.',
    resumen: 'Establece el marco normativo para el trabajo remoto y teletrabajo, definiendo derechos y obligaciones de empleadores y trabajadores. Incluye la regulación del derecho a la desconexión digital, la provisión de equipos y compensación por gastos, y medidas de seguridad y salud en el trabajo.',
    fechaPublicacion: '2024-01-15',
    fechaAprobacion: '2024-01-08',
    fechaPromulgacion: '2024-01-12',
    sectorId: 'trabajo',
    autorPrincipal: congresistas[3],
    autores: [congresistas[3], congresistas[7], congresistas[9]],
    comisionDictaminadora: 'Comisión de Trabajo y Seguridad Social',
    proyectoOrigenNumero: 'PL 2654/2023-CR',
    tags: ['trabajo', 'teletrabajo', 'remoto', 'laboral'],
    impacto: 'Medio',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31760',
    vigencia: 'En vigor',
  },
  {
    id: 'ley-6',
    numeroLey: 'Ley N° 31745',
    titulo: 'Ley que promueve el uso de energías renovables',
    sumilla: 'Establece incentivos tributarios para proyectos de energía solar y eólica.',
    resumen: 'Otorga beneficios tributarios a empresas que inviertan en proyectos de generación de energía renovable. Incluye la exoneración del IGV para la importación de equipos, depreciación acelerada de activos, y créditos fiscales por inversión en investigación y desarrollo de tecnologías limpias.',
    fechaPublicacion: '2023-12-20',
    fechaAprobacion: '2023-12-12',
    fechaPromulgacion: '2023-12-18',
    sectorId: 'energia',
    autorPrincipal: congresistas[5],
    autores: [congresistas[5], congresistas[10]],
    comisionDictaminadora: 'Comisión de Energía y Minas',
    proyectoOrigenNumero: 'PL 2234/2023-CR',
    tags: ['energía', 'renovable', 'solar', 'eólica', 'ambiente'],
    impacto: 'Alto',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31745',
    vigencia: 'En vigor',
  },
  {
    id: 'ley-7',
    numeroLey: 'Ley N° 31730',
    titulo: 'Ley de fortalecimiento del transporte público urbano',
    sumilla: 'Establece el marco para la modernización del sistema de transporte público metropolitano.',
    resumen: 'Crea el Sistema Integrado de Transporte Público Metropolitano y establece estándares de calidad, seguridad y accesibilidad. Incluye la renovación obligatoria de flota vehicular, la implementación de medios de pago electrónico, y subsidios para tarifas preferenciales a estudiantes y adultos mayores.',
    fechaPublicacion: '2023-12-05',
    fechaAprobacion: '2023-11-28',
    fechaPromulgacion: '2023-12-02',
    sectorId: 'transporte',
    autorPrincipal: congresistas[6],
    autores: [congresistas[6], congresistas[8], congresistas[11]],
    comisionDictaminadora: 'Comisión de Transportes y Comunicaciones',
    proyectoOrigenNumero: 'PL 1987/2023-CR',
    tags: ['transporte', 'urbano', 'metropolitano', 'movilidad'],
    impacto: 'Medio',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31730',
    vigencia: 'Pendiente reglamentación',
  },
  {
    id: 'ley-8',
    numeroLey: 'Ley N° 31718',
    titulo: 'Ley de apoyo a la agricultura familiar',
    sumilla: 'Crea el programa de fortalecimiento de la agricultura familiar y pequeños productores.',
    resumen: 'Establece políticas de apoyo integral a la agricultura familiar, incluyendo acceso preferencial a créditos con tasas subsidiadas, programas de asistencia técnica, seguros agrarios subvencionados, y acceso prioritario a compras estatales para programas alimentarios.',
    fechaPublicacion: '2023-11-20',
    fechaAprobacion: '2023-11-13',
    fechaPromulgacion: '2023-11-17',
    sectorId: 'agricultura',
    autorPrincipal: congresistas[7],
    autores: [congresistas[7], congresistas[2]],
    comisionDictaminadora: 'Comisión Agraria',
    proyectoOrigenNumero: 'PL 1654/2023-CR',
    tags: ['agricultura', 'familiar', 'rural', 'productores'],
    impacto: 'Medio',
    enlaceElPeruano: 'https://busquedas.elperuano.pe/normaslegales/ley-31718',
    vigencia: 'En vigor',
  },
]
