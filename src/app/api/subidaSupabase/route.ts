import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabaseClient'; // Asegúrate de que esta importación sea correcta
import db from '@/libs/db'; // Asegúrate de tener configurado Prisma correctamente

export async function POST(request: Request) {
  try {
    // Obtener el archivo y el video desde el formulario
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const video = formData.get('video') as File;  // Asumiendo que el video también es parte del formulario
    const ticketId = formData.get('ticketId') as string; // Obtenemos el ticketId del formulario

    if (!file || !ticketId) {
      return NextResponse.json({ error: 'No se ha seleccionado un archivo o ticketId' }, { status: 400 });
    }

    // Subir el archivo PDF al bucket 'archivos'
    const fileName = `${Date.now()}-${file.name}`;
    const uploadFileResponse = await supabase
      .storage
      .from('archivos')  // Asegúrate de que este sea el nombre correcto del bucket
      .upload(fileName, file);

    // Verificar si hubo un error al subir el archivo
    if (uploadFileResponse.error) {
      return NextResponse.json({ error: uploadFileResponse.error.message }, { status: 401 });
    }

    // Obtener la URL pública del archivo PDF
    const { data: urlData } = supabase
      .storage
      .from('archivos')  // Asegúrate de que este sea el nombre correcto del bucket
      .getPublicUrl(fileName);

    // Verificar si la URL pública fue obtenida correctamente
    if (!urlData?.publicUrl) {
      return NextResponse.json({ error: 'No se pudo obtener la URL pública del archivo' }, { status: 402 });
    }

    // Subir el video al mismo bucket 'archivos' si se ha cargado uno
    let videoUrl = '';
    if (video) {
      const videoName = `${Date.now()}-${video.name}`;
      const uploadVideoResponse = await supabase
        .storage
        .from('archivos')  // Usamos el mismo bucket para el video
        .upload(videoName, video);

      // Verificar si hubo un error al subir el video
      if (uploadVideoResponse.error) {
        return NextResponse.json({ error: uploadVideoResponse.error.message }, { status: 500 });
      }

      const { data: videoUrlData } = supabase
        .storage
        .from('archivos')  // También obtenemos la URL pública del mismo bucket
        .getPublicUrl(videoName);

      // Verificar si la URL pública del video fue obtenida correctamente
      if (!videoUrlData?.publicUrl) {
        return NextResponse.json({ error: 'No se pudo obtener la URL pública del video' }, { status: 501 });
      }

      videoUrl = videoUrlData.publicUrl;
    }

    // Buscar la compra por 'ticket_id'
    const compra = await db.compra.findFirst({
      where: { ticket_id: parseInt(ticketId) },  // Usamos ticket_id para encontrar la compra
    });

    if (!compra) {
      return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
    }

    // Actualizar la URL del archivo en el ticket
    await db.ticket.update({
      where: { id: parseInt(ticketId) },  // Usamos 'id' para el ticket
      data: {
        archivo_url: urlData.publicUrl,  // Guardamos la URL del archivo PDF
      },
    });

    // Actualizar la URL del video en la compra
    await db.compra.update({
      where: { id: compra.id },  // Usamos el 'id' de la compra para actualizar
      data: {
        video_vendedor: videoUrl,  // Guardamos la URL del video (si se cargó uno)
      },
    });

    return NextResponse.json({ message: 'Archivo y video subidos exitosamente', fileUrl: urlData.publicUrl, videoUrl });

  } catch (error) {
    console.error('Error al subir archivo y video:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 600 });
  }
}
