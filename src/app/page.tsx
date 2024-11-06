"use client"

import Link from 'next/link'
import Image from 'next/image' // Añadido el import de Image
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import HomeImage from '../../public/images/home.jpg'
import { Search, Menu, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'



export default function HomePage() {
  return (
    <>
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
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              Registrarse
            </Button>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              Registrarse
            </Button>
            <Button size="icon" variant="ghost" className="text-orange-500 hover:bg-orange-50">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="bg-gray-900">
        <section className="min-h-[calc(100vh-7rem)] container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-20 gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                ¿DESCONFÍAS DE COMPRAR ENTRADAS DE SEGUNDA MANO?
              </h1>
              <p className="text-gray-300 text-xl">
                Encuentra tu solución segura y confiable para la compraventa de entradas.
              </p>
              <div className="flex gap-4">
                <Button className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-6 text-lg">
                  Ver oportunidades
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg">
                  Vende tu entrada
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full aspect-video">
                <div className="absolute -inset-1 bg-orange-500 rounded-lg blur-md"></div>
                <div className="relative w-full h-full">
                  <Image 
                    src={HomeImage} 
                    alt="Tickets"
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      <footer className="bg-white text-gray-800 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-orange-500">Logo</h2>
              <p className="text-sm">Ofrecemos soluciones innovadoras para tu negocio. Contáctanos para saber más.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-orange-500">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link></li>
                <li><Link href="/productos" className="hover:text-orange-500 transition-colors">Productos</Link></li>
                <li><Link href="/sobre-nosotros" className="hover:text-orange-500 transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="/contacto" className="hover:text-orange-500 transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-orange-500">Contacto</h3>
              <ul className="space-y-2">
                <li>123 Calle Principal, Ciudad</li>
                <li>Teléfono: (123) 456-7890</li>
                <li>Email: info@ejemplo.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-orange-500">Suscríbete</h3>
              <form className="space-y-2">
                <Input type="email" placeholder="Tu email" className="border-orange-200 focus:border-orange-500 focus:ring-orange-500" />
                <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">Suscribir</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">&copy; 2023 Tu Empresa. Todos los derechos reservados.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

