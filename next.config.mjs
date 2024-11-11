/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
