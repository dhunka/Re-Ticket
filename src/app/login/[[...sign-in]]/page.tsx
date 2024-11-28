'use client'

import { useState, useEffect } from 'react'
import { useSignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const CustomLoginPage = () => {
  const { signIn } = useSignIn() ?? {}
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/')  // Redirige al home si ya está autenticado
    }
  }, [isLoaded, isSignedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!signIn) {
      setError('Error al intentar iniciar sesión. Intenta nuevamente.')
      return
    }

    try {
      const signInResult = await signIn.create({
        identifier: email,
        password,
      })

      if (signInResult.status === 'complete') {
        router.push('/');  
        setTimeout(() => {
          router.refresh() 
        }, 100); 
      } else {
        setError('Credenciales incorrectas. Por favor, intenta nuevamente.')
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setError('Hubo un problema al intentar iniciar sesión. Intenta nuevamente.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md rounded-xl shadow-lg bg-white p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-primary text-white hover:bg-primary/90 rounded-lg py-2 px-4 w-full transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta? <a href="/register" className="text-primary hover:underline">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomLoginPage
