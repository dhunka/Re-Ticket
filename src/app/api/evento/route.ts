import { NextRequest, NextResponse } from 'next/server';
import db from '@/libs/db';

export async function POST(req: NextRequest) {
  const { nombre, ubicacion, fecha_evento, fecha_termino, descripcion, categoria, organizador_id } = await req.json();

  if (!nombre || !ubicacion || !fecha_evento || !fecha_termino || !categoria || !organizador_id) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
  }

  try {
    const nuevoEvento = await db.evento.create({
      data: {
        nombre,
        ubicacion,
        fecha_evento: new Date(fecha_evento),
        fecha_termino: new Date(fecha_termino),
        descripcion,
        categoria,
        organizador_id: parseInt(organizador_id),  
      },
    });

    return NextResponse.json(nuevoEvento, { status: 201 });
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return NextResponse.json({ error: 'Error al crear el evento' }, { status: 500 });
  }
}
