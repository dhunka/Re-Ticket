'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle } from 'lucide-react';
import UploadForm from '@/components/ui/UploadForm';

enum TransactionState {
  OrderPlaced = 0,
  WaitingForRelease = 1,
  TicketsReleased = 2,
  Disputed = 3,
  Completed = 4
}

interface ProcessState {
  state: TransactionState;
  title: string;
  description: string;
}

const processStates: ProcessState[] = [
  {
    state: TransactionState.OrderPlaced,
    title: 'Pedido de Compra',
    description: 'El comprador ha seleccionado y pagado por las entradas.',
  },
  {
    state: TransactionState.WaitingForRelease,
    title: 'Espera de Liberación',
    description: 'Tiene un plazo para liberar las entradas al comprador.',
  },
  {
    state: TransactionState.TicketsReleased,
    title: 'Entradas Liberadas',
    description: 'La Entrada fue liberada, puede salir.',
  },
];

interface StatusStepProps {
  completed: boolean;
  active: boolean;
  title: string;
  description: string;
  showTimer?: boolean;
  timeLeft?: number;
}

const StatusStep: React.FC<StatusStepProps> = ({
  completed,
  active,
  title,
  description,
  showTimer = false,
  timeLeft = 0,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div
      className={`flex items-start space-x-2 ${completed ? 'text-orange-500' : active ? 'text-primary' : 'text-gray-500'}`}
    >
      {completed ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <Clock className="w-5 h-5 mt-0.5" />}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
        {showTimer && (
          <p className="text-sm font-medium">
            Tiempo restante: {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </div>
  );
};

const InterfazVendedorPage: React.FC = () => {
  const params = useParams();
  const ventaId = params.ventaId as string;
  const ventaIdNumber = Number(ventaId);

  const [state, setState] = useState<TransactionState>(TransactionState.WaitingForRelease);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 24 horas por defecto
  const [buyerData, setBuyerData] = useState<{ name: string; rut: string; fechaCompra: string; ticketId: number } | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true); // Estado para controlar el temporizador

  useEffect(() => {
    if (ventaIdNumber) {
      const fetchBuyerData = async () => {
        try {
          const response = await fetch(`/api/vendedor/${ventaIdNumber}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Datos obtenidos:', data);

          if (data?.compra) {
            console.log('Datos de compra:', data.compra);

            const fechaExpiracion = new Date(data.compra.fechaExpiracion);
            const tiempoRestante = data.compra.tiempoRestante;

            setBuyerData({
              name: data.compra.nombre || 'Nombre no disponible',
              rut: data.compra.rut || 'RUT no disponible',
              fechaCompra: fechaExpiracion.toISOString(),
              ticketId: data.compra.ticketId,
            });

            setTimeLeft(Math.max(0, Math.floor(tiempoRestante / 1000)));
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };

      fetchBuyerData();
    } else {
      console.warn('ventaIdNumber no es válido');
    }
  }, [ventaIdNumber]);

  useEffect(() => {
    if (state === TransactionState.WaitingForRelease && timeLeft > 0 && isTimerActive) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setState(TransactionState.TicketsReleased); // Cambiar el estado cuando el temporizador termine
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, timeLeft, isTimerActive]); // Dependemos también de isTimerActive

  const calculateProgress = () => {
    // Ahora calculamos el progreso basado en el número de estados posibles
    const totalStates = 2; // Ahora hay solo 3 estados, por lo que totalStates es 2 (maximo)
    return (state / totalStates) * 100;
  };

  // Función para detener el temporizador, que se pasará a UploadForm
  const detenerTemporizador = () => {
    setIsTimerActive(false); // Detenemos el temporizador
  };

  // Función para manejar la confirmación de la entrada
  const handleConfirmarEntrada = () => {
    setState(TransactionState.TicketsReleased); // Cambiar el estado a TicketsReleased
    // No es necesario más porque ya no hay estado "Completed"
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento de Venta de Entradas</CardTitle>
          <CardDescription>
            Estado actual: {processStates.find((s) => s.state === state)?.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={calculateProgress()} className="w-full mb-2" />
          </div>

          <div className="space-y-4">
            {processStates.map((processState, index) => (
              <StatusStep
                key={index}
                completed={state > processState.state}
                active={state === processState.state}
                title={processState.title}
                description={processState.description}
                showTimer={processState.state === TransactionState.WaitingForRelease && state === processState.state}
                timeLeft={timeLeft}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {state === TransactionState.WaitingForRelease && buyerData && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Información del Comprador</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border">
                <div className="flex items-center space-x-2">
                  <div>
                    <p>{buyerData.name}</p>
                    <p className="text-sm text-gray-500">{buyerData.rut}</p>
                  </div>
                </div>
              </div>
              <UploadForm 
                ticketId={buyerData.ticketId} 
                onConfirmarEntrada={handleConfirmarEntrada}  
                detenerTemporizador={detenerTemporizador} 
              />
            </div>
          </CardContent>
        </Card>
      )}

        {state === TransactionState.Completed && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-orange-600">Finalización</h3>
            <p>La compra ha sido completada satisfactoriamente. ¡Disfruta de tu evento!</p>
          </CardContent>
        </Card>
      )}
    </div>


  );
};

export default InterfazVendedorPage;
