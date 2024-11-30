// api/ticket/[compraIdNumber]/route.ts
import { NextResponse } from 'next/server';
import db from '@/libs/db'; 

export async function GET(
  request: Request, 
  { params }: { params: { compraIdNumber: string } } 
) {
  const compraId = parseInt(params.compraIdNumber, 10);

  console.log('Recibido compraId:', compraId);

  if (isNaN(compraId)) {
    console.warn('ID de compra no válido:', compraId);
    return NextResponse.json({ error: true, message: 'ID de compra no válido' }, { status: 400 });
  }

  try {
    const compra = await db.compra.findUnique({
      where: { id: compraId },
      include: { 
        comprador:  true,
        ticket: {
          select: {
            archivo_url: true,
            id: true,  
          }
        }
      },
    });
    
    console.log('Consulta de la base de datos:', db.compra.findUnique.toString());
    console.log('Compra completa:', JSON.stringify(compra, null, 2));
    console.log('Ticket en la compra:', compra?.ticket);
    console.log('URL del archivo de ticket:', compra?.ticket?.archivo_url);
    console.log('la compra es: ', compraId)

    if (!compra) {
      console.warn('Compra no encontrada:', compraId);
      return NextResponse.json({ error: true, message: `Compra no encontrada con ID ${compraId}` }, { status: 404 });
    }

    // Lógica del temporizador
    const fechaExpiracion = new Date(compra.fecha_compra);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 1); // La compra expira en 1 día

    const ahora = new Date();
    const expirado = ahora > fechaExpiracion; // Verifica si la compra ha expirado
    const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime(); // Tiempo restante en milisegundos

    return NextResponse.json({ 
      compra: {
        ...compra, // Incluye todos los detalles de la compra, incluido el comprador
        ticket: compra.ticket,  // Asegúrate de que el ticket se incluya explícitamente
        fechaExpiracion,
        expirado,
        tiempoRestante: Math.max(0, tiempoRestante) // Asegura que el tiempo restante no sea negativo
      }
    });
  } catch (error) {
    console.error('Error al obtener la compra:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: true, message: 'Error al obtener la compra', details: error instanceof Error ? error.message : 'Desconocido' }, { status: 500 });
  }
}
