// app/api/mercadopago/webhook/route.ts
import db from '@/libs/db';
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'payment') {
      const client = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      });

      const payment = await new Payment(client).get({ id: body.data.id });

      // Verificar la estructura de la respuesta
      console.log(payment);

      const paymentData = payment;

      if (paymentData.status === 'approved') {
        // Actualizar el estado de la compra en la base de datos
        const ticketId = paymentData.metadata.ticketId;

        await db.compra.update({
          where: { id: ticketId },
          data: {
            estado: 'approved',
            mp_payment_id: paymentData.id?.toString(),
            mp_payment_status: paymentData.status,
            mp_merchant_order_id: paymentData.merchant_number,
            mp_preference_id: paymentData.payment_method_id,
            mp_external_reference: paymentData.external_reference,
            fondos_liberados: true,
            fecha_fondos_liberados: new Date(),
          },
        });

        return NextResponse.json({ success: true });
      } else if (paymentData.status === 'pending') {
        // Actualizar el estado de la compra a 'pending'
        const ticketId = paymentData.metadata.ticketId;

        await db.compra.update({
          where: { id: ticketId },
          data: {
            estado: 'pending',
            mp_payment_id: paymentData.id?.toString(),
            mp_payment_status: paymentData.status,
            mp_merchant_order_id: paymentData.merchant_number,
            mp_preference_id: paymentData.payment_method_id,
            mp_external_reference: paymentData.external_reference,
          },
        });

        return NextResponse.json({ success: true });
      } else if (paymentData.status === 'rejected') {
        // Actualizar el estado de la compra a 'rejected'
        const ticketId = paymentData.metadata.ticketId;

        await db.compra.update({
          where: { id: ticketId },
          data: {
            estado: 'rejected',
            mp_payment_id: paymentData.id?.toString(),
            mp_payment_status: paymentData.status,
            mp_merchant_order_id: paymentData.merchant_number,
            mp_preference_id: paymentData.payment_method_id,
            mp_external_reference: paymentData.external_reference,
          },
        });

        return NextResponse.json({ success: true });
      } else if (paymentData.status === 'cancelled') {
        // Actualizar el estado de la compra a 'cancelled'
        const ticketId = paymentData.metadata.ticketId;

        await db.compra.update({
          where: { id: ticketId },
          data: {
            estado: 'cancelled',
            mp_payment_id: paymentData.id?.toString(),
            mp_payment_status: paymentData.status,
            mp_merchant_order_id: paymentData.merchant_number,
            mp_preference_id: paymentData.payment_method_id,
            mp_external_reference: paymentData.external_reference,
          },
        });

        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}