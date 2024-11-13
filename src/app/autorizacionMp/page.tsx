// components/ConnectMP.tsx
"use client";

export default function ConnectMP() {
  const handleConnect = async () => {
    try {
      const response = await fetch('/api/mercadopago/authorize');
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