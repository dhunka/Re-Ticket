'use client'

import { useAuth } from '@clerk/nextjs'  // Importamos useAuth para obtener el estado de autenticación en el cliente
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import ClientSearchBar from './ClientSearchBar'  // Importamos el componente de búsqueda

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth()  // Usamos useAuth para obtener el estado de autenticación

  if (!isLoaded) {
    return null  // O mostrar un loader mientras se carga el estado de autenticación
  }

  return (
    <header className="bg-white text-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Re-Ticket
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Inicio
          </Link>
          <Link href="/sobre-nosotros" className="hover:text-orange-500 transition-colors">
            Preguntas Frecuentes
          </Link>
          <Link href="/eventos" className="hover:text-orange-500 transition-colors">
            Eventos
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <ClientSearchBar />
          
          {!isSignedIn && (
            <>
              <Link href="/register" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Registrarse
              </Link>
              <Link href="/login" className="text-orange-500 hover:text-orange-600">
                Iniciar Sesión
              </Link>
            </>
          )}
          {isSignedIn && (
            <>
              <Link href="/perfil" className="text-gray-700 hover:text-orange-500 transition-colors">
                Perfil
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
        <div className="md:hidden flex items-center space-x-2">
          {!isSignedIn ? (
            <Link href="/register" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Registrarse
            </Link>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
          <Button size="icon" variant="ghost" className="text-orange-500 hover:bg-orange-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
