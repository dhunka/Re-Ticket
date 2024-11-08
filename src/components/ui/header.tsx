import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'

export default async function Header() {
  const { userId } = await auth()

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
          <Link href="/productos" className="hover:text-orange-500 transition-colors">
            Productos
          </Link>
          <Link href="/sobre-nosotros" className="hover:text-orange-500 transition-colors">
            Sobre Nosotros
          </Link>
          <Link href="/contacto" className="hover:text-orange-500 transition-colors">
            Contacto
          </Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Input 
              type="search" 
              placeholder="Buscar..." 
              className="w-64 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button size="icon" variant="ghost" className="text-orange-500 hover:bg-orange-50">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
          {!userId && (
            <>
              <Link href="/sign-up" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Registrarse
              </Link>
              <Link href="/login" className="text-orange-500 hover:text-orange-600">
                Iniciar Sesión
              </Link>
            </>
          )}
          {userId && (
            <>
              <Link href="/perfil" className="text-gray-700 hover:text-orange-500 transition-colors">
                Perfil
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
        <div className="md:hidden flex items-center space-x-2">
          {!userId ? (
            <Link href="/sign-up" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
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
