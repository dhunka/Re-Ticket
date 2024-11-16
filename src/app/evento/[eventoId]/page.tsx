import * as React from "react";
import Image from "next/image";
import { Mail, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

import { getEvento } from "../../actions/actionsEvento";



interface EventPageProps {
  eventoId: number;
  evento: {
    nombre: string;
    descripcion: string;
    url_foto: string;
    fecha_evento: string;
    ubicacion: string;
    tipos_entrada: { id: number; nombre: string; precio: number }[];
    vendedor_id: number;

  };
  ticket: {
    id: number;
    tipo_entrada_id: number;
    precio: number;
    estado: string;
    usuario_id: number;
    evento_id: number;
    vendedorId: number;
  }
  params: {
    eventoId: number;
  },
}


const EventPage: React.FC<EventPageProps> = async ({ params }) => {

  const evento = await getEvento(params.eventoId);
  if (!evento) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1>Evento no encontrado</h1>
      </div>
    );
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
                <Image src={evento.url_foto} alt={evento.nombre} fill className="object-cover" priority />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-200">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(evento.fecha_evento), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-200">
                  <Clock className="h-5 w-5" />
                  <span>{format(new Date(evento.fecha_evento), "HH:mm")}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-200">
                  <MapPin className="h-5 w-5" />
                  <span>{evento.ubicacion}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-200">
                  <Mail className="h-5 w-5" />
                  <span>E-ticket</span>
                </div>
              </div>
            </div>

            <div className="border-0 bg-black/40 backdrop-blur p-4 rounded-lg">
              <h3 className="text-xl text-white">Mapa del Venue</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden my-4">
                <Image src="/placeholder.jpg" alt="Mapa del Estadio" fill className="object-cover" priority />
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
         
          </div>
        </div>
      </div>
    </div>
  );
};


export default EventPage;