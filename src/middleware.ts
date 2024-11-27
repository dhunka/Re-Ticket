import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define las rutas públicas permitidas
const isPublicRoute = createRouteMatcher([
  '/login(.*)', 
  '/register(.*)',
  '/',
  '/Compra',
  '/evento/(.*)',
  '/crearevento(.*)',
  '/eventos',
  '/estadoCompra',
  '/dinamica',
  '/components/ui/header',
  // Añade solo las rutas de API públicas necesarias
  '/api/buscarEvento',
  '/api/obtenerUserid',
  '/api(.*)',
  'api/venta/[vendedorIdNumber]'

]);

export default clerkMiddleware(async (auth, request) => {
  // Aplica protección solo a las rutas que no sean públicas
  if (!isPublicRoute(request)) {
    await auth.protect(); // Protege todas las rutas no listadas como públicas
  }
});

export const config = {
  matcher: [
    '/',
    '/login(.*)',
    '/register(.*)',
    '/perfil',
    '/eventos',

    // Excluye internals de Next.js y archivos estáticos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Asegura que todas las rutas de API pasen por el middleware
    '/api/(.*)',
  ],
};
