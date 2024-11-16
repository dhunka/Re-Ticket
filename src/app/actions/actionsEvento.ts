// src/app/actions/get-evento.ts
import db from "@/libs/db"; // Importa tu cliente de Prisma

// Función para obtener los datos de un evento
export const getEvento = async (eventId: number) => {
    try {
      const id = Number(eventId) // Convierte el eventId a un número entero
      console.log("Buscando evento con id:", id); // Verifica que el id sea correcto

      const evento = await db.evento.findUnique({
        where: { id  },
        include: {
          tipos_entrada: true,
          tickets: true,
        },
      });

      console.log("Evento encontrado:", evento); // Asegúrate de que se devuelvan datos

      if (!evento) {
        return null;
      }

      return evento;
    } catch (error) {
      console.error("[ERROR] Obteniendo evento:", error);
      throw new Error("Error al obtener el evento");
    }
  };