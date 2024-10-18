import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";
import bcrypt from 'bcrypt';


const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                correo: { label: "Correo", type: "email", placeholder: "tu_correo@ejemplo.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log(credentials)

                const userFound = await db.usuario.findUnique({
                    where:{
                        correo: credentials?.correo
                    }
                })
                if (!userFound) throw new Error('Correo Incorrecto')

                    console.log(userFound)
                
                const matchPassword = await bcrypt.compare(credentials.password, userFound.password)
                if(!matchPassword) throw new Error ('Contraseña Incorrecta')
                return {
                    id: userFound.id,
                    nombre: userFound.nombre,
                    correo: userFound.correo
                } 
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
      },
   

};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
