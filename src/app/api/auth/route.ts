import { NextResponse, NextRequest } from "next/server";
import db from "@/libs/db";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    console.log('Contraseña encriptada:', hashedPassword);
    const birthDate = new Date(data.fecha_de_nacimiento);
    birthDate.setUTCHours(0, 0, 0, 0);

    const newUser = await db.usuario.create({
      data: {
        ...data,
        password: hashedPassword,
        fecha_de_nacimiento: birthDate
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
  }
}

