'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db'; 

// GET: Obtener los detalles de la compra, incluido el comprador y sus valoraciones
export async function GET(
  request: Request, 
  { params }: { params: { compraIdNumber: string } } 
) {
  const compraId = parseInt(params.compraIdNumber, 10);

  if (isNaN(compraId)) {
    return NextResponse.json({ error: true, message: 'ID de compra no válido' }, { status: 400 });
  }
  try {
    const compra = await db.compra.findUnique({
      where: { id: compraId },
      include: { 
        comprador: {
          include: {
            Valoracion: true,  // Trae las valoraciones del comprador
          }
        },
        ticket: { 
          select: {
            archivo_url: true,
            id: true,
            estado: true, // Incluimos el estado del ticket
          },
        },
      },
    });

    if (!compra) {
      return NextResponse.json({ error: true, message: `Compra no encontrada con ID ${compraId}` }, { status: 404 });
    }

    const fechaExpiracion = new Date(compra.fecha_compra);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 1); // La compra expira en 1 día

    const ahora = new Date();
    const expirado = ahora > fechaExpiracion;
    const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime();

    return NextResponse.json({ 
      compra: {
        ...compra,
        ticket: compra.ticket,
        fechaExpiracion,
        expirado,
        tiempoRestante: Math.max(0, tiempoRestante),
      }
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: 'Error al obtener la compra' }, { status: 500 });
  }
}

// POST: Dejar una valoración para el vendedor
export async function POST(
  request: Request, 
  { params }: { params: { compraIdNumber: string } }
) {
  const compraId = parseInt(params.compraIdNumber, 10);
  const { puntuacion, comentario } = await request.json(); // Obtén la puntuación y el comentario del cuerpo de la solicitud

  if (isNaN(compraId)) {
    return NextResponse.json({ error: true, message: 'ID de compra no válido' }, { status: 400 });
  }

  try {
    // Verificar si la compra existe y obtener la información del comprador y vendedor
    const compra = await db.compra.findUnique({
      where: { id: compraId },
      include: {
        comprador:{
          include:{
            Valoracion:{
              select:{
                puntuacion:true,
                comentario:true,
                comprador_id:true,
                vendedor_id: true}}}},
        ticket: {
          include: {
            vendedor: true,  
          },
        },
      },
    });

    if (!compra) {
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    const valoracion = await db.valoracion.create({
      data: {
        vendedor_id: compra.ticket.vendedor.clerkId, 
        comprador_id: compra.comprador.clerkId,       
        puntuacion,
        comentario,
      },
    });
    return NextResponse.json({ message: 'Valoración registrada', valoracion });
  } catch (error) {
    return NextResponse.json({ error: true, message: 'Error al registrar la valoración' }, { status: 500 });
  }
}

// PATCH: Actualizar el estado del ticket en función del progreso de la compra
// PATCH: Cambiar el estado del ticket y la compra
export async function PATCH(
  request: Request, 
  { params }: { params: { compraIdNumber: string } }
) {
  const compraId = parseInt(params.compraIdNumber, 10);
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
    // Si el estado es 'TicketsReleased' o 'Completed', actualizamos el estado
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
    return NextResponse.json({ error: true, message: 'Error al actualizar el estado del ticket' }, { status: 500 });
  }
}
