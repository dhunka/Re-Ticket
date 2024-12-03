'use server'
import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Datos recibidos en el backend:', body);

    // Verificar que todos los campos requeridos estén presentes
    const camposRequeridos = ['clerkId', 'nombre', 'apellido', 'rut', 'correo'];
    const camposFaltantes = camposRequeridos.filter(campo => !body[campo]);

    if (camposFaltantes.length > 0) {
      console.log('Campos faltantes:', camposFaltantes);
      return NextResponse.json(
        { error: `Faltan campos requeridos: ${camposFaltantes.join(', ')}` },
        { status: 400 }
      );
    }

    // Crear el usuario
    const usuario = await db.usuario.create({
      data: {
        clerkId: body.clerkId,
        nombre: body.nombre,
        apellido: body.apellido,
        rut: body.rut,
        correo: body.correo,
        rol: 'member',  // O el rol que desees asignar
      },
    });

    console.log('Usuario creado exitosamente:', usuario);
    return NextResponse.json(usuario, { status: 201 });

  } catch (error) {
    console.error('Error detallado al guardar usuario:', error);
    
    if (error instanceof Error) {
      // Si es un error de Prisma, puede tener más detalles
      const errorDetails = error.message || 'Error desconocido';
      console.error('Mensaje de error:', errorDetails);
      
      return NextResponse.json(
        { 
          error: 'Error al guardar usuario', 
          details: errorDetails,
          // Solo incluir stack trace en desarrollo
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error desconocido al guardar usuario' },
      { status: 500 }
    );
  }
}
