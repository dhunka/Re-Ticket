// src/app/VentaEntrada/page.tsx
'use client'
import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

interface TipoEntrada {
  id: number;
  nombre: string;
  precio_base: number;
}

interface Evento {
  id: number;
  nombre: string;
  fecha_evento: Date;
  categoria: string;
  tipos_entrada: TipoEntrada[];
}

interface FormData {
  evento_id: number;
  tipo_entrada_id: number;
  precio: string;
}

export default function FormularioEntrada() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tiposEntradaSeleccionados, setTiposEntradaSeleccionados] = useState<TipoEntrada[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    evento_id: 0,
    tipo_entrada_id: 0,
    precio: "",
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    }
  };

  const handleEventoChange = (eventoId: string) => {
    const eventoSeleccionado = eventos.find(evento => evento.id === parseInt(eventoId));
    handleSelectChange("evento_id", parseInt(eventoId));

    if (eventoSeleccionado) {
      setTiposEntradaSeleccionados(eventoSeleccionado.tipos_entrada);
      setFormData(prev => ({
        ...prev,
        tipo_entrada_id: 0,
        precio: ""
      }));
    }
  };

  const handleTipoEntradaChange = (value: string) => {
    handleSelectChange("tipo_entrada_id", parseInt(value));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear un ticket",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/CrearEntrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vendedor_id: user.id,
          estado: "disponible",
        }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Entrada creada correctamente",
        });
        router.push("/historialVenta");
      } else {
        throw new Error("Error al crear la entrada");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast({
        title: "Error",
        description: "Error al crear la entrada",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-2 border-orange-500 pb-2">
        Poner Entrada a la Venta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="evento" className="text-gray-700">Evento</Label>
            <Select onValueChange={handleEventoChange} disabled={isLoading}>
              <SelectTrigger className="bg-white border-gray-300 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Selecciona un evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map((evento) => (
                  <SelectItem key={evento.id} value={evento.id.toString()}>
                    {evento.nombre} - {new Date(evento.fecha_evento).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipoEntrada" className="text-gray-700">Tipo de Entrada</Label>
            <Select 
              onValueChange={handleTipoEntradaChange}
              disabled={isLoading || formData.evento_id === 0}
            >
              <SelectTrigger className="bg-white border-gray-300 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Selecciona el tipo de entrada" />
              </SelectTrigger>
              <SelectContent>
                {tiposEntradaSeleccionados.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id.toString()}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="precio" className="text-gray-700">Tu Precio de Venta</Label>
          <Input 
            type="number" 
            name="precio" 
            value={formData.precio}
            onChange={handleChange} 
            required
            disabled={isLoading}
            min="0"
            step="0.01"
            className="bg-white border-gray-300 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <Button 
          type="submit"
          disabled={isLoading || !formData.evento_id || !formData.tipo_entrada_id || !formData.precio}
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          {isLoading ? "Creando..." : "Poner a la Venta"}
        </Button>
      </form>
    </div>
  );
}