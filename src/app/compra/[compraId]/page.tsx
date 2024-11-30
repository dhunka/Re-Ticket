'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, Star, StarHalf } from 'lucide-react'; // Iconos de lucide-react
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
  ticket?: Ticket;
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
    description: "El vendedor ha liberado las entradas, Disfrute su entrada."
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
  return (
    <div className={`flex items-start space-x-2 ${completed ? 'text-orange-600' : active ? 'text-primary' : 'text-gray-500'}`}>
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
  const [rating, setRating] = useState<number>(0); // Para la valoración
  const [review, setReview] = useState<string>(''); // Para la reseña

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ticket/${compraId}`);
        const fetchedCompra = response.data.compra;
        setCompra(fetchedCompra);
        const fechaCompra = new Date(fetchedCompra.fecha_compra);
        const fechaLimite = new Date(fechaCompra);
        fechaLimite.setHours(fechaLimite.getHours() + 24);
        const tiempoRestante = Math.max(0, fechaLimite.getTime() - Date.now());
        setTimeLeft(Math.floor(tiempoRestante / 1000));
        setState(TransactionState.WaitingForRelease);
      } catch (err) {
        setError('Error al cargar la compra');
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
          if (prevTime === 1) {
            setState(TransactionState.TicketsReleased);
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1);
  
      return () => clearInterval(timer);
    }
  }, [state, timeLeft]);

  useEffect(() => {
    if (state === TransactionState.TicketsReleased && compra?.ticket) {
      setUploadedTicket({
        name: 'ticket.pdf',
        url: compra.ticket.archivo_url,
      });
    }
  }, [state, compra]);

  const calculateProgress = () => {
    const totalStates = Object.keys(TransactionState).length / 2 - 1;
    return (state / totalStates) * 100;
  };

  const handleAcceptedEntry = () => {
    setState(TransactionState.Completed);
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1); // Setea la valoración basada en el índice
  };

  const handleSubmitReview = async () => {
    try {
      if (rating < 1 || rating > 5) {
        alert('La valoración debe estar entre 1 y 5.');
        return;
      }
      if (!review.trim()) {
        alert('Por favor, escribe un comentario.');
        return;
      }

      const response = await axios.post(`/api/ticket/${compraId}`, {
        puntuacion: rating,
        comentario: review,
      });

      if (response.data && response.data.message) {
        alert('¡Valoración enviada correctamente!');
        setRating(0);
        setReview('');
      } else {
        alert('Hubo un error al registrar la valoración.');
      }
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      alert('Hubo un error al enviar la valoración.');
    }
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
                    href={uploadedTicket.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Ver entrada</span>
                  </a>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="default" onClick={handleAcceptedEntry}>Entrada Aceptada</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {state === TransactionState.Completed && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="font-semibold mb-4 text-orange-600">Finalización</h3>
            <p>La compra ha sido completada satisfactoriamente. ¡Disfruta de tu evento!</p>

            <div className="mt-4">
              <h4 className="font-semibold">Deje una reseña sobre su experiencia con el vendedor:</h4>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="w-full p-2 mt-2 border rounded-md focus:ring-2 focus:ring-primary"
                placeholder="Escribe tu reseña aquí..."
              />

              <div className="mt-4 flex items-center space-x-2">
                <label className="font-semibold">Valoración:</label>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleStarClick(index)}
                      className={`w-8 h-8 flex items-center justify-center ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      {rating > index ? <Star /> : <StarHalf />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="default" onClick={handleSubmitReview}>Enviar Reseña</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
