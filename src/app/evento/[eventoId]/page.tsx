
'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import EntradasSelector from "@/components/ui/EntradaSelector";
import { Ticket,TipoEntrada,} from "@prisma/client";

interface Evento {
  id: number; // Asegúrate de incluir el ID del evento
  nombre: string;
  descripcion: string;
  url_foto: string;
  fecha_evento: string; // O Date, dependiendo de cómo lo manejes
  ubicacion: string;
  tickets: Ticket[]; // Asegúrate de que esto coincida con la estructura de tu API
  tipos_entrada: TipoEntrada[]; // Asegúrate de que esto coincida con la estructura de tu API
}


interface EventPageProps {
  params: {
    eventoId: string;
  };
}

const EventPage: React.FC<EventPageProps> = ({ params }) => {
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await fetch(`/api/evento/${params.eventoId}`);
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setLoading(false);
        } else {
          setEvento(data);
          setLoading(false);
        }
      } catch (err) {
        setError("Error al cargar el evento.");
        setLoading(false);
      }
    };

    fetchEvento();
  }, [params.eventoId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!evento) {
    return <div>No se encontró el evento.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div className="border-0 bg-black/40 backdrop-blur p-4 rounded-lg">
              <h2 className="text-3xl font-bold text-white">{evento.nombre}</h2>
              <p className="text-gray-400">{evento.descripcion}</p>
              <div className="relative aspect-video rounded-lg overflow-hidden my-4">
                <Image
                  src={evento.url_foto}
                  alt={evento.nombre}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-200">
                  <span>{format(new Date(evento.fecha_evento), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-200">
                  <span>{evento.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
          <EntradasSelector
              tiposEntrada={evento.tipos_entrada.map((entrada) => ({
                id: entrada.id,
                nombre: entrada.nombre,
                precio_base: entrada.precio_base,
                evento_id: entrada.evento_id,
                descripcion: entrada.descripcion
              }))}
               tickets={evento.tickets}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
