'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MercadoPagoCheckout } from "@/components/ui/checkOutMp";

interface TipoEntrada {
    id: number;
    nombre: string;
    descripcion?: string | null;
    precio_base: number;
  }
  
  interface EntradasSelectorProps {
    tiposEntrada: TipoEntrada[];  // Lista de tipos de entrada disponibles
    eventoNombre: string;         // Nombre del evento
    vendedorId: number;           // ID del vendedor (referencia al clerkId de Usuario)
  }

const EntradasSelector: React.FC<EntradasSelectorProps> = ({
  tiposEntrada,
  eventoNombre,
  vendedorId
}) => {
  const [selectedTipoNombre, setSelectedTipoNombre] = useState<string | null>(null);
  const [filteredEntradas, setFilteredEntradas] = useState<TipoEntrada[]>([]);
  const [selectedTicket, setSelectedTicket] = useState({
    title: eventoNombre,
    variant: "",
    price: 0,
    vendedorId: vendedorId,
  });

  const handleTipoNombreChange = (value: string) => {
    setSelectedTipoNombre(value);
    const filtered = tiposEntrada.filter((t) => t.nombre === value);
    setFilteredEntradas(filtered);
  };

  const handleEntradaChange = (value: number) => {
    const entrada = tiposEntrada.find((t) => t.id === value);
    if (entrada) {
      setSelectedTicket({
        ...selectedTicket,
        variant: entrada.nombre,
        price: parseFloat(entrada.precio_base.toString()),
      });
    }
  };

  return (
    <>
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
              {Array.from(new Set(tiposEntrada.map((tipo) => tipo.nombre))).map((nombre) => (
                <SelectItem key={nombre} value={nombre}>
                  {nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTipoNombre && (
        <Card className="border-0 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-white">Selecciona una entrada</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {filteredEntradas.map((entrada) => (
                <li
                  key={entrada.id}
                  onClick={() => handleEntradaChange(entrada.id)}
                  className="p-3 bg-gray-900 rounded-md hover:bg-black cursor-pointer text-white flex justify-between items-center"
                >
                  <span>{entrada.nombre}</span>
                  <span>${parseFloat(entrada.precio_base.toString()).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {selectedTicket.variant && (
        <>
          <Card className="border-0 bg-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-white">Detalle de entrada seleccionada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/60 border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-white">{selectedTicket.variant}</h3>
                      <p className="text-sm text-gray-400">
                        {tiposEntrada.find((t) => t.nombre === selectedTicket.variant)?.descripcion || ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        ${selectedTicket.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-white">Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <MercadoPagoCheckout
                title={selectedTicket.title}
                price={selectedTicket.price}
                quantity={1}
                variant={selectedTicket.variant}
                vendedorId={selectedTicket.vendedorId}
              />
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default EntradasSelector;