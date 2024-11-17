"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { MercadoPagoCheckout } from "./checkOutMp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EntradasSelectorProps {
  tiposEntrada: { id: number; nombre: string; precio: number }[];
}

const EntradasSelector: React.FC<EntradasSelectorProps> = ({ tiposEntrada }) => {
  const [selectedTicket, setSelectedTicket] = React.useState<{ variant: string; price: number } | null>(null);
  const [selectedTipoNombre, setSelectedTipoNombre] = React.useState<string | null>(null);

  // Obtiene los nombres únicos de los tipos de entrada
  const tiposNombresOptions = React.useMemo(() => {
    return Array.from(new Set(tiposEntrada.map((entrada) => entrada.nombre)));

  }, [tiposEntrada]);

  const handleTipoNombreChange = (tipoNombre: string) => {
    setSelectedTipoNombre(tipoNombre);
    setSelectedTicket(null); // Resetea la selección del ticket
  };

  const handleEntradaChange = (id: number) => {
    const entrada = tiposEntrada.find((t) => t.id === id);
    if (entrada) {
      setSelectedTicket({ variant: entrada.nombre, price: entrada.precio });
    }
  };

  // Filtra las entradas según el tipo de nombre seleccionado
  const filteredEntradas = selectedTipoNombre
    ? tiposEntrada.filter((entrada) => entrada.nombre === selectedTipoNombre)
    : tiposEntrada;

  return (
    <div className="space-y-6">
      {/* Select para seleccionar el nombre del tipo de entrada */}
      <Card className="border-0 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-white">Selecciona tipo de entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleTipoNombreChange}>
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Selecciona un tipo de entrada" />
            </SelectTrigger>
            <SelectContent>
              {tiposNombresOptions.map((nombre) => (
                <SelectItem key={nombre} value={nombre}>
                  {nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lista de entradas disponibles según el tipo seleccionado */}
      <ul className="space-y-2">
        {filteredEntradas.map((entrada) => (
          <li
            key={entrada.id}
            onClick={() => handleEntradaChange(entrada.id)}
            className="p-3 bg-gray-900 rounded-md hover:bg-black cursor-pointer text-white flex justify-between items-center"
          >
            <span>{entrada.nombre}</span>
            <span>${entrada.precio.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      {/* Card de checkout */}
      <Card className="border-0 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-white">Resumen de compra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Entrada seleccionada:</span>
              <Badge variant="secondary">{selectedTicket?.variant}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Precio:</span>
              <span className="text-2xl font-bold text-white">
                ${selectedTicket?.price.toLocaleString()}
              </span>
            </div>
            {selectedTicket && (
              <MercadoPagoCheckout
                title={selectedTicket.variant}
                price={selectedTicket.price}
                quantity={1}
                variant={selectedTicket.variant}
                vendedorId={1} // Asegúrate de ajustar el `vendedorId` según corresponda
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información importante */}
      <Card className="border-0">
        <CardContent className="bg-gray-900 flex space-x-4">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          <p className="text-sm text-orange-500">
            Las ventas de entradas no son reembolsables y están sujetas a los términos y condiciones.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntradasSelector;
