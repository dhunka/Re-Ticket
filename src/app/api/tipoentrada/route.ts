'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function GET() {
  try {
    // Buscar tipos de entrada asociados al evento con id 6
    const tiposEntrada = await db.tipoEntrada.findMany({
      where: { evento_id: 6 },
    });
    return NextResponse.json(tiposEntrada);
  } catch (error) {
    console.error('Error fetching tipos de entrada:', error);
    return NextResponse.json({ error: 'Error fetching tipos de entrada' }, { status: 500 });
  }
}
