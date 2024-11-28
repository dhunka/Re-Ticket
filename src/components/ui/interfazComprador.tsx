'use client'

import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle } from 'lucide-react'

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
  timeLeft = 0 
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
  )
}

interface TicketFile {
  name: string;
  url: string;
}

export const InterfazComprador: React.FC = () => {
  const [state, setState] = useState<TransactionState>(TransactionState.WaitingForRelease)
  const [timeLeft, setTimeLeft] = useState<number>(5) // Tiempo ajustado a 5 segundos para demostración
  const [uploadedTicket, setUploadedTicket] = useState<TicketFile | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Cuando el tiempo llegue a 0, pasar automáticamente a Entradas Liberadas
          if (state === TransactionState.WaitingForRelease) {
            setState(TransactionState.TicketsReleased)
          }
          return 0;
        }
        return prevTime - 1;
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [state])

  // Simulating ticket upload by seller
  useEffect(() => {
    if (state === TransactionState.TicketsReleased) {
      setUploadedTicket({
        name: 'ticket.pdf',
        url: '/placeholder.svg'
      })
    }
  }, [state])

  const calculateProgress = () => {
    const totalStates = Object.keys(TransactionState).length / 2 - 1;
    const currentProgress = state === TransactionState.Disputed 
      ? (TransactionState.TicketsReleased / totalStates) * 100
      : (state / totalStates) * 100;
    return currentProgress;
  }

  const handleAcceptedEntry = () => {
    setState(TransactionState.Completed)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento de Compra de Entradas</CardTitle>
          <CardDescription>
            {state === TransactionState.Disputed 
              ? "Estado: Disputa en Proceso"
              : `Estado actual: ${processStates.find(s => s.state === state)?.title}` 
            }
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
                  completed={state > processState.state && state !== TransactionState.Disputed}
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

      {state === TransactionState.TicketsReleased && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Entradas Liberadas</h3>
            <div className="space-y-4">
              {uploadedTicket && (
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-medium mb-2">Entrada Transferida:</h4>
                  <div className="mt-2">
                    <a
                      href={uploadedTicket.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Ver entrada</span>
                    </a>
                  </div>
                </div>
              )}
              
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
  )
}

