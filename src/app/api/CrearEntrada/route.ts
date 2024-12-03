// src/app/api/CrearEntrada/route.ts
import { NextResponse } from "next/server";
import db from "@/libs/db";


export async function POST(request: Request) {
  
  try {

    const data = await request.json();

    const ticket = await db.ticket.create({
      data: {
        evento_id: data.evento_id,
        vendedor_id: data.vendedor_id,
        tipo_entrada_id: data.tipo_entrada_id,
        precio: parseFloat(data.precio),
        estado: "disponible",
        fecha_vencimiento: new Date
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error al crear el ticket:", error);
    return NextResponse.json(
      { error: "Error al crear el ticket" },
      { status: 500 }
    );
  }
}