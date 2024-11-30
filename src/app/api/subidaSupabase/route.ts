import { NextResponse } from 'next/server';
import { supabase } from '@/libs/supabaseClient'; // Asegúrate de que esta importación sea correcta
import db from '@/libs/db'; // Asegúrate de tener configurado Prisma correctamente

export async function POST(request: Request) {
  try {
    // Obtener el archivo desde el formulario
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const ticketId = formData.get('ticketId') as string; // Obtenemos el ticketId del formulario

    if (!file || !ticketId) {
      return NextResponse.json({ error: 'No se ha seleccionado un archivo o ticketId' }, { status: 400 });
    }

    // Subir el archivo a Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from('archivos')  // Asegúrate de que este sea el nombre correcto del bucket
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Obtener la URL pública del archivo
    const { data: urlData, error: urlError } = supabase
      .storage
      .from('archivos')  // Asegúrate de que este sea el nombre correcto del bucket
      .getPublicUrl(fileName);

    // Si `urlData` está vacío o no contiene `publicUrl`, manejar el error
    if (urlError || !urlData?.publicUrl) {
      return NextResponse.json({ error: 'No se pudo obtener la URL pública del archivo' }, { status: 500 });
    }

    // Acceder a la URL pública
    const fileUrl = urlData.publicUrl;

    // Actualizar el ticket en la base de datos con la URL del archivo
    await db.ticket.update({
      where: { id: parseInt(ticketId) },  // Convertimos ticketId a número
      data: { archivo_url: fileUrl },  // Guardamos la URL en el campo archivo_url
    });

    return NextResponse.json({ message: 'Archivo subido exitosamente y URL guardada', fileUrl });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error interno en el servidor' }, { status: 500 });
  }
}
