'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: number;
  name: string;
  date: string;
  image: string;
}

// Componente para el carrusel de eventos
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
            src={event.image}
            alt={event.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-2">{event.name}</h2>
            <p className="text-white">{event.date}</p>
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

// Componente para la lista de eventos
const EventList: React.FC<{ title: string; events: Event[] }> = ({ title, events }) => (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-0">
            <Image
              src={event.image}
              alt={event.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{event.date}</p>
            <Link href={`/event/${event.id}`}>
              <Button className='bg-orange-600'>Ver detalles</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
)

export default function HomePage() {
  // Datos de ejemplo para los eventos
  const featuredEvents: Event[] = [
    { id: 1, name: "Concierto de Rock", date: "15 de Julio, 2023", image: "https://static.ptocdn.net/especiales/wal225_pixar-en-concierto/img/banner-desk-min.jpg" },
    { id: 2, name: "Festival de Jazz", date: "22 de Agosto, 2023", image: "https://static.ptocdn.net/especiales/wal226_mundo-pixar/img/portada-desktop.jpg" },
    { id: 3, name: "Obra de Teatro", date: "5 de Septiembre, 2023", image: "https://static.ptocdn.net/especiales/jts082_anuel-aa-real-hasta-la-muerte/img/nueva-portada-15N.png" },
  ]

  const latestEvents: Event[] = [
    { id: 4, name: "Exposición de Arte", date: "10 de Julio, 2023", image: "https://static.ptocdn.net/images/eventos/pls012v2_calugalistado.jpg" },
    { id: 5, name: "Conferencia Tech", date: "18 de Julio, 2023", image: "https://static.ptocdn.net/images/eventos/biz269_calugalistado.jpg" },
    { id: 6, name: "Concierto Pop", date: "25 de Julio, 2023", image: "https://static.ptocdn.net/images/eventos/lot176asdf1_calugalistado.jpg" },
    { id: 7, name: "Stand-up Comedy", date: "1 de Agosto, 2023", image: "https://static.ptocdn.net/images/eventos/glo145_calugalistado.jpg" },
  ]

  const musicEvents: Event[] = [
    { id: 8, name: "Festival Electrónico", date: "12 de Agosto, 2023", image: "https://static.ptocdn.net/images/eventos/div213_calugalistado.jpg" },
    { id: 9, name: "Concierto Clásico", date: "20 de Agosto, 2023", image: "https://static.ptocdn.net/images/eventos/swg157_calugalistado.jpg" },
    { id: 10, name: "Recital de Piano", date: "28 de Agosto, 2023", image: "https://static.ptocdn.net/images/eventos/dgm142_calugalistado.jpg" },
    { id: 11, name: "Batalla de Bandas", date: "5 de Septiembre, 2023", image: "https://static.ptocdn.net/images/eventos/sm0153_calugalistado.jpg" },
  ]

  const sportsEvents: Event[] = [
    { id: 12, name: "Partido de Fútbol", date: "3 de Septiembre, 2023", image: "https://static.ptocdn.net/images/eventos/sob002v3_calugalistado.jpg" },
    { id: 13, name: "Torneo de Tenis", date: "10 de Septiembre, 2023", image: "https://static.ptocdn.net/images/eventos/chj005_calugalistado.jpg" },
    { id: 14, name: "Carrera de Maratón", date: "17 de Septiembre, 2023", image: "https://static.ptocdn.net/images/eventos/biz298_calugalistado.jpg" },
    { id: 15, name: "Exhibición de Gimnasia", date: "24 de Septiembre, 2023", image: "https://static.ptocdn.net/images/eventos/swg159_calugalistado.jpg" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a Re-Ticket</h1>
      <EventCarousel events={featuredEvents} />
      <EventList title="Últimos Eventos" events={latestEvents} />
      <EventList title="Eventos Musicales" events={musicEvents} />
      <EventList title="Eventos Deportivos" events={sportsEvents} />
    </div>
  )
}