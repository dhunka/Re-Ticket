// src/app/api/mercadopago/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, OAuth } from "mercadopago";
import db from '@/libs/db';

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state"); // Recuperamos el userId del state

    if (!code || !state) {
        return NextResponse.json(
            { error: "Código o usuario no proporcionado" },
            { status: 400 }
        );
    }

    const mercadopago = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    try {
        const credentials = await new OAuth(mercadopago).create({
            body: {
                client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!,
                client_secret: process.env.MP_CLIENT_SECRET!,
                code,
                redirect_uri: `${process.env.APP_URL}/api/mercadopago/connect`,
            },
        });

        // Actualizamos el usuario usando el ID recibido
        await db.usuario.update({
            where: { clerkId: state }, // Usamos el userId recibido en el state
            data: {
                mp_access_token: credentials.access_token,
                mp_refresh_token: credentials.refresh_token,
                mp_connected: true,
            },
        });

        return NextResponse.redirect(`${process.env.APP_URL}/autorizacionMp/success`);
    } catch (error) {
        console.error('Error en connect:', error);
        return NextResponse.json(
            { error: "Error en la conexión" },
            { status: 500 }
        );
    }
}