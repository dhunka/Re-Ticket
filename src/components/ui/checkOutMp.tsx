'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
interface CheckoutProps {
  title: string;
  price: number;
  quantity: number;
  variant?: string;
  vendedorId: string;
}

export function MercadoPagoCheckout({ title, price, quantity, variant, vendedorId}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleCheckout = async () => {
    if (!user) {
      return console.error('Usuario no autenticado porfavor inicie sesión');
    }
    try {
      setLoading(true);
      console.log(vendedorId)
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${title} - ${variant}`,
          price,
          quantity,
          vendedorId,
          compradorId:user.id,
        }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('No se pudo obtener el link de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un toast o alert de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-gray-400 hover:bg-orange-600 text-black"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        'Comprar'
      )}
    </Button>
  );
}