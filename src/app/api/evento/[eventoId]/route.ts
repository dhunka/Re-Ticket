import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function GET(
    req: Request,
    { params }: { params: { eventoId: number } }
) {
    try {
        if (!params.eventoId) {
            return new NextResponse("evento id is required", { status: 400 });
        }

        const evento = await db.evento.findUnique({
            where: {
                id: (params.eventoId )
            },
            include: {
                tickets: true,
                tipos_entrada: {
                    include:{
                        tickets: true
                    }
                }

            }
        });

        if (!evento) {
            return new NextResponse("Evento no encontrado", { status: 404 });
        }

        return NextResponse.json(evento);
    } catch (error) {
        console.log('[EVENTO_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}