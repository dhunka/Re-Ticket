'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, User, Upload, FileText, X } from 'lucide-react'

// Enums
enum TransactionState {
  OrderPlaced = 0,
  WaitingForRelease = 1,
  TicketsReleased = 2,
  Disputed = 3,
  Completed = 4
}

enum UserRole {
  Buyer,
  Seller
}

// Interfaces
interface Buyer {
  name: string;
  email: string;
  phone: string;
  rut: string;
}

interface Ticket {
  id: string;
  event: string;
  price: number;
  buyer: Buyer;
}

interface SellerData {
  name: string;
  email: string;
  phone: string;
  tickets: Ticket[];
}

interface ProcessState {
  state: TransactionState;
  title: string;
  description: string;
}

interface StatusStepProps {
  completed: boolean;
  title: string;
  description: string;
  showTimer?: boolean;
  timeLeft?: number;
}

interface TicketFile {
  name: string;
  url: string;
}

// Datos de ejemplo
const sellerData: SellerData = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '555-5678',
  tickets: [
    {
      id: 'ticket-001',
      event: 'Korn',
      price: 100,
      buyer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '555-1234',
        rut:'20187043-0'
      }
    }
  ]
};

// Estados del proceso
const processStates: ProcessState[] = [
  {
    state: TransactionState.OrderPlaced,
    title: "Pedido de Compra",
    description: "El comprador ha seleccionado y pagado por las entradas."
  },
  {
    state: TransactionState.WaitingForRelease,
    title: "Espera de Liberación",
    description: "El vendedor tiene un plazo para liberar las entradas al comprador."
  },
  {
    state: TransactionState.TicketsReleased,
    title: "Entradas Liberadas",
    description: "El vendedor ha liberado las entradas al comprador."
  },
  {
    state: TransactionState.Completed,
    title: "Finalización",
    description: "La transacción se ha completado satisfactoriamente."
  }
];

