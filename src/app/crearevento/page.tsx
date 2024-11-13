'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TipoEntrada {
  nombre: string;
  descripcion?: string;
  precio_base: number;
}

export default function CrearEvento() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [urlFoto, setUrlFoto] = useState('');
  const [tiposEntrada, setTiposEntrada] = useState<TipoEntrada[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado para nuevo tipo de entrada
  const [nuevoTipoEntrada, setNuevoTipoEntrada] = useState<TipoEntrada>({
    nombre: '',
    descripcion: '',
    precio_base: 0
  });

  const agregarTipoEntrada = () => {
    if (nuevoTipoEntrada.nombre && nuevoTipoEntrada.precio_base > 0) {
      setTiposEntrada([...tiposEntrada, nuevoTipoEntrada]);
      setNuevoTipoEntrada({
        nombre: '',
        descripcion: '',
        precio_base: 0
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tiposEntrada.length === 0) {
      setErrorMessage('Debe agregar al menos un tipo de entrada');
      return;
    }

    const eventoData = {
      nombre,
      ubicacion,
      fecha_evento: new Date(fechaEvento).toISOString(),
      url_foto: urlFoto,
      descripcion,
      categoria,
      tipos_entrada: tiposEntrada
    };

    try {
      const res = await fetch('/api/evento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventoData),
      });

      if (res.ok) {
        alert('Evento creado con éxito');
        // Limpiar el formulario
        setNombre('');
        setUbicacion('');
        setFechaEvento('');
        setDescripcion('');
        setCategoria('');
        setUrlFoto('');
        setTiposEntrada([]);
        setErrorMessage('');
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Hubo un error al crear el evento');
      }
    } catch (error) {
      setErrorMessage('Error de conexión');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Crear Evento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del evento</Label>
            <Input 
              id="nombre" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ingrese el nombre del evento" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input 
              id="ubicacion" 
              value={ubicacion} 
              onChange={(e) => setUbicacion(e.target.value)} 
              placeholder="Ingrese la ubicación del evento" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fechaEvento">Fecha del evento</Label>
            <Input 
              id="fechaEvento" 
              type="datetime-local" 
              value={fechaEvento} 
              onChange={(e) => setFechaEvento(e.target.value)} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urlFoto">URL de la foto</Label>
            <Input 
              id="urlFoto" 
              value={urlFoto} 
              onChange={(e) => setUrlFoto(e.target.value)} 
              placeholder="Ingrese la URL de la foto del evento" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Ingrese la descripción del evento" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concierto">Concierto</SelectItem>
                <SelectItem value="teatro">Teatro</SelectItem>
                <SelectItem value="deportes">Deportes</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="conferencia">Conferencia</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sección de Tipos de Entrada */}
          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-semibold">Agregar Tipo de Entrada</h3>
            <div className="space-y-2">
              <Label htmlFor="tipoEntradaNombre">Nombre del tipo de entrada</Label>
              <Input 
                id="tipoEntradaNombre" 
                value={nuevoTipoEntrada.nombre} 
                onChange={(e) => setNuevoTipoEntrada({...nuevoTipoEntrada, nombre: e.target.value})} 
                placeholder="Ej: VIP, General, Palco" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoEntradaDescripcion">Descripción</Label>
              <Textarea 
                id="tipoEntradaDescripcion" 
                value={nuevoTipoEntrada.descripcion} 
                onChange={(e) => setNuevoTipoEntrada({...nuevoTipoEntrada, descripcion: e.target.value})} 
                placeholder="Descripción del tipo de entrada" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoEntradaPrecio">Precio base</Label>
              <Input 
                id="tipoEntradaPrecio" 
                type="number" 
                value={nuevoTipoEntrada.precio_base} 
                onChange={(e) => setNuevoTipoEntrada({...nuevoTipoEntrada, precio_base: parseFloat(e.target.value)})} 
                placeholder="0.00" 
                min="0" 
                step="0.01" 
              />
            </div>
            <Button type="button" onClick={agregarTipoEntrada}>Agregar Tipo de Entrada</Button>
          </div>

          {/* Lista de tipos de entrada agregados */}
          {tiposEntrada.length > 0 && (
            <div className="border p-4 rounded-md">
              <h3 className="font-semibold mb-2">Tipos de Entrada Agregados</h3>
              <ul className="space-y-2">
                {tiposEntrada.map((tipo, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>{tipo.nombre} - ${tipo.precio_base}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newTipos = tiposEntrada.filter((_, i) => i !== index);
                        setTiposEntrada(newTipos);
                      }}
                    >
                      Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <Button type="submit" className="w-full">Crear Evento</Button>
        </form>
      </CardContent>
    </Card>
  );
}