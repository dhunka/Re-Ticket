
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Input } from "@/components/ui/input"
export default function Footer() {

    return (
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
                <Link href="https://www.instagram.com/m0nn.x/" className="text-gray-600 hover:text-orange-500 transition-colors">
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
    )
}