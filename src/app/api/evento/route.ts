import { NextRequest, NextResponse } from 'next/server';
import db from '@/libs/db';

// Define los tipos de los datos que recibes en el cuerpo de la solicitud
interface TipoEntrada {
  nombre: string;
  descripcion?: string | null;
  precio_base: number;
}

interface EventoRequest {
  id: string;
  nombre: string;
  ubicacion: string;
  fecha_evento: string;
  url_foto?: string;
  descripcion?: string;
  categoria: string;
  tipos_entrada: TipoEntrada[];
}

export async function POST(req: NextRequest) {
  try {
    const { 
      nombre, 
      ubicacion, 
      fecha_evento, 
      url_foto,
      descripcion, 
      categoria,
      tipos_entrada,
    }: EventoRequest = await req.json(); // Desestructuración con tipo explícito

    // Validar campos obligatorios
    if (!nombre || !ubicacion || !fecha_evento || !categoria || !tipos_entrada || tipos_entrada.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar la estructura de tipos_entrada
    const invalidTipos = tipos_entrada.some((tipo) => 
      !tipo.nombre || 
      typeof tipo.precio_base !== 'number' || 
      tipo.precio_base <= 0
    );

    if (invalidTipos) {
      return NextResponse.json(
        { error: 'Estructura inválida en tipos de entrada' },
        { status: 400 }
      );
    }

    // Crear el evento con tipos_entrada anidados
    const nuevoEvento = await db.evento.create({
      data: {
        nombre,
        ubicacion,
        fecha_evento: new Date(fecha_evento),
        url_foto,
        descripcion,
        categoria,
        tipos_entrada: {
          create: tipos_entrada.map((tipo) => ({
            nombre: tipo.nombre,
            descripcion: tipo.descripcion || null,
            precio_base: tipo.precio_base
          }))
        }
      },
      include: {
        tipos_entrada: true
      }
    });

    return NextResponse.json(nuevoEvento, { status: 201 });
  } catch (error) {
    console.error('Error al crear el evento:', error);
    return NextResponse.json(
      { error: 'Error al crear el evento' },
      { status: 500 }
    );
  }
}


