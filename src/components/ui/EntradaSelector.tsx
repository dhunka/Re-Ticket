'use client';

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Star } from "lucide-react";
import { MercadoPagoCheckout } from "./checkOutMp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoEntrada, Ticket, Usuario, Valoracion } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface EntradasSelectorProps {
  tiposEntrada: TipoEntrada[];
  tickets: (Ticket & { 
    vendedor: (Usuario & { 
      valoraciones?: Valoracion[] 
    }) 
  })[];
}

const EntradasSelector: React.FC<EntradasSelectorProps> = ({ tiposEntrada, tickets }) => {
  const router = useRouter();
  const { user } = useUser();
  const [selectedTicket, setSelectedTicket] = React.useState<(Ticket & { 
    vendedor: (Usuario & { 
      valoraciones?: Valoracion[] 
    }) 
  }) | null>(null);
  const [selectedTipoEntradaId, setSelectedTipoEntradaId] = React.useState<number | null>(null);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);

  // Obtiene los nombres únicos de los tipos de entrada
  const tiposNombresOptions = React.useMemo(() => {
    return tiposEntrada.map((entrada) => ({
      id: entrada.id,
      nombre: entrada.nombre,
    }));
  }, [tiposEntrada]);

  const calculateSellerRating = (valoraciones?: Valoracion[]) => {
    if (!valoraciones || valoraciones.length === 0) return 0;
    const avgRating = valoraciones.reduce((sum, val) => sum + val.puntuacion, 0) / valoraciones.length;
    return Number(avgRating.toFixed(1));
  };

  const handleTipoEntradaChange = (tipoEntradaId: number) => {
    setSelectedTipoEntradaId(tipoEntradaId);
    setSelectedTicket(null);
  };

  const handleEntradaChange = (ticket: (Ticket & { 
    vendedor: (Usuario & { 
      valoraciones?: Valoracion[] 
    }) 
  })) => {
    setSelectedTicket(ticket);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthDialog(true);
    }
  };

  const handleLogin = () => {
    router.push('/sign-in'); // Ruta de Clerk para sign-in
  };

  const handleRegister = () => {
    router.push('/register'); // Ruta de Clerk para sign-up
  };

  // Filtra los tickets según el tipo de entrada seleccionado
  const filteredTickets = selectedTipoEntradaId
    ? tickets.filter((ticket) => ticket.tipo_entrada_id === selectedTipoEntradaId)
    : tickets;

  return (
    <div className="space-y-6">
      {/* Select para seleccionar el tipo de entrada */}
      <Card className="border-0 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl text-white">Selecciona tipo de entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => handleTipoEntradaChange(Number(value))}>
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Selecciona un tipo de entrada" />
            </SelectTrigger>
            <SelectContent>
              {tiposNombresOptions.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id.toString()}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lista de tickets disponibles según el tipo seleccionado */}
     
      <CardTitle className="text-xl text-white">Entradas Disponibles</CardTitle>
        
      <ul className="space-y-2">
        {filteredTickets.map((ticket) => {
          const tipoEntrada = tiposEntrada.find((tipo) => tipo.id === ticket.tipo_entrada_id);
          const sellerRating = calculateSellerRating(ticket.vendedor?.valoraciones);
          return (
            <li
              key={ticket.id}
              onClick={() => handleEntradaChange(ticket)}
              className="p-3 bg-gray-900 rounded-md hover:bg-black cursor-pointer text-white flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span>{tipoEntrada ? tipoEntrada.nombre : "Tipo de entrada no encontrado"}</span>
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{sellerRating} ({ticket.vendedor?.valoraciones?.length || 0} valoraciones)</span>
                  <span>{ticket.vendedor.nombre}</span> {/* Nombre del vendedor */}
                </div>
              </div>
              <span>${ticket.precio.toLocaleString()}</span>
            </li>
          );
        })}
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
              <Badge variant="secondary">
                {selectedTicket && tiposEntrada.find(tipo => tipo.id === selectedTicket.tipo_entrada_id)?.nombre || "No seleccionada"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-200">Precio:</span>
              <span className="text-2xl font-bold text-white">
                ${selectedTicket?.precio.toLocaleString()}
              </span>
            </div>
            {selectedTicket && (
              <div onClick={handleCheckoutClick}>
                {user ? (
                  <MercadoPagoCheckout
                    title={tiposEntrada.find(tipo => tipo.id === selectedTicket.tipo_entrada_id)?.nombre || "Entrada"}
                    price={Number(selectedTicket.precio)}
                    quantity={1}
                    variant={tiposEntrada.find(tipo => tipo.id === selectedTicket.tipo_entrada_id)?.nombre || "Entrada"}
                    vendedorId={selectedTicket.vendedor_id}
                  />
                ) : (
                  <Button className="w-full" variant="default">
                    Comprar Entrada
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de autenticación */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Iniciar sesión requerido</DialogTitle>
            <DialogDescription>
              Para comprar entradas, necesitas iniciar sesión o registrarte en nuestra plataforma.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button onClick={handleLogin} variant="default">
              Iniciar Sesión
            </Button>
            <Button onClick={handleRegister} variant="outline">
              Registrarse
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Información importante */}
      <Card className="border-0">
        <CardContent className="bg-gray-900 p-4 rounded-md flex items-center space-x-3">
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
