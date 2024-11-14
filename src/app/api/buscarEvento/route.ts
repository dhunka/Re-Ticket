import { NextResponse } from 'next/server'; 
import db from '@/libs/db';

export async function GET(req: Request) {
  const url = new URL(req.url); 
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
