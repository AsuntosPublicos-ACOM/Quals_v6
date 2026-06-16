'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Mail, Phone, MapPin, Building2, Layers } from 'lucide-react'

interface ProfileViewProps {
  onBack: () => void
}

export function ProfileView({ onBack }: ProfileViewProps) {
  const userProfile = {
    name: 'Juan Carlos Rodríguez',
    email: 'juan.rodriguez@example.com',
    phone: '+51 987 654 321',
    region: 'Lima',
    empresa: 'Consultora Legislativa SAC',
    sectorEmpresa: 'Consultoría y Asesoría Legal',
    interestSectors: ['Salud', 'Educación', 'Economía'],
    memberSince: '2024',
  }

  return (
    <div className="space-y-6">
      {/* Header con botón atrás */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu información personal</p>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Información Personal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tus datos de contacto y ubicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="text-sm font-medium text-foreground">Nombre completo</label>
              <p className="text-lg text-foreground mt-1">{userProfile.name}</p>
            </div>

            {/* Datos de contacto */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo electrónico
                </label>
                <p className="text-muted-foreground">{userProfile.email}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </label>
                <p className="text-muted-foreground">{userProfile.phone}</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Región
              </label>
              <p className="text-muted-foreground">{userProfile.region}</p>
            </div>

            {/* Empresa y Sector */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </label>
                <p className="text-muted-foreground">{userProfile.empresa}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Sector de la empresa
                </label>
                <p className="text-muted-foreground">{userProfile.sectorEmpresa}</p>
              </div>
            </div>

            {/* Botón Editar */}
            <Button className="w-full">Editar información</Button>
          </CardContent>
        </Card>

        {/* Tarjeta Resumen */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Miembro desde</p>
              <p className="text-lg font-semibold text-foreground">{userProfile.memberSince}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-1">PL favoritos</p>
              <p className="text-2xl font-bold text-primary">12</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-1">Congresistas favoritos</p>
              <p className="text-2xl font-bold text-primary">5</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sectores de Interés */}
      <Card>
        <CardHeader>
          <CardTitle>Sectores de Interés</CardTitle>
          <CardDescription>Áreas temáticas que monitoreas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {userProfile.interestSectors.map((sector) => (
              <Badge key={sector} variant="secondary" className="px-3 py-1 text-sm">
                {sector}
              </Badge>
            ))}
          </div>
          <Button variant="outline" className="w-full">Editar sectores</Button>
        </CardContent>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
          <CardDescription>Personaliza tu experiencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Recibir notificaciones de cambios en <strong>ESTADO</strong> de mis PL favoritos</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Recibir notificaciones de nuevos PL regulatorios de mis congresistas favoritos</span>
            </label>
          </div>
          <Button className="w-full">Guardar preferencias</Button>
        </CardContent>
      </Card>

      {/* Sesión */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Sesión</CardTitle>
          <CardDescription>Administra tu sesión y seguridad</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">Cambiar contraseña</Button>
          <Button variant="destructive" className="w-full">Cerrar sesión</Button>
        </CardContent>
      </Card>
    </div>
  )
}
