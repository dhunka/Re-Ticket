//app/compra/[compraid]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, Star, Send } from 'lucide-react';
import axios from 'axios';

interface Ticket {
  id: number;
  archivo_url: string;
}

interface Compra {
  id: number;
  estado: string;
  fecha_compra: string;
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
    description: "El vendedor ha liberado las entradas. Disfruta tu evento."
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

interface SellerRatingProps {
  compraId: string;
  onRatingComplete?: () => void;
}

const SellerRating: React.FC<SellerRatingProps> = ({ compraId, onRatingComplete }) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating < 1 || rating > 5) {
      alert('Por favor, selecciona una valoración entre 1 y 5 estrellas.');
      return;
    }

    if (!review.trim()) {
      alert('Por favor, escribe un comentario sobre tu experiencia.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/ticket/${compraId}`, {
        puntuacion: rating,
        comentario: review,
      });

      if (response.data && response.data.message) {
        alert('¡Valoración enviada correctamente!');
        setRating(0);
        setReview('');
        onRatingComplete?.();
      } else {
        alert('Hubo un error al registrar la valoración.');
      }
    } catch (error) {
      console.error('Error al enviar la valoración:', error);
      alert('Hubo un problema al enviar tu valoración. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg  ">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold text-gray-800 ">
          Valora tu Experiencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Star Rating Section */}
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ease-in-out 
                  ${rating > index 
                    ? 'text-yellow-500 fill-yellow-500 hover:scale-110' 
                    : 'text-gray-300 hover:text-yellow-300 hover:scale-105'}`}
                onClick={() => handleStarClick(index + 1)}
                strokeWidth={1.5}
              />
            ))}
          </div>

          {/* Review Textarea */}
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Comparte detalles de tu experiencia (opcional)"
            className="w-full min-h-[100px] resize-y border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-300"
          />

          {/* Submit Button */}
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark transition-colors duration-300"
          >
            {isSubmitting ? (
              <>
                <span>Enviando...</span>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>Enviar Valoración</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CompraPagina() {
  const params = useParams();
  const compraId = params.compraId as string;

  const [compra, setCompra] = useState<Compra | null>(null);
  const [state, setState] = useState<TransactionState>(TransactionState.OrderPlaced);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [uploadedTicket, setUploadedTicket] = useState<TicketFile | null>(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/ticket/${compraId}`);
        const fetchedCompra = response.data.compra;
        setCompra(fetchedCompra);

        // Configuración del tiempo restante
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

  const handleAcceptedEntry = async () => {
    setState(TransactionState.Completed);
    if (compra) {
      try {
        const response = await axios.patch(`/api/ticket/${compraId}`, { nuevoEstado: 'Completed' });
        if (response.status === 200) {
          alert('¡Compra completada!');
        } else {
          alert('Error al actualizar el estado');
        }
      } catch (error) {
        alert('Error al realizar la solicitud');
      }
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
            {processStates.map((processState, index) => (
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
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Entrada
                  </a>
                </div>
              </div>
              <Button className="mt-4" onClick={handleAcceptedEntry}>
                Confirmar Compra
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state === TransactionState.Completed && (
        <SellerRating compraId={compraId} />
      )}
    </div>
  );
}