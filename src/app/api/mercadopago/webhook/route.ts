// src/api/mercadopago/webhooks/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import db from "@/libs/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log completo de lo que recibe el webhook
    console.log('💡 WEBHOOK RECIBIDO');
    console.log('📍 URL:', request.url);
    console.log('📦 BODY:', JSON.stringify(body, null, 2));

    // Obtener payment_id de cualquiera de los formatos posibles
    const paymentId = body.data?.id || 
                     (body.type === 'payment' ? body.resource : null);

    if (!paymentId) {
      console.log('⚠️ No payment ID encontrado');
      return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
    }

    // Obtener el ID de la compra desde external_reference
    const compraId = body.external_reference;
    if (!compraId) {
      console.log('⚠️ No compra ID encontrado');
      return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
    }

    // Obtener la compra y el vendedor
    const compra = await db.compra.findUnique({
      where: { id: parseInt(compraId) },
      include: {
        ticket: {
          include: {
            vendedor: true
          }
        }
      }
    });

    if (!compra) {
      console.log('⚠️ Compra no encontrada');
      return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
    }

    // Verificar el estado del pago
    const client = new MercadoPagoConfig({
      accessToken: compra.ticket.vendedor.mp_access_token!
    });

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === "approved") {
      // Actualizar la compra a WaitingForRelease
      await db.compra.update({
        where: { id: parseInt(compraId) },
        data: {
          estado: "WaitingForRelease",
          payment_id: paymentId.toString()
        }
      });

      // El ticket ya está en estado "reservado", no necesitamos actualizarlo
    } else if (paymentData.status === "rejected" || paymentData.status === "cancelled") {
      // Actualizar la compra a cancelado
      await db.compra.update({
        where: { id: parseInt(compraId) },
        data: {
          estado: "cancelado",
          payment_id: paymentId.toString()
        }
      });

      // Devolver el ticket a disponible
      await db.ticket.update({
        where: { id: compra.ticket_id },
        data: { estado: "disponible" }
      });
    }

    return new NextResponse(JSON.stringify({ message: "OK" }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('🔴 ERROR EN WEBHOOK:', error);
    // Siempre devolver 200 a MP incluso en caso de error
    return new NextResponse(JSON.stringify({ message: "OK" }), { status: 200 });
  }
}