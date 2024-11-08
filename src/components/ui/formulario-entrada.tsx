import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface FormData {
  evento: string;
  fecha: string;
  tipoEntrada: string;
  numeroAsiento: string;
  precio: string;
  esPortador: boolean;
  pdfTicket: File | null;
}

interface FormularioEntradaProps {
  onSubmit: (data: FormData) => void;
}

export default function FormularioEntrada({ onSubmit }: FormularioEntradaProps) {
  const [formData, setFormData] = useState<FormData>({
    evento: '',
    fecha: '',
    tipoEntrada: '',
    numeroAsiento: '',
    precio: '',
    esPortador: false,
    pdfTicket: null
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFormData(prevData => ({
      ...prevData,
      pdfTicket: file
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="evento">Evento</Label>
        <Select onValueChange={(value) => handleSelectChange('evento', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concierto">Concierto</SelectItem>
            <SelectItem value="teatro">Teatro</SelectItem>
            <SelectItem value="deportivo">Evento Deportivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="fecha">Fecha del Evento</Label>
        <Input type="date" name="fecha" onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="tipoEntrada">Tipo de Entrada</Label>
        <Select onValueChange={(value) => handleSelectChange('tipoEntrada', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de entrada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="palco">Palco</SelectItem>
            <SelectItem value="general">General</SelectItem>
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
          onCheckedChange={(checked: boolean) => handleSelectChange('esPortador', checked.toString())}
        />
        <Label htmlFor="esPortador">Entrada al portador</Label>
      </div>

      {formData.esPortador && (
        <div>
          <Label htmlFor="pdfTicket">Subir PDF del Ticket</Label>
          <Input type="file" name="pdfTicket" onChange={handleFileChange} accept=".pdf" required />
        </div>
      )}

      <Button type="submit">Siguiente</Button>
    </form>
  )
}