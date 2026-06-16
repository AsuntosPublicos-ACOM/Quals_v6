'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, Star, TrendingUp, FileText, Users, Clock, CheckCircle, BookOpen } from 'lucide-react'
import { Header } from '@/components/header'
import { SectorsView } from '@/components/sectors-view'
import { FavoritesView } from '@/components/favorites-view'
import { CongressList } from '@/components/congress-list'
import { ProjectsList } from '@/components/projects-list'
import { ElPeruanoView } from '@/components/el-peruano-view'
import { SearchResults } from '@/components/search-results'
import { ProfileView } from '@/components/profile-view'
import { AlertsView } from '@/components/alerts-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { proyectos, sectores, availableMonths, congresistas } from '@/lib/data'
import type { ProyectoLey, Congresista } from '@/lib/types'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('sectores')
  const [favorites, setFavorites] = useState<string[]>(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
  const [favoriteSectors, setFavoriteSectors] = useState<string[]>([])
  const [favoriteCongresistas, setFavoriteCongresistas] = useState<string[]>([])

  const toggleFavoriteSector = (sectorId: string) => {
    setFavoriteSectors(prev =>
      prev.includes(sectorId) ? prev.filter(id => id !== sectorId) : [...prev, sectorId]
    )
  }

  const toggleFavoriteCongresista = (id: string) => {
    setFavoriteCongresistas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }
  const [mainView, setMainView] = useState<'home' | 'sectores' | 'congresistas' | 'proyectos' | 'elperuano' | 'favoritos' | 'perfil' | 'alertas'>('home')
  const [initialSectorId, setInitialSectorId] = useState<string | undefined>(undefined)
  const [sectorViewState, setSectorViewState] = useState<'grid' | 'sector' | 'detail'>('grid')
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoLey | null>(null)
  const [filteredProyectos, setFilteredProyectos] = useState<ProyectoLey[]>([])
  const [selectedCongresista, setSelectedCongresista] = useState<Congresista | null>(null)

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const navigateToSectors = () => {
    setActiveTab('sectores')
  }

  // Stats based on current month
  const currentMonth = availableMonths[0].value
  const stats = useMemo(() => {
    const totalProyectosMes = sectores.reduce((sum, sector) => {
      const monthData = sector.monthlyData.find(d => d.month === currentMonth)
      return sum + (monthData?.projectCount || 0)
    }, 0)
    
    // Dictámenes (proyectos en "En Pleno") y Leyes (proyectos aprobados) de este mes
    const dictamenes = proyectos.filter(p => {
      const [year, month] = currentMonth.split('-')
      return p.ultimaActualizacion.startsWith(`${year}-${month}`) && p.estado === 'En Pleno'
    }).length
    
    const leyesAprobadas = proyectos.filter(p => {
      const [year, month] = currentMonth.split('-')
      return p.ultimaActualizacion.startsWith(`${year}-${month}`) && p.estado === 'Aprobado'
    }).length
    
    const totalSectores = sectores.length
    const totalCongresistas = new Set(proyectos.flatMap(p => p.autores.map(a => a.id))).size
    const ultimaActualizacion = proyectos
      .map(p => new Date(p.ultimaActualizacion))
      .sort((a, b) => b.getTime() - a.getTime())[0]
      ?.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
    
    return {
      totalProyectosMes,
      totalSectores,
      totalCongresistas,
      ultimaActualizacion,
      dictamenes,
      leyesAprobadas
    }
  }, [currentMonth])

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNavigate={(view) => { setInitialSectorId(undefined); if (view === 'home') setSectorViewState('grid'); setMainView(view as any) }}
        onNavigateSector={(sectorId) => { setInitialSectorId(sectorId); setMainView('sectores') }}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {searchQuery.trim().length > 1 && (
          <SearchResults
            query={searchQuery}
            onClear={() => setSearchQuery('')}
            onViewProject={(p) => {
              setSearchQuery('')
              setMainView('proyectos')
            }}
            onViewCongresista={(c) => {
              setSearchQuery('')
              setMainView('congresistas')
            }}
            onViewSector={(sectorId) => {
              setSearchQuery('')
              setInitialSectorId(sectorId)
              setMainView('sectores')
            }}
            onViewElPeruano={() => {
              setSearchQuery('')
              setMainView('elperuano')
            }}
          />
        )}

        {!searchQuery.trim() && mainView === 'sectores' && (
          <SectorsView
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            initialSectorId={initialSectorId}
          />
        )}

        {!searchQuery.trim() && mainView === 'congresistas' && (
          <CongressList
            onBack={() => setMainView('home')}
            favoriteCongresistas={favoriteCongresistas}
            onToggleFavoriteCongresista={toggleFavoriteCongresista}
          />
        )}

        {!searchQuery.trim() && mainView === 'proyectos' && (
          <ProjectsList
            onBack={() => setMainView('home')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {!searchQuery.trim() && mainView === 'elperuano' && (
          <ElPeruanoView
            onBack={() => setMainView('home')}
          />
        )}

        {!searchQuery.trim() && mainView === 'favoritos' && (
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            favoriteCongresistas={favoriteCongresistas}
            onToggleFavoriteCongresista={toggleFavoriteCongresista}
            onBack={() => setMainView('home')}
          />
        )}

        {!searchQuery.trim() && mainView === 'perfil' && (
          <ProfileView onBack={() => setMainView('home')} />
        )}

        {!searchQuery.trim() && mainView === 'alertas' && (
          <AlertsView onBack={() => setMainView('home')} />
        )}

        {!searchQuery.trim() && mainView === 'home' && (
          <>
            {/* Banner Space - only show when viewing grid */}
            {sectorViewState === 'grid' && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8 min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center">Banner publicitario o informativo</p>
              </div>
            )}

            {/* Navigation Cards - only show when viewing grid */}
            {sectorViewState === 'grid' && (
              <div className="mb-8 space-y-3">
                <h2 className="text-2xl font-bold text-foreground">Vista general</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card
                    className="cursor-pointer hover:opacity-90 transition-opacity bg-black border-black"
                    onClick={() => setMainView('proyectos')}
                  >
                    <CardContent className="flex items-center justify-center p-6 text-center">
                      <h3 className="text-xl font-bold text-white">Proyectos de Ley</h3>
                    </CardContent>
                  </Card>

                  <Card
                    className="cursor-pointer hover:opacity-90 transition-opacity bg-black border-black"
                    onClick={() => setMainView('congresistas')}
                  >
                    <CardContent className="flex items-center justify-center p-6 text-center">
                      <h3 className="text-xl font-bold text-white">Legisladores</h3>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:opacity-90 transition-opacity bg-black border-black"
                    onClick={() => setMainView('elperuano')}
                  >
                    <CardContent className="flex items-center justify-center p-6 text-center">
                      <h3 className="text-xl font-bold text-white">El Peruano</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Sectores Section */}
            <div className="space-y-4">
              {sectorViewState === 'grid' && <h2 className="text-2xl font-bold text-foreground">Sectores</h2>}
              <SectorsView
                searchQuery={searchQuery}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onViewStateChange={setSectorViewState}
                onBackToHome={() => { setSectorViewState('grid'); setMainView('home') }}
                favoriteSectors={favoriteSectors}
                onToggleFavoriteSector={toggleFavoriteSector}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
