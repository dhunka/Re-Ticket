
'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db';


export async function GET(req: Request, { params }: { params: { eventoId: string } }) {
  const { eventoId } = params;
  
  // Obtén el evento y los tickets asociados, incluyendo los vendedores y sus valoraciones
  const evento = await db.evento.findUnique({
    where: { id: Number(eventoId) },
    include: {
      tickets: {
        include: {
          vendedor: {
            include: {
              valoraciones: true, // Incluir las valoraciones de cada vendedor
            },
          },
        },
      },
      tipos_entrada: true,
    },
  });

  if (!evento) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  return NextResponse.json(evento);
}
