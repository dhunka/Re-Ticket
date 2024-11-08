"use client"
import Image from 'next/image' // Añadido el import de Image
import { Button } from "@/components/ui/button"
import HomeImage from '../../public/images/home.jpg'

export default function HomePage() {
  return (
    <>
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
                <Button variant="outline" className=" border-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg">
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
    </>
  );
}

