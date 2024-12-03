//src/api/vendedor/[vendedorIdNumber]/route.ts
'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function GET(
  request: Request, 
  { params }: { params: { vendedorIdNumber: string } }
) {
  const compraId = parseInt(params.vendedorIdNumber, 10);

  if (isNaN(compraId)) {
    return NextResponse.json({ error: true, message: 'ID de compra no válido' }, { status: 400 });
  }

  try {
    const compra = await db.compra.findUnique({
      where: { id: compraId },
      include: { 
        comprador: { select: { nombre: true, rut: true, apellido: true } },
        ticket: { select: { id: true } },
      },
    });

    if (!compra) {
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    const fechaExpiracion = new Date(compra.fecha_compra);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 1);

    const ahora = new Date();
    const expirado = ahora > fechaExpiracion;
    const tiempoRestante = Math.max(0, fechaExpiracion.getTime() - ahora.getTime());

    return NextResponse.json({
      compra: {
        nombre: compra.comprador.nombre,
        rut: compra.comprador.rut,
        apellido: compra.comprador.apellido,
        fechaExpiracion,
        expirado,
        tiempoRestante,
        ticketId: compra.ticket.id,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: 'Error al obtener la compra',
      details: error instanceof Error ? error.message : 'Desconocido',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: Request, 
  { params }: { params: { vendedorIdNumber: string } }
) {
  const compraId = parseInt(params.vendedorIdNumber, 10);
  const { nuevoEstado } = await request.json(); // Obtén el nuevo estado

  if (isNaN(compraId)) {
    return NextResponse.json({ error: true, message: 'ID de compra no válido' }, { status: 400 });
  }

  // Verificar si el estado es uno de los valores válidos
  const estadosValidos = ['OrderPlaced', 'WaitingForRelease', 'TicketsReleased', 'Completed'];
  if (!estadosValidos.includes(nuevoEstado)) {
    return NextResponse.json({ error: true, message: 'Estado no válido' }, { status: 400 });
  }

  try {
    // Actualizar el estado del ticket y la compra
    const compra = await db.compra.update({
      where: { id: compraId },
      data: {
        ticket: {
          update: {
            estado: nuevoEstado, // Actualizar el estado del ticket
          },
        },
        estado: nuevoEstado, // Actualizar el estado de la compra
      },
      include: {
        ticket: true,
      },
    });

    return NextResponse.json({ message: `Estado del ticket y compra actualizado a ${nuevoEstado}`, compra });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: 'Error al actualizar el estado del ticket',
      details: error instanceof Error ? error.message : 'Desconocido',
    }, { status: 500 });
  }
}
