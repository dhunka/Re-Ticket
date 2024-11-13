// src/app/api/mercadopago/authorize/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, OAuth } from "mercadopago";

export async function GET() {
  const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
  });

  try {
    const url = new OAuth(mercadopago).getAuthorizationURL({
      options: {
        client_id: process.env.NEXT_PUBLIC_MP_CLIENT_ID!,
        redirect_uri: `${process.env.APP_URL}/api/mercadopago/connect`,
      },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error en authorize:', error);
    return NextResponse.json(
      { error: "Error al obtener URL de autorización" }, 
      { status: 500 }
    );
  }
}