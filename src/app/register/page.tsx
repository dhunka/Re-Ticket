'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  Mail, 
  KeyRound, 
  User, 
  Users, 
  ShieldCheck 
} from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
                Crear Cuenta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Únete a nuestra plataforma para acceder a todos los servicios
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {verificationStatus && (
              <Alert className="border-primary/20 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertTitle>Estado</AlertTitle>
                <AlertDescription>{verificationStatus}</AlertDescription>
              </Alert>
            )}

            {!pendingVerification ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-gray-500" />
                      Nombre
                    </Label>
                    <Input
                      id="first_name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={loading}
                      className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                      placeholder="Juan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4 text-gray-500" />
                      Apellido
                    </Label>
                    <Input
                      id="last_name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={loading}
                      className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rut" className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-gray-500" />
                    RUT
                  </Label>
                  <Input
                    id="rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="12.345.678-9"
                    required
                    disabled={loading}
                    className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    disabled={loading}
                    className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <KeyRound className="h-4 w-4 text-gray-500" />
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                    className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium transition-all hover:opacity-90 bg-gradient-to-r from-primary to-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Procesando...
                    </div>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={onPressVerify} className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="h-8 w-8 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Verifica tu correo</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Te hemos enviado un código de verificación a{' '}
                      <span className="font-medium text-primary">{email}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification_code" className="text-sm font-medium">
                    Código de Verificación
                  </Label>
                  <Input
                    id="verification_code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="text-center text-2xl tracking-[1em] font-mono border-gray-200 focus:ring-2 focus:ring-primary/20"
                    maxLength={6}
                    placeholder="······"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium transition-all hover:opacity-90 bg-gradient-to-r from-primary to-orange-400"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Verificando...
                    </div>
                  ) : (
                    'Verificar cuenta'
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center py-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a
                href="/login"
                className="font-medium text-primary hover:text-orange-400 transition-colors"
              >
                Inicia sesión
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}