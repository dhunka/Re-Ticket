'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar,  ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Badge } from "@/components/ui/badge"

interface Event {
  id: number;
  nombre: string;
  fecha_evento: string;
  url_foto: string;
  categoria: string;
}

const EventCarousel: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [events.length])

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-xl shadow-2xl">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`absolute top-0 left-0 w-full h-full transition-all duration-700 transform ${
            index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onClick={() => router.push(`/evento/${event.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <Image
            src={event.url_foto}
            alt={event.nombre}
            layout="fill"
            objectFit="cover"
            className="brightness-[0.85]"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <Badge className="mb-4 bg-orange-500 hover:bg-orange-600">{event.categoria}</Badge>
            <h2 className="text-5xl font-bold mb-3 drop-shadow-lg tracking-tight">
              {event.nombre}
            </h2>
            <div className="flex items-center gap-6 text-lg text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(event.fecha_evento).toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 right-8 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/20 text-white hover:bg-white hover:text-black transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/20 text-white hover:bg-white hover:text-black transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const EventList: React.FC<{ title: string; events: Event[] }> = ({ title, events }) => {
  const router = useRouter()

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <Button variant="ghost" className="text-orange-500 hover:text-orange-600">
          Ver todos
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-0 relative overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={event.url_foto}
                  alt={event.nombre}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    {event.categoria}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-5">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.nombre}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(event.fecha_evento).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
              <Button
                onClick={() => router.push(`/evento/${event.id}`)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Ver detalles
                <ArrowRight className="ml-2 h-4 w-4" />
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
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

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

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.refresh()
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-extrabold mb-8 text-center">
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Bienvenido a Re-Ticket
          </span>
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Descubre los mejores eventos y asegura tus entradas de manera fácil y segura
        </p>

        <EventCarousel events={featuredEvents} />
        <EventList title="Próximos Eventos" events={featuredEvents} />
      </div>
    </main>
  );
}

export default HomePage;