import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormData {
  nombreTitular: string;
  numeroCuenta: string;
  tipoCuenta: string;
  banco: string;
}

interface FormularioDatosBancariosProps {
  onSubmit: (data: FormData) => void;
}

export default function FormularioDatosBancarios({ onSubmit }: FormularioDatosBancariosProps) {
  const [formData, setFormData] = useState<FormData>({
    nombreTitular: '',
    numeroCuenta: '',
    tipoCuenta: '',
    banco: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombreTitular">Nombre del Titular</Label>
        <Input type="text" name="nombreTitular" onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
        <Input type="text" name="numeroCuenta" onChange={handleChange} required />
      </div>

      <div>
        <Label htmlFor="tipoCuenta">Tipo de Cuenta</Label>
        <Select onValueChange={(value) => handleSelectChange('tipoCuenta', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de cuenta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corriente">Corriente</SelectItem>
            <SelectItem value="ahorro">Ahorro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="banco">Banco</Label>
        <Input type="text" name="banco" onChange={handleChange} required />
      </div>

      <Button type="submit">Finalizar Venta</Button>
    </form>
  )
}