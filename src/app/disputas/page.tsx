'use client'

import { useState } from 'react'

const CrearDisputaPage = () => {
  const [compraId, setCompraId] = useState('')
  const [compradorId, setCompradorId] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación simple de los campos
    if (!compraId || !compradorId || !ticketId || !descripcion) {
      setMensajeError('Todos los campos son obligatorios.')
      return
    }

    const respuesta = await fetch('/api/disputas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ compra_id: compraId, comprador_id: compradorId, ticket_id: ticketId, descripcion }),
    })

    const data = await respuesta.json()

    if (respuesta.ok) {
      setMensajeExito('Disputa creada con éxito.')
      setCompraId('')
      setCompradorId('')
      setTicketId('')
      setDescripcion('')
    } else {
      setMensajeError(data.error || 'Hubo un error al crear la disputa.')
    }
  }

  return (
    <div>
      <h1>Crear Disputa</h1>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="compra_id">ID de Compra:</label>
          <input
            type="text"
            id="compra_id"
            value={compraId}
            onChange={(e) => setCompraId(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="comprador_id">ID del Comprador:</label>
          <input
            type="text"
            id="comprador_id"
            value={compradorId}
            onChange={(e) => setCompradorId(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="ticket_id">ID del Ticket:</label>
          <input
            type="text"
            id="ticket_id"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="descripcion">Descripción de la Disputa:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        
        <button type="submit">Crear Disputa</button>
      </form>
    </div>
  )
}

export default CrearDisputaPage