// Componente StatusStep
const StatusStep: React.FC<StatusStepProps> = ({ 
  completed, 
  title, 
  description, 
  showTimer = false, 
  timeLeft = 0 
}) => {
  return (
    <div className={`flex items-start space-x-2 ${completed ? 'text-green-600' : 'text-gray-500'}`}>
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

// Componente principal
const TicketPurchaseTracker: React.FC = () => {
    const [state, setState] = useState<TransactionState>(TransactionState.OrderPlaced)
    const [timeLeft, setTimeLeft] = useState<number>(24 * 60 * 60)
    const [userRole, setUserRole] = useState<UserRole>(UserRole.Buyer)
    const [showVerificationForm, setShowVerificationForm] = useState<boolean>(false)
    const [verificationReason, setVerificationReason] = useState<string>('')
    const [ticketFile, setTicketFile] = useState<File | null>(null)
    const [ticketFilePreview, setTicketFilePreview] = useState<string | null>(null)
    const [uploadedTicket, setUploadedTicket] = useState<TicketFile | null>(null)
  
    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }, [])
  
    const handleStateChange = (newState: TransactionState): void => {
      setState(newState)
    }
  
    const handleUserRoleChange = (role: UserRole): void => {
      setUserRole(role)
    }
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        setTicketFile(file)
        const fileUrl = URL.createObjectURL(file)
        setTicketFilePreview(fileUrl)
      }
    }
  
    const removeFile = () => {
      setTicketFile(null)
      if (ticketFilePreview) {
        URL.revokeObjectURL(ticketFilePreview)
        setTicketFilePreview(null)
      }
    }
  
    const handleTicketRelease = () => {
      if (ticketFile) {
        setUploadedTicket({
          name: ticketFile.name,
          url: ticketFilePreview || ''
        })
        setState(TransactionState.TicketsReleased)
      }
    }
  
    const handleTicketVerification = (isCorrect: boolean): void => {
      if (isCorrect) {
        setState(TransactionState.Completed)
      } else if (verificationReason.trim()) {
        setState(TransactionState.Disputed)
      }
      setShowVerificationForm(false)
    }
  
    const resolveDispute = (): void => {
      setState(TransactionState.Completed)
    }
  
    const calculateProgress = () => {
      const totalStates = Object.keys(TransactionState).length / 2 - 1;
      const currentProgress = state === TransactionState.Disputed 
        ? (TransactionState.TicketsReleased / totalStates) * 100
        : (state / totalStates) * 100;
      return currentProgress;
    }
  
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="flex justify-end mb-4">
          <Button
            variant={userRole === UserRole.Buyer ? "default" : "outline"}
            onClick={() => handleUserRoleChange(UserRole.Buyer)}
          >
            Comprador
          </Button>
          <Button
            variant={userRole === UserRole.Seller ? "default" : "outline"}
            onClick={() => handleUserRoleChange(UserRole.Seller)}
            className="ml-2"
          >
            Vendedor
          </Button>
        </div>
  
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
              <div className="flex justify-between">
                {processStates
                  .filter(s => s.state !== TransactionState.Disputed)
                  .map((processState, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`text-xs ${state === processState.state ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => handleStateChange(processState.state)}
                    >
                      {processState.title}
                    </Button>
                  ))}
              </div>
            </div>
  
            <div className="space-y-4">
              {processStates
                .filter(s => s.state !== TransactionState.Disputed)
                .map((processState, index) => (
                  <StatusStep
                    key={index}
                    completed={state >= processState.state && state !== TransactionState.Disputed}
                    title={processState.title}
                    description={processState.description}
                    showTimer={processState.state === TransactionState.WaitingForRelease && state === processState.state}
                    timeLeft={timeLeft}
                  />
                ))}
            </div>
  
            {state === TransactionState.WaitingForRelease && userRole === UserRole.Seller && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Información del Comprador</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <div>
                        <p>{sellerData.tickets[0].buyer.name}</p>
                        <p className="text-sm text-gray-500">{sellerData.tickets[0].buyer.email}</p>
                        <p className="text-sm text-gray-500">{sellerData.tickets[0].buyer.rut}</p>
                      </div>
                    </div>
                  </div>
  
                  <div className="bg-white p-4 rounded-md border">
                    <h4 className="font-medium mb-2">Subir Entrada Transferida</h4>
                    {!ticketFile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <label className="flex flex-col items-center cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">
                            Subir archivo de entrada transferida
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm">{ticketFile.name}</span>
                        </div>
                        <button
                          onClick={removeFile}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleTicketRelease}
                      disabled={!ticketFile}
                    >
                      Liberar Entradas
                    </Button>
                  </div>
                </div>
              </div>
            )}
  
            {state === TransactionState.TicketsReleased && userRole === UserRole.Buyer && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Verificación de Entradas</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md border">
                    <h4 className="font-medium mb-2">Datos de las entradas:</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Evento:</span> {sellerData.tickets[0].event}</p>
                      <p><span className="font-medium">Nombre:</span> {sellerData.tickets[0].buyer.name}</p>
                      <p><span className="font-medium">Email:</span> {sellerData.tickets[0].buyer.email}</p>
                      <p><span className="font-medium">Rut:</span> {sellerData.tickets[0].buyer.rut}</p>

                    </div>
                  </div>
  
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
                  
                  {showVerificationForm ? (
                    <div className="space-y-4">
                      <Textarea
                        value={verificationReason}
                        onChange={(e) => setVerificationReason(e.target.value)}
                        placeholder="Explica detalladamente el problema con las entradas..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowVerificationForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleTicketVerification(false)}
                          disabled={!verificationReason.trim()}
                        >
                          Iniciar Disputa
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowVerificationForm(true)}
                      >
                        Reportar Problema
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleTicketVerification(true)}
                      >
                        Confirmar Entradas
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {state === TransactionState.Disputed && (
              <div className="mt-6 p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold mb-4 text-red-700">Disputa Activa</h3>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h4 className="font-medium mb-2 text-red-700">Motivo de la disputa:</h4>
                  <p className="text-gray-700">{verificationReason}</p>
              </div>
              {userRole === UserRole.Seller && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={resolveDispute}
                  >
                    Resolver Disputa
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          {state === TransactionState.Disputed && userRole === UserRole.Seller && (
            <Button 
              variant="destructive" 
              onClick={resolveDispute}
            >
              Resolver Disputa
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default TicketPurchaseTracker