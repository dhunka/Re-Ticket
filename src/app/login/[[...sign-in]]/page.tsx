'use client'

import { SignIn } from "@clerk/nextjs"
import { Card, CardContent,  CardFooter, } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardContent>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                footer: 'hidden',
              },
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta? <a href="/register" className="text-primary hover:underline">Regístrate</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}