import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Falta el ID del vendedor' }, { status: 400 });
    }

    // Consulta para obtener los tickets vendidos por el usuario
    const ticketsVendidos = await db.ticket.findMany({
      where: {
        vendedor_id: clerkId,
      },
      include: {
        evento: true,
        tipo_entrada: true,
      },
    });

    return NextResponse.json(ticketsVendidos, { status: 200 });
  } catch (error) {
    console.error('Error al obtener tickets vendidos:', error);
    return NextResponse.json({ error: 'Error al obtener tickets vendidos' }, { status: 500 });
  }
}
