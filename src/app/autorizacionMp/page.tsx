// components/ConnectMP.tsx
"use client";
import { useUser } from "@clerk/nextjs";

export default function ConnectMP() {
    const { user } = useUser();

    const handleConnect = async () => {
        try {
            // Enviamos el userId como query parameter
            const response = await fetch(`/api/mercadopago/authorize?userId=${user?.id}`);
            const data = await response.json();
            
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <button 
            onClick={handleConnect}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Conectar con Mercado Pago
        </button>
    );
}