//src/api/vendedor/[vendedorIdNumber]/route.ts
import { NextResponse } from 'next/server';
import db from '@/libs/db'; 

export async function GET(
  request: Request, 
  { params }: { params: { vendedorIdNumber: string } } 
) {
  const vendedorId  = parseInt(params.vendedorIdNumber, 10);

  console.log('Recibido vendedorId:', vendedorId );

  if (isNaN(vendedorId)) {
    console.warn('ID de vendedor no válido:', vendedorId);
    return NextResponse.json({ error: true, message: 'ID de vendedor no válido' }, { status: 400 });
  }

  try {
    const compra = await db.compra.findUnique({
      where: { id: vendedorId },
      include: { 
        comprador: {
          select: { 
            nombre: true, // Solo incluir el nombre
            rut: true,    // Solo incluir el RUT
          }
        }
      },
    });

    if (!compra) {
      console.warn('Compra no encontrada:', vendedorId);
      return NextResponse.json({ error: true, message: 'Compra no encontrada' }, { status: 404 });
    }

    const { nombre, rut } = compra.comprador;

    return NextResponse.json({ 
      compra: {
        nombre,
        rut
      }
    });
  } catch (error) {
    console.error('Error al obtener la compra:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: true, message: 'Error al obtener la compra', details: error instanceof Error ? error.message : 'Desconocido' }, { status: 500 });
  }
}
