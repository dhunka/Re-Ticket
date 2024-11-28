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
    // Realiza la consulta a la base de datos asegurándote de que compraId es un número
    const compra = await db.compra.findUnique({
      where: { id: compraId },
      include: { comprador: true },  // Aquí puedes incluir más relaciones si es necesario
    });

    if (!compra) {
      console.warn('Compra no encontrada:', compraId);
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ compra });
  } catch (error) {
    console.error('Error al obtener la compra:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: true, message: 'Error al obtener la compra', details: error instanceof Error ? error.message : 'Desconocido' }, { status: 500 });
  }
}
