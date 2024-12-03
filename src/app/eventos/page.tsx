'use client'

import { useEffect, useState } from 'react'
import { Calendar, Music, Theater, Film, Trophy, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Image from 'next/image' // Asegúrate de importar Image desde Next.js
import Link from 'next/link' // Importamos Link para la navegación

type Event = {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  fecha_evento: string;
  descripcion: string;
  url_foto: string;
}

const categoryIcons = {
  'Teatro': Theater,
  'Cine': Film,
  'Concierto': Music,
  'Deportes': Trophy,
  'Festival': Activity,
  'Conferencia': Calendar,
} as const;

const categories = [
  { value: 'all', label: 'Todas' },
  { value: 'Teatro', label: 'Teatro' },
  { value: 'Cine', label: 'Cine' },
  { value: 'Concierto', label: 'Concierto' },
  { value: 'Deportes', label: 'Deportes' },
  { value: 'Festival', label: 'Festival' },
  { value: 'Conferencia', label: 'Conferencia' },
]

export default function Component() {
  const [events, setEvents] = useState<Event[]>([])
  const [categoria, setCategory] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/filtro?categoria=${encodeURIComponent(categoria)}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoria]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>
      
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={categoria === cat.value ? "secondary" : "outline"}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center">Cargando eventos...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <p>No hay eventos disponibles para esta categoría.</p>
          ) : (
            events.map((event) => {
              const IconComponent = categoryIcons[event.categoria as keyof typeof categoryIcons] || Calendar;
              return (
                <Link key={event.id} href={`/evento/${event.id}`}>
                  <Card className="overflow-hidden cursor-pointer">
                    {event.url_foto && (
                      <div className="w-full h-48 relative">
                        <Image 
                          src={event.url_foto} 
                          alt={event.nombre}
                          layout="fill" // Hace que la imagen ocupe el contenedor
                          objectFit="cover" // Se asegura de cubrir el área del contenedor
                          className="w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold">
                        {event.nombre}
                      </CardTitle>
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Categoría:</span> {event.categoria}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Ubicación:</span> {event.ubicacion}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Fecha:</span> {formatDate(event.fecha_evento)}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.descripcion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
