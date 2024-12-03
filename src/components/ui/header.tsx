import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import ClientSearchBar from './ClientSearchBar'  // Importamos el componente de búsqueda

export default async function Header() {
  const { userId } = await auth()

  return (
    <header className="bg-white text-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Re-Ticket
        </Link>

        {/* Menú para pantallas grandes */}
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

        {/* Área de búsqueda y autenticación */}
        <div className="hidden md:flex items-center space-x-4">
          <ClientSearchBar />
          {!userId ? (
            <>
              <Link href="/register" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Registrarse
              </Link>
              <Link href="/login" className="text-orange-500 hover:text-orange-600">
                Iniciar Sesión
              </Link>
            </>
          ) : (
            <>
              <Link href="/perfil" className="text-gray-700 hover:text-orange-500 transition-colors">
                Perfil
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>

        {/* Icono del menú para pantallas pequeñas */}
        <div className="md:hidden flex items-center space-x-2">
          {!userId ? (
            <Link href="/register" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Registrarse
            </Link>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}

          {/* Botón de menú */}
          <label htmlFor="menu-toggle" className="text-orange-500 hover:bg-orange-50">
            <Button size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </label>
          <input type="checkbox" id="menu-toggle" className="hidden peer" />
        </div>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      <div className="md:hidden bg-white shadow-md mt-4 px-4 py-2 space-y-4 peer-checked:block hidden">
        <Link href="/" className="block hover:text-orange-500 transition-colors">
          Inicio
        </Link>
        <Link href="/sobre-nosotros" className="block hover:text-orange-500 transition-colors">
          Preguntas Frecuentes
        </Link>
        <Link href="/eventos" className="block hover:text-orange-500 transition-colors">
          Eventos
        </Link>
        {!userId ? (
          <>
            <Link href="/register" className="block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Registrarse
            </Link>
            <Link href="/login" className="block text-orange-500 hover:text-orange-600">
              Iniciar Sesión
            </Link>
          </>
        ) : (
          <>
            <Link href="/perfil" className="block text-gray-700 hover:text-orange-500 transition-colors">
              Perfil
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        )}
      </div>
    </header>
  )
}
