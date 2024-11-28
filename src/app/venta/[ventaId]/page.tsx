'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, X, Clock, CheckCircle } from 'lucide-react';

enum TransactionState {
  OrderPlaced = 0,
  WaitingForRelease = 1,
  TicketsReleased = 2,
  Completed = 3,
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
    description: 'El vendedor tiene un plazo para liberar las entradas al comprador.',
  },
  {
    state: TransactionState.TicketsReleased,
    title: 'Entradas Liberadas',
    description: 'La Entrada fue liberada.',
  },
  {
    state: TransactionState.Completed,
    title: 'Finalización',
    description: 'La transacción se ha completado satisfactoriamente.',
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
      className={`flex items-start space-x-2 ${completed ? 'text-green-600' : active ? 'text-primary' : 'text-gray-500'}`}
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
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [ticketFilePreview, setTicketFilePreview] = useState<string | null>(null);
  const [buyerData, setBuyerData] = useState<{ name: string; rut: string; fechaCompra: string } | null>(null);

  useEffect(() => {
    if (ventaIdNumber) {
      const fetchBuyerData = async () => {
        try {
          const response = await fetch(`/api/vendedor/${ventaIdNumber}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log('Datos obtenidos:', data); // Mostrar todos los datos
  
          // Verifica si 'compra' existe y tiene datos relacionados con la expiración
          if (data?.compra) {
            console.log('Datos de compra:', data.compra); // Ver qué contiene 'compra'
  
            const fechaExpiracion = new Date(data.compra.fechaExpiracion);
            const tiempoRestante = data.compra.tiempoRestante;
  
            // Si la fecha de expiración está disponible, ajusta la lógica del temporizador
            setBuyerData({
              name: data.compra.nombre || 'Nombre no disponible',
              rut: data.compra.rut || 'RUT no disponible',
              fechaCompra: fechaExpiracion.toISOString(),
            });
  
            setTimeLeft(Math.max(0, Math.floor(tiempoRestante / 1000))); // Convirtiendo el tiempo restante a segundos
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
    if (state === TransactionState.WaitingForRelease && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setState(TransactionState.TicketsReleased); // Cambia el estado aquí
            clearInterval(timer);  // Detenemos el temporizador
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer); // Limpiar el intervalo cuando el componente se desmonte
    }
  }, [state, timeLeft]); // Se ejecuta cuando el estado o el tiempo restante cambian

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTicketFile(file);
      const fileUrl = URL.createObjectURL(file);
      setTicketFilePreview(fileUrl);
    }
  };

  const removeFile = () => {
    setTicketFile(null);
    if (ticketFilePreview) {
      URL.revokeObjectURL(ticketFilePreview);
      setTicketFilePreview(null);
    }
  };

  const handleTicketRelease = () => {
    if (!ticketFile) {
      console.warn("No se ha subido ningún archivo, pero se procede con la liberación.");
    }
    setState(TransactionState.Completed);
  };

  const calculateProgress = () => {
    const totalStates = Object.keys(TransactionState).length - 1;
    return (state / totalStates) * 100;
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

              <div className="bg-white p-4 rounded-md border">
                <h4 className="font-medium mb-2">Subir Entrada Transferida (Opcional)</h4>
                {!ticketFile ? (
                  <div className="flex flex-col items-center justify-center py-4 space-y-2 border-dashed border-2 rounded-md">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf"
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500">Cargar archivo PDF de la entrada.</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>{ticketFile.name}</span>
                    <Button variant="destructive" onClick={removeFile} size="icon">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setState(TransactionState.Completed)}
              >
                Liberar Entrada
              </Button>
              <Button
                variant="default"
                onClick={handleTicketRelease}
                disabled={state !== TransactionState.WaitingForRelease}
              >
                Confirmar Liberación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterfazVendedorPage;
