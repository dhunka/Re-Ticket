import { NextResponse, NextRequest } from "next/server";
import db from "@/libs/db";
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log(data);

        // Encriptar la contraseña
        const saltRounds = 10; // Puedes ajustar este valor para mayor seguridad
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        console.log('Contraseña encriptada:', hashedPassword); // Añade esta línea

        // Procesar la fecha de nacimiento
        const birthDate = new Date(data.fecha_de_nacimiento);
        birthDate.setUTCHours(0, 0, 0, 0); 

        // Crear nuevo usuario con la contraseña encriptada y la fecha de nacimiento ajustada
        const newUser = await db.usuario.create({
            data: {
                ...data,
                password: hashedPassword, // Guarda la contraseña encriptada
                fecha_de_nacimiento: birthDate // Guarda la fecha de nacimiento
            }
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
    }
}

