// src/app/api/eventos/route.ts
import { NextResponse } from "next/server";
import db from "@/libs/db"; // Verifica que esta ruta sea correcta

export async function GET() {
  try {
    const eventos = await db.evento.findMany();
    return NextResponse.json(eventos);  // Devolver todos los eventos como JSON
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    return NextResponse.json({ error: "Error al obtener los eventos" }, { status: 500 });
  }
}
