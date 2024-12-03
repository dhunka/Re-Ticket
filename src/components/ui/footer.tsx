
import Link from 'next/link'

export default function Footer() {

    return (
        <footer className="bg-white text-gray-800 border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-orange-500">Logo</h2>
              <p className="text-sm">Ofrecemos la pagina de compra y venta de entradas mas segura de chile</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-orange-500">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Inicio</Link></li>
                <li><Link href="/productos" className="hover:text-orange-500 transition-colors">Eventos</Link></li>
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
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">&copy; 2024 Re-ticket. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    )
}