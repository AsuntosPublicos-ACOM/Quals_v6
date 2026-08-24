'use client'

import { useState } from 'react'
import { Search, Bell, User, Mail, Menu, LayoutGrid, Users, FileText, BookOpen, ChevronDown, Layers, Star, LayoutDashboard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { sectores } from '@/lib/data'

// Simulación de rol de usuario — reemplazar con auth real cuando esté disponible
const IS_ADMIN = true

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNavigate?: (view: 'home' | 'sectores' | 'congresistas' | 'proyectos' | 'elperuano' | 'favoritos' | 'perfil' | 'alertas' | 'dashboard') => void
  onNavigateSector?: (sectorId: string) => void
}

export function Header({ searchQuery, onSearchChange, onNavigate, onNavigateSector }: HeaderProps) {
  const [sectoresOpen, setSectoresOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {/* Hamburger menu */}
          <DropdownMenu open={menuOpen} onOpenChange={(open) => { setMenuOpen(open); if (!open) setSectoresOpen(false) }}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Navegación</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { onNavigate?.('home'); setMenuOpen(false) }} className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Inicio
              </DropdownMenuItem>
              
              <Collapsible open={sectoresOpen} onOpenChange={setSectoresOpen}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Sectores
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${sectoresOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-6 space-y-1 mt-1">
                  <button
                    onClick={() => { onNavigate?.('sectores'); setMenuOpen(false) }}
                    className="flex w-full items-center px-2 py-1.5 text-xs text-muted-foreground rounded-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Ver todos los sectores
                  </button>
                  {sectores.map((sector) => (
                    <button
                      key={sector.id}
                      onClick={() => { onNavigateSector?.(sector.id); setMenuOpen(false) }}
                      className="flex w-full items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      {sector.name}
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <DropdownMenuItem onClick={() => { onNavigate?.('congresistas'); setMenuOpen(false) }} className="gap-2">
                <Users className="h-4 w-4" />
                Congresistas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { onNavigate?.('proyectos'); setMenuOpen(false) }} className="gap-2">
                <FileText className="h-4 w-4" />
                Proyectos de Ley
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { onNavigate?.('elperuano'); setMenuOpen(false) }} className="gap-2">
                <BookOpen className="h-4 w-4" />
                El Peruano
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { onNavigate?.('favoritos'); setMenuOpen(false) }} className="gap-2">
                <Star className="h-4 w-4" />
                Mis Favoritos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">CM</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Congreso Monitor</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar proyectos, congresistas, sectores..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {IS_ADMIN && (
            <Button variant="ghost" size="icon">
              <Mail className="h-5 w-5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate?.('dashboard')}
            title="Dashboard"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="sr-only">Ver dashboard</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate?.('favoritos')}
            title="Mis Favoritos"
          >
            <Star className="h-5 w-5" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => onNavigate?.('alertas')}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onNavigate?.('perfil')}>Mi perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
