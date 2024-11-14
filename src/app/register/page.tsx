'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface ClerkError {
  errors?: Array<{
    message: string
    code: string
    longMessage?: string
  }>
  message?: string
}

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rut, setRut] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('')
  const router = useRouter()

  const handleError = (err: ClerkError) => {
    console.error('Error detallado:', JSON.stringify(err, null, 2))
    if (err.errors && err.errors.length > 0) {
      setError(err.errors[0].longMessage || err.errors[0].message)
    } else {
      setError(err.message || 'Ha ocurrido un error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setVerificationStatus('Iniciando proceso de registro...')

    if (!isLoaded) {
      setError('El sistema no está listo. Por favor, espere.')
      setLoading(false)
      return
    }

    try {
      setVerificationStatus('Creando usuario...')
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      console.log('Resultado de creación:', result)

      setVerificationStatus('Preparando verificación de email...')
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setVerificationStatus('Código de verificación enviado. Por favor revisa tu email.')
      setPendingVerification(true)
    } catch (err) {
      console.error('Error en el registro:', err)
      handleError(err as ClerkError)
    } finally {
      setLoading(false)
    }
  }

  const onPressVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setVerificationStatus('Iniciando verificación...')

    if (!isLoaded) {
      setError('El sistema no está listo. Por favor, espere.')
      setLoading(false)
      return
    }

    try {
      setVerificationStatus('Verificando código...')
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

      console.log('Resultado de verificación completo:', completeSignUp)

      if (completeSignUp.status === 'complete') {
        setVerificationStatus('Verificación exitosa. Iniciando sesión...')
        await setActive({ session: completeSignUp.createdSessionId })

        const userData = {
          clerkId: completeSignUp.createdUserId,
          nombre: firstName,
          apellido: lastName,
          rut,
          correo: email,
        }

        console.log('Datos a enviar al backend:', userData)

        const saveUserResponse = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })

        const responseData = await saveUserResponse.json()
        console.log('Respuesta del backend:', responseData)

        if (!saveUserResponse.ok) {
          throw new Error(responseData.error || 'Error al guardar el usuario en la base de datos')
        }

        router.push('/')
      } else {
        setError(`La verificación no se pudo completar. Estado: ${completeSignUp.status}`)
      }
    } catch (err) {
      console.error('Error completo en la verificación:', err)
      handleError(err as ClerkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
          <CardDescription>Crea una nueva cuenta para acceder a nuestros servicios.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {verificationStatus && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Estado</AlertTitle>
              <AlertDescription>{verificationStatus}</AlertDescription>
            </Alert>
          )}

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rut">RUT</Label>
                <Input
                  id="rut"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="Ingrese su RUT"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 8 caracteres
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Procesando...' : 'Crear cuenta'}
              </Button>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Te hemos enviado un código de verificación a {email}.<br />
                Ingresa el código aquí para completar tu registro.
              </p>
              <div className="space-y-2">
                <Label htmlFor="verification_code">Código de Verificación</Label>
                <Input
                  id="verification_code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar cuenta'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta? <a href="/login" className="text-primary hover:underline">Inicia sesión</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}