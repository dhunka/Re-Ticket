import sb from "@/libs/db";

export async function getEventos() {
  try {
    const eventos = await sb.evento.findMany({
      select: {
        id: true,
        nombre: true,
        fecha_evento: true,
        url_foto: true,
      },
    });

    return eventos.map((evento) => ({
      id: evento.id,
      name: evento.nombre,
      date: evento.fecha_evento.toISOString().split("T")[0], // Formatea la fecha
      image: evento.url_foto || "", // Maneja la ausencia de imagen
    }));
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return [];
  }
}
