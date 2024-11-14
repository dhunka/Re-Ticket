<<<<<<< Updated upstream
// src/components/MercadoPagoCheckout.tsx
=======
>>>>>>> Stashed changes
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutProps {
  title: string;
  price: number;
  quantity: number;
  variant?: string;
  vendedorId: number;
}

export function MercadoPagoCheckout({ title, price, quantity, variant, vendedorId }: CheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${title} - ${variant}`,
          price,
          quantity,
          vendedorId
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
      className="w-full bg-yellow-400 hover:bg-[#c5a436] text-black"
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