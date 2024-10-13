"use client";
import { useForm } from "react-hook-form";
import {signIn} from 'next-auth/react'
import { useRouter } from "next/navigation";
import {useState} from "react";

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()
    const router = useRouter()
    const [error, setError] = useState(null)
    const onSubmit = handleSubmit(async (data) => {
            console.log(data)
    const res = await signIn('credentials',{
        correo: data.correo, 
        password: data.password,
        redirect: false,
        });

        console.log(res)
        if (res.error){
            setError(res.error)
        } else{
            router.push('/dashboard')
            router.refresh()
        } 
    });

    return(
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
        <form action="" onSubmit={onSubmit} className="w-1/4">
        {error && (
            <p className="bg-red-700 text-lg text-white p-3 rounded">{error}</p>
        ) }
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Iniciar sesion</h1>
            <label htmlFor="correo" className="text-slate-500 mb-2 block text-sm">Correo</label>
                <input type="email"
                    {...register("correo",
                        {
                            required: {
                                value: true,
                                message: "El correo es obligatorio"
                            },
                        }
                    )}
                        className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />
                    {errors.correo && (
                    <span className="text-red-500 text-xs">
                        {errors.correo.message}
                    </span>
                    )}


            <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">Contraseña</label>
                <input type="password"
                    {...register("password", 
                        {
                            required: {
                                value: true,
                                message: "La contraseña es obligatoria"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />
                    {errors.password && (
                    <span className="text-red-500 text-xs">
                        {errors.password.message}
                    </span>
                    )}    
            <button className="w-full bg-blue-400 text-white p-3 rounded-lg">Iniciar Sesion</button>
        </form>
    </div>

    )  
}
export default LoginPage;