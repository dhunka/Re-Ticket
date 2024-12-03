//scr/app/login/[[....sign-in]]
'use client'

import { useState, useEffect } from 'react'
import { useSignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  AlertCircle,
  LogIn,
  Mail,
  KeyRound,
  Loader2
} from 'lucide-react'

const LoginPage = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn() ?? {}
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Debugging log
  useEffect(() => {
    console.log('Authentication State:', {
      isLoaded,
      isSignedIn,
      isSignInLoaded
    });
  }, [isLoaded, isSignedIn, isSignInLoaded]);

  // Solo redirigir al home si ya está autenticado
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/'); // Redirigir al home sin recargar
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!signIn) {
      setError('Error al intentar iniciar sesión. Intenta nuevamente.')
      setLoading(false)
      return
    }

    try {
      const signInResult = await signIn.create({
        identifier: email,
        password,
      })

      console.log('Sign In Result:', signInResult);

      if (signInResult.status === 'complete') {
        // Solo redirigir y recargar después del inicio de sesión exitoso
        window.location.reload() // Recargar solo después de un inicio exitoso
        router.replace('/login') // Redirigir al home
      } else {
        setError('Credenciales incorrectas. Por favor, intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      
      // Manejo de errores más específico
      if (err instanceof Error) {
        if (err.message.includes('not_found')) {
          setError('Usuario no encontrado. Verifica tus credenciales.')
        } else if (err.message.includes('invalid_password')) {
          setError('Contraseña incorrecta. Por favor, intenta de nuevo.')
        } else {
          setError('Hubo un problema al intentar iniciar sesión. Intenta nuevamente.')
        }
      }
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
                <LogIn className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-gray-600">
                Bienvenido de vuelta, ingresa a tu cuenta
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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="border-gray-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-orange-400 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium transition-all hover:opacity-90 bg-gradient-to-r from-primary to-orange-400"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center py-6">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="font-medium text-primary hover:text-orange-400 transition-colors"
              >
                Regístrate
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
