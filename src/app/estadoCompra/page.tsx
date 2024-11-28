'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';  // Usa `next/navigation` en lugar de `next/router` en Next.js 14

interface VendorData {
  isVendor: boolean;
  buyerName?: string;
  buyerRUT?: string;
  sellerName?: string;
  sellerRating?: number;
  sellerComment?: string;
}

const TrabajoPage = () => {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<VendorData | null>(null);
  const [isClient, setIsClient] = useState(false);  // Estado para verificar si es cliente
  const router = useRouter();  // `useRouter` de `next/navigation` para Next.js 14

  useEffect(() => {
    // Esto asegura que useRouter solo se ejecute en el cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !isLoaded) return;  // Evitar ejecución si aún no está cargado

    if (!user) {
      // Si el usuario no está autenticado, redirigir a login
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      const res = await fetch('/api/ticket', {
        method: 'POST',
        body: JSON.stringify({ clerkId: user.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [user, isLoaded, isClient, router]);  // Asegúrate de que se ejecute solo cuando esté listo

  if (!user) {
    return <div>No estás autenticado, por favor inicia sesión.</div>;
  }

  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Bienvenido {user.firstName}!</h1>
      {data.isVendor ? (
        <>
          <h2>Datos del Comprador</h2>
          <p>Nombre: {data.buyerName}</p>
          <p>RUT: {data.buyerRUT}</p>
        </>
      ) : (
        <>
          <h2>Valoración del Vendedor</h2>
          <p>Vendedor: {data.sellerName}</p>
          <p>Puntuación: {data.sellerRating}</p>
          {data.sellerComment && <p>Comentario: {data.sellerComment}</p>}
        </>
      )}
    </div>
  );
};

export default TrabajoPage;