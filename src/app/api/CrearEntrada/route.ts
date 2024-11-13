
import type { NextApiRequest, NextApiResponse } from 'next'
import db from '@/libs/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        const {
          evento_id,
          tipo_entrada_id,
          fecha_evento, // Nueva propiedad
          precio,
          numeroAsiento,
          esPortador,
          archivo_url,
          estado,
          fecha_vencimiento
        } = req.body
  
        // Verificar que la fecha seleccionada está dentro del rango del evento
        const evento = await db.evento.findUnique({
          where: { id: evento_id }
        });
  
        if (!evento) {
          return res.status(404).json({ error: 'Evento no encontrado' });
        }
  
        const fechaSeleccionada = new Date(fecha_evento);
        if (fechaSeleccionada < evento.fecha_inicio || fechaSeleccionada > evento.fecha_fin) {
          return res.status(400).json({ error: 'Fecha no válida para este evento' });
        }
  
        const ticket = await db.ticket.create({
          data: {
            evento_id,
            tipo_entrada_id,
            fecha_evento: fechaSeleccionada, // Guardar la fecha específica
            precio,
            estado,
            archivo_url,
            fecha_vencimiento,
            vendedor_id: 1, // Obtener de la sesión
          },
        })
  
        res.status(201).json(ticket)
      } catch (error) {
        res.status(500).json({ error: 'Error al crear el ticket' })
      }
    }
  }