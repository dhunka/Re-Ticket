// api/tiempo/route.ts
import { NextResponse } from 'next/server';
import db from '@/libs/db'; 

export async function GET(request: Request) {
  try {
    // Extract compraId from URL search params
    const url = new URL(request.url);
    const compraId = Number(url.searchParams.get('compraId'));

    if (!compraId) {
      return NextResponse.json({ error: 'ID de compra es requerido' }, { status: 400 });
    }

    const resultado = await obtenerCompraConTemporizador(compraId);
    return NextResponse.json(resultado);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' }, 
      { status: 500 }
    );
  }
}

async function obtenerCompraConTemporizador(compraId: number) {
  const compra = await db.compra.findUnique({
    where: { id: compraId },
  });

  if (!compra) {
    throw new Error('Compra no encontrada');
  }

  const fechaExpiracion = new Date(compra.fecha_compra);
  fechaExpiracion.setDate(fechaExpiracion.getDate() + 1);

  const ahora = new Date();
  const expirado = ahora > fechaExpiracion;
  const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime();

  return {
    compra,
    fechaExpiracion,
    expirado,
    tiempoRestante: Math.max(0, tiempoRestante), // Evitar tiempos negativos
  };
}