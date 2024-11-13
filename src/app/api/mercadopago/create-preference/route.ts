// src/app/api/mercadopago/create-preference/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import db from '@/libs/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, quantity, variant, vendedorId } = body;

    // Obtener el token del vendedor desde la base de datos
    const vendedor = await db.usuario.findUnique({
      where: {
        id: vendedorId,
      },
      select: {
        mp_access_token: true, // El campo donde guardaste el token de acceso
      },
    });

    if (!vendedor || !vendedor.mp_access_token) {
      return NextResponse.json(
        { error: "Vendedor no autorizado en Mercado Pago" },
        { status: 400 }
      );
    }

    // Crear la preferencia usando el token del vendedor
    const mercadopago = new MercadoPagoConfig({
      accessToken: vendedor.mp_access_token,
    });

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: `${vendedorId}-${Date.now()}`,
            title: `${title} - ${variant}`,
            quantity: Number(quantity),
            unit_price: Number(price),
            currency_id: "CLP",
          },
        ],
        back_urls: {
          success: `${process.env.APP_URL}/Compra`,
          failure: `${process.env.APP_URL}/payment/failure`,
          pending: `${process.env.APP_URL}/payment/pending`,
        },
        notification_url: `${process.env.APP_URL}/api/mercadopago/webhooks`,
        auto_return: "approved",
        external_reference: `${vendedorId}-${Date.now()}`, // Referencia para identificar la venta
      },
    });

    return NextResponse.json(preference);
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Error creating payment preference" },
      { status: 500 }
    );
  }
}