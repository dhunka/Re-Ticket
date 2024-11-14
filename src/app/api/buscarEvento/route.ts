// src/app/api/buscarEvento/route.ts
import { NextResponse } from 'next/server'; // Usa NextResponse para manejar respuestas

import db from '@/libs/db';

export async function GET(req: Request) {
  // Obtén la URL de la solicitud
  const url = new URL(req.url); 
  // Obtén el parámetro de consulta 'query' usando URLSearchParams
  const query = url.searchParams.get('query'); 

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ message: 'No search query provided' }, { status: 400 });
  }

  try {
    const events = await db.evento.findMany({
      where: {
        nombre: {
          contains: query, 
          mode: 'insensitive', 
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ message: 'Error en la búsqueda', error }, { status: 500 });
  }
}
