'use client'
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EstadioImage from '../../../public/images/estadio.png';
import HomeImage from '../../../public/images/profile.jpg';
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Mail, AlertCircle, Calendar, MapPin, Clock } from "lucide-react";
import { MercadoPagoCheckout } from "@/components/ui/checkOutMp";

interface TipoEntrada {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  evento_id: number;
}

interface SelectedTicket {
  title: string;
  variant: string;
  price: number;
  vendedorId: number;
}

export default function EntradaPage() {
  const [tiposEntrada, setTiposEntrada] = React.useState<TipoEntrada[]>([]);
  const [selectedTipoNombre, setSelectedTipoNombre] = React.useState<string | null>(null);
  const [filteredEntradas, setFilteredEntradas] = React.useState<TipoEntrada[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<SelectedTicket>({
    title: "Duki - A.D.A Tour 2024",
    variant: "",
    price: 0,
    vendedorId: 2
  });

  React.useEffect(() => {
    fetchTiposEntrada();
  }, []);

  const fetchTiposEntrada = async () => {
    try {
      const response = await fetch('/api/tipoentrada?eventoId=6');
      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        setTiposEntrada(data);
      } else {
        console.log('No se encontraron tipos de entrada');
      }
    } catch (error) {
      console.error('Error fetching tipos de entrada:', error);
    }
  };

  const handleTipoNombreChange = (value: string) => {
    setSelectedTipoNombre(value);
    const filtered = tiposEntrada.filter(t => t.nombre === value);
    setFilteredEntradas(filtered);
  };

  const handleEntradaChange = (value: number) => {
    const entrada = tiposEntrada.find(t => t.id === value);
    if (entrada) {
      setSelectedTicket({
        ...selectedTicket,
        variant: entrada.nombre,
        price: parseFloat(entrada.precio_base.toString()),
      });
    }
  };

  const tiposNombresOptions = Array.from(new Set(tiposEntrada.map(tipo => tipo.nombre))).map(nombre => (
    <SelectItem key={nombre} value={nombre}>{nombre}</SelectItem>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Código original de la columna izquierda */}
            {/* Manteniendo tus imágenes y detalles */}
            <Card className="border-0 bg-black/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white">
                  Duki - A.D.A Tour 2024
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Un show único e inolvidable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src={HomeImage} 
                    alt="Duki - A.D.A Tour 2024" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-200">
                    <Calendar className="h-5 w-5" />
                    <span>15 Nov 2024</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-200">
                    <Clock className="h-5 w-5" />
                    <span>21:00 hrs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-200">
                    <MapPin className="h-5 w-5" />
                    <span>Chile</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-200">
                    <Mail className="h-5 w-5" />
                    <span>E-ticket</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-black/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">Mapa del Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image 
                    src={EstadioImage} 
                    alt="Mapa del Estadio" 
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Primer Select para seleccionar el nombre del tipo de entrada */}
            <Card className="border-0 bg-black/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">Selecciona tipo de entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handleTipoNombreChange}>
                  <SelectTrigger className="w-full text-white">
                    <SelectValue placeholder="Selecciona un tipo de entrada" />
                  </SelectTrigger>
                  <SelectContent>{tiposNombresOptions}</SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Segundo Select para seleccionar una entrada específica del tipo seleccionado */}
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

            {/* Información de la entrada seleccionada */}
            {selectedTicket.variant && (
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
                            {tiposEntrada.find(t => t.nombre === selectedTicket.variant)?.descripcion || ""}
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
            )}

            {/* Card de checkout */}
            <Card className="border-0 bg-black/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl text-white">Resumen de compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Entrada seleccionada:</span>
                    <Badge variant="secondary">{selectedTicket.variant}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Precio:</span>
                    <span className="text-2xl font-bold text-white">
                      ${selectedTicket.price.toLocaleString()}
                    </span>
                  </div>
                  {selectedTicket.variant && (
                    <MercadoPagoCheckout
                      title={selectedTicket.title}
                      price={selectedTicket.price}
                      quantity={1}
                      variant={selectedTicket.variant}
                      vendedorId={selectedTicket.vendedorId}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información importante */}
            <Card className="border-0 ">
              <CardContent className="flex space-x-4">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <p className="text-sm text-orange-500">
                  Las ventas de entradas no son reembolsables y están sujetas a los términos y condiciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
