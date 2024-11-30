// api/ticket/[compraIdNumber]/route.ts
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
            vendedor: true,  // Trae el vendedor del ticket
          },
        },
      },
    });

    if (!compra) {
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    // Crear la valoración
    const valoracion = await db.valoracion.create({
      data: {
        vendedor_id: compra.ticket.vendedor.clerkId,  // ID del vendedor
        comprador_id: compra.comprador.clerkId,       // ID del comprador
        puntuacion,
        comentario,
      },
    });

    return NextResponse.json({ message: 'Valoración registrada', valoracion });
  } catch (error) {
    return NextResponse.json({ error: true, message: 'Error al registrar la valoración' }, { status: 500 });
  }
}
