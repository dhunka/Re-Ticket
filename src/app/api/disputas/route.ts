import { NextResponse } from 'next/server'
import db from '@/libs/db'  // Importar la instancia de Prisma desde db.ts

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { compra_id, comprador_id, ticket_id, descripcion } = body

    // Convertir compra_id y ticket_id a números enteros si son cadenas de texto
    const compraIdInt = parseInt(compra_id, 10)
    const ticketIdInt = parseInt(ticket_id, 10)

    // Verificar si las conversiones son válidas
    if (isNaN(compraIdInt) || isNaN(ticketIdInt)) {
      return NextResponse.json({ error: 'El ID de compra o ticket no es válido.' }, { status: 400 })
    }

    // Crear una disputa en la base de datos usando la instancia de Prisma importada como db
    const disputa = await db.disputa.create({
      data: {
        compra_id: compraIdInt,
        comprador_id,
        ticket_id: ticketIdInt,
        descripcion,
        estado: 'pendiente',  // estado inicial de la disputa
      },
    })

    return NextResponse.json(disputa, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear disputa' }, { status: 500 })
  }
}
