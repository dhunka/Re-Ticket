// app/api/filtro/route.ts
import db from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoria = searchParams.get('categoria');

  const whereClause: Prisma.EventoWhereInput = {};

  if (categoria && categoria !== 'all') {
    whereClause.categoria = String(categoria);
  }

  try {
    const events = await db.evento.findMany({
      where: whereClause,
      select: {
        id: true,
        nombre: true,
        categoria: true,
        ubicacion: true,
        fecha_evento: true,
        descripcion: true,
        url_foto: true,
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }
}