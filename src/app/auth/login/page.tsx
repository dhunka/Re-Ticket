'use client'

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import loginImage from '../../../../public/images/front.png'
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Globe, Search, ShoppingCart, User } from "lucide-react"

export default function LoginPageWithHeader() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn('credentials', {
      correo: data.correo,
      password: data.password,
      redirect: false,
    })

    if (res && res.error) {
        setError(res.error)  // Aseguramos que setError siempre reciba un string
      } else if (res && !res.error) {
        setError(null)  // No hay error, limpiamos cualquier mensaje de error previo
        router.push('/home')
        router.refresh()
      }
    })

  return (
    <div className="min-h-screen flex flex-col bg-orange-500">
      <header className="bg-white shadow-sm">
        {/* Header content */}
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

      <main className="flex-grow flex items-center justify-center">
        <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-1/2 hidden md:block">
            <Image
              src={loginImage}
              alt="Imagen de login"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
          <Card className="w-full md:w-1/2 border-none shadow-none">
            <form onSubmit={onSubmit}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
                {error && (
                  <p className="bg-red-700 text-lg text-white p-3 rounded text-center mt-2">
                    {error}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    {...register("correo", {
                      required: "El correo es obligatorio"
                    })}
                  />
                  {errors.correo && (
                    <span className="text-red-500 text-xs">{errors.correo.message}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "La contraseña es obligatoria"
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">{errors.password.message}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" type="submit">
                  Ingresar
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
