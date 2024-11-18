'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation' // Importa useRouter

interface Event {
  id: number;
  nombre: string;
  fecha_evento: string;
  url_foto: string;
  categoria: string; // Agrega esta propiedad
}

const EventCarousel: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [events.length])

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={event.url_foto}
            alt={event.nombre}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{event.nombre}</h2>
            <p className="text-white">{new Date(event.fecha_evento).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/75"
        onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}

const EventList: React.FC<{ title: string; events: Event[] }> = ({ title, events }) => {
  const router = useRouter()  // Usamos useRouter para la redirección

  const handleRedirect = (eventId: number) => {
    router.push(`/evento/${eventId}`)  // Redirige a la página del evento específico
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-0">
              <Image
                src={event.url_foto}
                alt={event.nombre}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="font-semibold text-lg mb-1">{event.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{new Date(event.fecha_evento).toLocaleDateString()}</p>
              <Button
                onClick={() => handleRedirect(event.id)} // Llama a la función de redirección
                className="bg-orange-600"
              >
                Ver detalles
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("/api/eventos");
      if (res.ok) {
        const data = await res.json();
        setFeaturedEvents(data);
      } else {
        console.error("Error al obtener eventos");
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a Re-Ticket</h1>
      <EventCarousel events={featuredEvents} />
      <EventList title="Últimos Eventos" events={featuredEvents} />
    </div>
  );
}

export default HomePage;
