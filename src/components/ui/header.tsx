import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, HelpCircle,Ticket, Calendar, User, LogIn } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import ClientSearchBar from './ClientSearchBar'

export default async function Header() {
  const { userId } = await auth()

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Ticket className="h-6 w-6 text-orange-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Re-Ticket
          </span>
        </Link>
          {/* Menú para pantallas grandes */}
          <nav className="hidden lg:flex space-x-6">
            <NavLink href="/" icon={<Home className="w-5 h-5" />} text="Inicio" />
            <NavLink href="/sobre-nosotros" icon={<HelpCircle className="w-5 h-5" />} text="Preguntas Frecuentes" />
            <NavLink href="/eventos" icon={<Calendar className="w-5 h-5" />} text="Eventos" />
          </nav>

          {/* Área de búsqueda y autenticación para pantallas grandes */}
          <div className="hidden lg:flex items-center space-x-4">
            <ClientSearchBar />
            {!userId ? (
              <>
                <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/register">Registrarse</Link>
                </Button>
                <Button asChild variant="ghost" className="text-orange-500 hover:text-orange-600">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/perfil" icon={<User className="w-5 h-5" />} text="Perfil" />
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>

          {/* Menú para dispositivos móviles */}
          <div className="lg:hidden flex items-center space-x-2">
            <ClientSearchBar />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-orange-500 hover:bg-orange-50">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <NavLink href="/" icon={<Home className="w-5 h-5" />} text="Inicio" />
                  <NavLink href="/sobre-nosotros" icon={<HelpCircle className="w-5 h-5" />} text="Preguntas Frecuentes" />
                  <NavLink href="/eventos" icon={<Calendar className="w-5 h-5" />} text="Eventos" />
                  {!userId ? (
                    <>
                      <Button asChild variant="default" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/register">Registrarse</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full text-orange-500 hover:text-orange-600">
                        <Link href="/login">
                          <LogIn className="w-5 h-5 mr-2" />
                          Iniciar Sesión
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <NavLink href="/perfil" icon={<User className="w-5 h-5" />} text="Perfil" />
                      <div className="flex items-center space-x-2">
                        <span>Tu cuenta:</span>
                        <UserButton afterSignOutUrl="/" />
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  )
}

