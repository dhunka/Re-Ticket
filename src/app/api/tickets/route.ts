import { NextResponse } from 'next/server';
import db from '@/libs/db'


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get('clerkId'); // ID del cliente (clerkId)

  if (!clerkId) {
    return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 });
  }

  try {
    
    const compras = await db.compra.findMany({
      where: { comprador_id: clerkId },
      include: {
        ticket: {
          include: {
            evento: true, // Información del evento asociado
            tipo_entrada: true, // Tipo de entrada asociado
          },
        },
      },
    });
    console.log(compras)
    return NextResponse.json(compras);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}
