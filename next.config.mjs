/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['img.clerk.com'], // Agregar el dominio de Clerk
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'static.ptocdn.net',
          port: '',
        },
      ],
    },
  };
  
  export default nextConfig;
  
  