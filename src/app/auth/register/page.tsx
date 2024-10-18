'use client'

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import loginImage from '../../../../public/images/front.png'
import {
  NavigationMenu,
} from "@/components/ui/navigation-menu"
import { Globe, Search, ShoppingCart, User } from "lucide-react"

export default function RegisterPageWithHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Las contraseñas no coinciden")
    }
    
    const res = await fetch('/api/auth/register', {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password: data.password,
        rut: data.rut,
        fecha_de_nacimiento: data.fecha_de_nacimiento,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (res.ok) {
      router.push('/auth/login')
    }
  })
  
  type FormInputs = {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    confirmPassword: string;
    rut: string;
    fecha_de_nacimiento: string;
    message?: string;
  }
  

  return (
    <div className="min-h-screen flex flex-col bg-orange-500">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">ReTicket</span>
            </div>

            <nav className="hidden lg:flex">
              <NavigationMenu>
                {/* Navigation menu content */}
              </NavigationMenu>
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <form className="relative">
                <Input type="search" placeholder="Buscar..." className="pl-8" />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button>Unirse</Button>
            </div>

            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden">
            {/* Mobile menu content */}
          </div>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-1/2 hidden md:block relative">
            <div className="absolute inset-0">
              <Image 
                src={loginImage} 
                alt="Imagen de registro" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <Card className="w-full md:w-1/2 border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input 
                      id="nombre"
                      {...register("nombre", {
                        required: {
                          value: true,
                          message: "El nombre es obligatorio"
                        }
                      })}
                    />
                    {errors.nombre && (
                      <span className="text-red-500 text-xs">
                        {errors.nombre.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input 
                      id="apellido"
                      {...register("apellido", {
                        required: {
                          value: true,
                          message: "El apellido es obligatorio"
                        }
                      })}
                    />
                    {errors.apellido && (
                      <span className="text-red-500 text-xs">
                        {errors.apellido.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input 
                    id="rut"
                    placeholder="12.345.678-9"
                    {...register("rut", {
                      required: {
                        value: true,
                        message: "El RUT es obligatorio"
                      }
                    })}
                  />
                  {errors.rut && (
                    <span className="text-red-500 text-xs">
                      {errors.rut.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correo">Correo electrónico</Label>
                  <Input 
                    id="correo"
                    type="email"
                    {...register("correo", {
                      required: {
                        value: true,
                        message: "El correo es obligatorio"
                      }
                    })}
                  />
                  {errors.correo && (
                    <span className="text-red-500 text-xs">
                      {errors.correo.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_de_nacimiento">Fecha de nacimiento</Label>
                  <Input 
                    id="fecha_de_nacimiento"
                    type="date"
                    {...register("fecha_de_nacimiento", {
                      required: {
                        value: true,
                        message: "La fecha de nacimiento es obligatoria"
                      }
                    })}
                  />
                  {errors.fecha_de_nacimiento && (
                    <span className="text-red-500 text-xs">
                      {errors.fecha_de_nacimiento.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password"
                    type="password"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "La contraseña es obligatoria"
                      }
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                      required: {
                        value: true,
                        message: "Debe confirmar la contraseña"
                      }
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Registrarse
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}