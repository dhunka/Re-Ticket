'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button'; // Importar un componente de Shadcn para mejorar el diseño

type Compra = {
  id: number;
  fecha_compra: string;
  precio_total: number;
  metodo_pago: string;
  ticket: {
    id: number;
    estado: string;
    precio: number;
    evento: {
      nombre: string;
      fecha_evento: string;
    };
    tipo_entrada: {
      nombre: string;
    };
  };
};

const HistorialPage = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener información del usuario autenticado
  const { user, isLoaded } = useUser(); // useUser en vez de useAuth

  useEffect(() => {
    const fetchCompras = async () => {
      if (!user) return; // Asegúrate de que el usuario esté autenticado

      const clerkId = user.id; // Accede al clerkId desde el objeto user

      try {
        const response = await fetch(`/api/tickets?clerkId=${clerkId}`); // Usar clerkId de Clerk
        if (!response.ok) {
          throw new Error('Error al obtener las compras');
        }
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    // Solo ejecutamos la solicitud cuando la sesión esté completamente cargada
    if (isLoaded) {
      fetchCompras();
    }
  }, [isLoaded, user]);

  if (loading) {
    return <p className="text-orange-500 font-semibold text-xl text-center">Cargando historial de compras...</p>;
  }

  if (!user) {
    return <p className="text-red-500 font-semibold text-xl text-center">No estás autenticado. Por favor, inicia sesión.</p>;
  }

  if (compras.length === 0) {
    return <p className="text-yellow-500 font-semibold text-xl text-center">No se encontraron compras para este cliente.</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center font-bold text-orange-600 mb-6">Historial de Compras</h1>
      <ul className="space-y-4">
        {compras.map((compra) => (
          <li key={compra.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
            <p className="text-lg text-gray-800"><strong>Evento:</strong> {compra.ticket.evento.nombre}</p>
            <p className="text-sm text-gray-600"><strong>Fecha del Evento:</strong> {new Date(compra.ticket.evento.fecha_evento).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><strong>Tipo de Entrada:</strong> {compra.ticket.tipo_entrada.nombre}</p>
            <p className="text-sm text-gray-600"><strong>Precio Total:</strong> ${Number(compra.precio_total).toFixed(2)}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de Compra:</strong> {new Date(compra.fecha_compra).toLocaleDateString()}</p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded">
              Ver detalles
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialPage;
