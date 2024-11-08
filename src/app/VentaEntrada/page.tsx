'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import FormularioEntrada from '@/components/ui/formulario-entrada';
import FormularioDatosBancarios from '@/components/ui/formulario-datos-bancarios';



interface DatosEntrada {
  evento: string;
  fecha: string;
  tipoEntrada: string;
  numeroAsiento: string;
  precio: string;
  esPortador: boolean;
  pdfTicket: File | null;
}

interface DatosBancarios {
  nombreTitular: string;
  numeroCuenta: string;
  tipoCuenta: string;
  banco: string;
}

export default function VentaEntradas() {
  const [paso, setPaso] = useState<number>(1)
  const [datosEntrada, setDatosEntrada] = useState<DatosEntrada | null>(null)

  const avanzarPaso = (datos: DatosEntrada) => {
    setDatosEntrada(datos)
    setPaso(2)
  }

  const finalizarVenta = (datosBancarios: DatosBancarios) => {
    // Aquí iría la lógica para procesar la venta con los datos de la entrada y los datos bancarios
    console.log('Datos de la entrada:', datosEntrada)
    console.log('Datos bancarios:', datosBancarios)
    alert('¡Venta registrada con éxito!')
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Venta de Entradas</CardTitle>
      </CardHeader>
      <CardContent>
        {paso === 1 ? (
          <FormularioEntrada onSubmit={avanzarPaso} />
        ) : (
          <FormularioDatosBancarios onSubmit={finalizarVenta} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {paso === 2 && (
          <Button variant="outline" onClick={() => setPaso(1)}>
            Volver
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}