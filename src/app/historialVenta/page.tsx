'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button'; // Componente de Shadcn

type Venta = {
  id: number;
  fecha_vencimiento: string;
  precio: number;
  evento: {
    nombre: string;
    fecha_evento: string;
  };
  tipo_entrada: {
    nombre: string;
  };
};

const HistorialVentaPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchVentas = async () => {
      if (!user) return;

      const clerkId = user.id;

      try {
        const response = await fetch(`/api/ventas?clerkId=${clerkId}`);
        if (!response.ok) {
          throw new Error('Error al obtener las ventas');
        }
        const data = await response.json();
        setVentas(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchVentas();
    }
  }, [isLoaded, user]);

  if (loading) {
    return <p className="text-orange-500 font-semibold text-xl text-center">Cargando historial de ventas...</p>;
  }

  if (!user) {
    return <p className="text-red-500 font-semibold text-xl text-center">No estás autenticado. Por favor, inicia sesión.</p>;
  }

  if (ventas.length === 0) {
    return <p className="text-yellow-500 font-semibold text-xl text-center">No se encontraron ventas para este cliente.</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center font-bold text-orange-600 mb-6">Historial de Ventas</h1>
      <ul className="space-y-4">
        {ventas.map((venta) => (
          <li key={venta.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition">
            <p className="text-lg text-gray-800"><strong>Evento:</strong> {venta.evento.nombre}</p>
            <p className="text-sm text-gray-600"><strong>Fecha del Evento:</strong> {new Date(venta.evento.fecha_evento).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><strong>Tipo de Entrada:</strong> {venta.tipo_entrada.nombre}</p>
            <p className="text-sm text-gray-600"><strong>Precio:</strong> ${Number(venta.precio).toFixed(2)}</p>
            <p className="text-sm text-gray-600"><strong>Fecha de Vencimiento:</strong> {new Date(venta.fecha_vencimiento).toLocaleDateString()}</p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded">
              Ver detalles
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistorialVentaPage;
