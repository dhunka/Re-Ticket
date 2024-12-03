'use client'

import Link from 'next/link'
import { Ticket, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Re-Ticket
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Ofrecemos la plataforma de compra y venta de entradas más segura de Chile. 
              Tu destino confiable para vivir experiencias inolvidables.
            </p>
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="hover:text-orange-500 rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:text-orange-500 rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:text-orange-500 rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/eventos', label: 'Eventos' },
                { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className="group flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                <span>Av. Providencia 1234, Providencia, Santiago, Chile</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>+56 9 2345 6789</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-orange-500" />
                <a 
                  href="mailto:contacto@re-ticket.cl" 
                  className="hover:text-orange-500 transition-colors"
                >
                  contacto@re-ticket.cl
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Re-ticket. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacidad" className="hover:text-orange-500 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-orange-500 transition-colors">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}