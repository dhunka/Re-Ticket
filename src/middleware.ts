import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/login(.*)', '/register(.*)','/', '/Compra'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)){
    await auth.protect()
  }
});


export const config = {
  matcher: [
    // Rutas públicas (sin autenticación)
    '/perfil',
    '/',

    // Omite internals de Next.js y archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Siempre ejecutarse para rutas API
    '/(api|trpc)(.*)',
  ],
}