'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Ticket {
  id: number;
  archivo_url: string;
}

interface Compra {
  id: number;
  estado: string;
  comprador?: {
    id: number;
    nombre: string;
  };
  ticket?: Ticket;  // Asegúrate de que la propiedad ticket esté aquí
}



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
    title: "Pedido de Compra",
    description: "Has seleccionado y pagado por las entradas."
  },
  {
    state: TransactionState.WaitingForRelease,
    title: "Espera de Liberación",
    description: "El vendedor tiene un plazo para liberar las entradas."
  },
  {
    state: TransactionState.TicketsReleased,
    title: "Entradas Liberadas",
    description: "El vendedor ha liberado las entradas."
  },
  {
    state: TransactionState.Completed,
    title: "Finalización",
    description: "La transacción se ha completado satisfactoriamente."
  }
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
  return (
    <div className={`flex items-start space-x-2 ${completed ? 'text-green-600' : active ? 'text-primary' : 'text-gray-500'}`}>
      {completed ? <CheckCircle className="w-5 h-5 mt-0.5" /> : <Clock className="w-5 h-5 mt-0.5" />}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
        {showTimer && (
          <p className="text-sm font-medium">
            Tiempo restante: {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m {timeLeft % 60}s
          </p>
        )}
      </div>
    </div>
  );
};

interface TicketFile {
  name: string;
  url: string;
}

export default function CompraPagina() {
  const params = useParams();
  const compraId = params.compraId as string;

  const [compra, setCompra] = useState<Compra | null>(null);
  const [state, setState] = useState<TransactionState>(TransactionState.WaitingForRelease);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10); // Tiempo restante (en segundos)
  const [uploadedTicket, setUploadedTicket] = useState<TicketFile | null>(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ticket/${compraId}`);
        console.log('Respuesta de la API:', response.data);
        const fetchedCompra = response.data.compra;
        setCompra(fetchedCompra);
        console.log('Compra cargada:', fetchedCompra);
        const fechaCompra = new Date(fetchedCompra.fecha_compra);
        const fechaLimite = new Date(fechaCompra);
        fechaLimite.setHours(fechaLimite.getHours() + 24);
        const tiempoRestante = Math.max(0, fechaLimite.getTime() - Date.now());
        setTimeLeft(Math.floor(tiempoRestante / 1000));
        setState(TransactionState.WaitingForRelease);
      } catch (err) {
        setError('Error al cargar la compra');
        console.error('Error al obtener compra:', err);
      } finally {
        setLoading(false);
      }
    };
  
    if (compraId) {
      fetchCompra();
    }
  }, [compraId]);
  

  useEffect(() => {
    if (state === TransactionState.WaitingForRelease && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {  // Cuando llegue a 1 segundo
            // Cambiar el estado a 'TicketsReleased' cuando el tiempo llegue a 1
            setState(TransactionState.TicketsReleased);
            clearInterval(timer); // Detener el temporizador
            return 0; // Poner el tiempo restante en 0
          }
          return prevTime - 1; // Restar un segundo
        });
      }, 1); // Ejecutar cada segundo
  
      return () => clearInterval(timer); // Limpiar el temporizador cuando el componente se desmonte o el estado cambie
    }
  }, [state, timeLeft]); // Este useEffect depende tanto del 'state' como de 'timeLeft'
  

  useEffect(() => {
    if (state === TransactionState.TicketsReleased && compra?.ticket) {
      setUploadedTicket({
        name: 'ticket.pdf',
        url: compra.ticket.archivo_url,
      });
    }
  }, [state, compra]); // Asegúrate de que solo dependa de state y compra
  
  
  const calculateProgress = () => {
    const totalStates = Object.keys(TransactionState).length / 2 - 1;
    return (state / totalStates) * 100;
  };

  const handleAcceptedEntry = () => {
    // Aquí cambiamos el estado local a "COMPLETADO"
    setState(TransactionState.Completed);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!compra) return <div>No se encontró la compra</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento de Compra de Entradas</CardTitle>
          <CardDescription>
            Compra #: {compra.id} | Cliente: {compra.comprador?.nombre || 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={calculateProgress()} className="w-full mb-2" />
          </div>

          <div className="space-y-4">
            {processStates
              .filter(s => s.state !== TransactionState.Disputed)
              .map((processState, index) => (
                <StatusStep
                  key={index}
                  completed={state > processState.state}
                  active={state === processState.state}
                  title={processState.title}
                  description={processState.description}
                  showTimer={state === processState.state && processState.state === TransactionState.WaitingForRelease}
                  timeLeft={timeLeft}
                />
              ))}
          </div>
        </CardContent>
      </Card>
      {state === TransactionState.TicketsReleased && uploadedTicket && (
  <Card className="mt-6">
    <CardContent className="p-4">
      <h3 className="font-semibold mb-4">Entradas Liberadas</h3>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md border">
          <h4 className="font-medium mb-2">Entrada Transferida:</h4>
          <div className="mt-2">
            <a         
              href={uploadedTicket.url} // URL del archivo PDF
              target="_blank"  // Abre en una nueva pestaña
              rel="noopener noreferrer"  // Seguridad adicional
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>Ver entrada</span>
            </a>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="default"
            onClick={handleAcceptedEntry}
          >
            Entrada Aceptada
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)}

      {state === TransactionState.Completed && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-green-700">Finalización</h3>
            <p>La compra ha sido completada satisfactoriamente. ¡Disfruta de tu evento!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
