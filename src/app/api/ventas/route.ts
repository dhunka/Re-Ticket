'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db';

// Crear una disputa
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { compra_id, comprador_id, ticket_id, descripcion, estado } = data;

    if (!compra_id || !comprador_id || !ticket_id || !estado) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 });
    }

    const nuevaDisputa = await db.disputa.create({
      data: {
        compra_id,
        comprador_id,
        ticket_id,
        descripcion,
        estado,
      },
    });

    return NextResponse.json(nuevaDisputa, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la disputa.' }, { status: 500 });
  }
}

// Obtener todas las disputas
export async function GET() {
  try {
    const disputas = await db.disputa.findMany({
      include: {
        compra: true,
        comprador: true,
        ticket: true,
      },
    });

    return NextResponse.json(disputas, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las disputas.' }, { status: 500 });
  }
}

// Actualizar una disputa por ID
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, estado, descripcion } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID de la disputa es requerido.' }, { status: 400 });
    }

    const disputaActualizada = await db.disputa.update({
      where: { id },
      data: {
        estado,
        descripcion,
      },
    });

    return NextResponse.json(disputaActualizada, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar la disputa.' }, { status: 500 });
  }
}

// Eliminar una disputa por ID
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de la disputa es requerido.' }, { status: 400 });
    }

    await db.disputa.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Disputa eliminada correctamente.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar la disputa.' }, { status: 500 });
  }
}
