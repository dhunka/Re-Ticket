import { useUser } from "@clerk/nextjs"


export const ConnectMPView: React.FC = () => {
    const { user } = useUser()
  
    const handleConnect = async () => {
      try {
        const response = await fetch(`/api/mercadopago/authorize?userId=${user?.id}`)
        const data: { url: string } = await response.json()
  
        if (data.url) {
          window.location.href = data.url
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800">
          Conectar MercadoPago
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-center text-sm md:text-base max-w-md px-2 md:px-0">
            Conecta tu cuenta de MercadoPago para poder recibir pagos por tus ventas de tickets.
            Este proceso es seguro y necesario para operar como vendedor.
          </p>
          <button 
            onClick={handleConnect}
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors"
          >
            Conectar con Mercado Pago
          </button>
        </div>
      </div>
    )
  }