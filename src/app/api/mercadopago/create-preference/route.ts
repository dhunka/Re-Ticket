// src/api/mercadopago/create-preference/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import db from "@/libs/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, quantity,  vendedorId, ticketId, compradorId } = body;

    console.log('📦 Datos recibidos:', body);

    if (!ticketId || !vendedorId || !compradorId) {
      console.log('❌ Campos faltantes:', { ticketId, vendedorId, compradorId });
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const vendedor = await db.usuario.findUnique({
      where: { clerkId: vendedorId },
    });

    if (!vendedor || !vendedor.mp_access_token) {
      return NextResponse.json(
        { error: "Vendedor no autorizado en Mercado Pago" },
        { status: 400 }
      );
    }

    const marketplaceFee = Number(price) * 0.1;

    // Crear la compra sin especificar el ID
    const compraData = {
      ticket_id: Number(ticketId),
      comprador_id: compradorId,
      precio_total: Number(price),
      metodo_pago: "mercadopago",
      estado: "pendiente",
      video_vendedor: "", 
      fondos_liberados: false,
      confirmacion: false,
      fecha_compra: new Date(),
    };

    console.log('📝 Creando compra con datos:', compraData);

    const compra = await db.compra.create({
      data: compraData
    });

    console.log('✅ Compra creada:', compra);

    // Actualizar el estado del ticket a reservado
    await db.ticket.update({
      where: { id: Number(ticketId) },
      data: { estado: "reservado" }
    });

    const mercadopago = new MercadoPagoConfig({
      accessToken: vendedor.mp_access_token,
    });

    const preferenceData = {
      items: [
        {
          id: `${ticketId}`,
          title: `${title}`,
          quantity: Number(quantity),
          unit_price: Number(price),
          currency_id: "CLP",
        },
      ],
      marketplace_fee: marketplaceFee,
      back_urls: {
        success: `${process.env.APP_URL}/compra/${compra.id}`,
        failure: `${process.env.APP_URL}/compra/${compra.id}`,
        pending: `${process.env.APP_URL}/compra/${compra.id}`,
      },
      notification_url: `${process.env.APP_URL}/api/mercadopago/webhook`,
      auto_return: "approved",
      external_reference: compra.id.toString(),
    };

    console.log('🔧 Creando preferencia con datos:', preferenceData);

    const preference = await new Preference(mercadopago).create({
      body: preferenceData
    });

    console.log('✅ Preferencia creada:', preference);

    return NextResponse.json({
      ...preference,
      compraId: compra.id
    });
  } catch (error) {
    console.error("❌ Error creating preference:", error);

    // Log más detallado del error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      { error: "Error creating payment preference" },
      { status: 500 }
    );
  }
}