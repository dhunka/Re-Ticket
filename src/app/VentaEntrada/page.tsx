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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/router";

// Tipos para los datos de la base de datos
interface Evento {
  id: number;
  nombre: string;
  fecha_evento: Date;
  categoria: string;
}

interface TipoEntrada {
  id: number;
  nombre: string;
  precio_base: number;
}

interface FormData {
  evento_id: number;
  tipo_entrada_id: number;
  precio: string;
  numeroAsiento: string;
  esPortador: boolean;
  archivo_url?: string;
}

export default function FormularioEntrada() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);
  const [formData, setFormData] = useState<FormData>({
    evento_id: 0,
    tipo_entrada_id: 0,
    precio: "",
    numeroAsiento: "",
    esPortador: false,
    archivo_url: "",
  });

  // Cargar eventos y tipos de entrada al montar el componente
  useEffect(() => {
    fetchEventos();
    fetchTiposEntrada();
  }, []);

  // Obtener eventos de la base de datos
  const fetchEventos = async () => {
    try {
      const response = await fetch("/api/eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  // Obtener tipos de entrada de la base de datos
  const fetchTiposEntrada = async () => {
    try {
      const response = await fetch("/api/tipos-entrada");
      const data = await response.json();
      setTiposEntrada(data);
    } catch (error) {
      console.error("Error al cargar tipos de entrada:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      esPortador: checked,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Subir archivo a tu servicio de almacenamiento (ejemplo con API local)
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          archivo_url: data.url,
        }));
      } catch (error) {
        console.error("Error al subir archivo:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/CrearEntrada", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          estado: "disponible",
          fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
        }),
      });

      if (response.ok) {
        router.push("/tickets"); // Redirigir a la lista de tickets
      } else {
        throw new Error("Error al crear el ticket");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="evento">Evento</Label>
        <Select
          onValueChange={(value) =>
            handleSelectChange("evento_id", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un evento" />
          </SelectTrigger>
          <SelectContent>
            {eventos.map((evento) => (
              <SelectItem key={evento.id} value={evento.id.toString()}>
                {evento.nombre} -{" "}
                {new Date(evento.fecha_evento).toLocaleDateString()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tipoEntrada">Tipo de Entrada</Label>
        <Select
          onValueChange={(value) =>
            handleSelectChange("tipo_entrada_id", parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de entrada" />
          </SelectTrigger>
          <SelectContent>
            {tiposEntrada.map((tipo) => (
              <SelectItem key={tipo.id} value={tipo.id.toString()}>
                {tipo.nombre} - ${tipo.precio_base}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="numeroAsiento">Número de Asiento (si aplica)</Label>
        <Input type="text" name="numeroAsiento" onChange={handleChange} />
      </div>

      <div>
        <Label htmlFor="precio">Precio de Venta</Label>
        <Input type="number" name="precio" onChange={handleChange} required />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="esPortador"
          checked={formData.esPortador}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="esPortador">Entrada al portador</Label>
      </div>

      {formData.esPortador && (
        <div>
          <Label htmlFor="pdfTicket">Subir PDF del Ticket</Label>
          <Input
            type="file"
            name="pdfTicket"
            onChange={handleFileChange}
            accept=".pdf"
            required
          />
        </div>
      )}

      <Button type="submit">Crear Ticket</Button>
    </form>
  );
}
