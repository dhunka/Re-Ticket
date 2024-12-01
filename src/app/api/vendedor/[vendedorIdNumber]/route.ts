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
        comprador: {
          select: { 
            nombre: true,
            rut: true,         
          }
        },
        ticket: {
          select: {
            id: true,  // El id del ticket
          }
        }
      },
    });

    if (!compra) {
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    // Lógica del temporizador
    const fechaExpiracion = new Date(compra.fecha_compra);
    fechaExpiracion.setDate(fechaExpiracion.getDate() + 1);

    const ahora = new Date();
    const expirado = ahora > fechaExpiracion;
    const tiempoRestante = fechaExpiracion.getTime() - ahora.getTime();

    return NextResponse.json({ 
      compra: {
        nombre: compra.comprador.nombre,
        rut: compra.comprador.rut,
        fechaExpiracion,
        expirado,
        tiempoRestante: Math.max(0, tiempoRestante),
        ticketId: compra.ticket.id, // Ahora se incluye el ticketId correctamente
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: true, 
      message: 'Error al obtener la compra', 
      details: error instanceof Error ? error.message : 'Desconocido' 
    }, { status: 500 });
  }
}
