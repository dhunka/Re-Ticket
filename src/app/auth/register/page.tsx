"use client";
import { useForm } from "react-hook-form";

function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        if (data.password !== data.confirmPassword) {
            return alert("Contraseña no coincide");
        }
        const res = await fetch('/api/auth/register', {
            method: "POST",
            body: JSON.stringify(
                {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    password: data.password,
                    rut: data.rut,
                    fecha_de_nacimiento: data.fecha_de_nacimiento,
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const resJSON = await res.json();
        console.log(resJSON);
    });
    console.log(errors);
    return (
        <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
            <form action="" onSubmit={onSubmit} className="w-1/4">
                <h1 className="text-slate-200 font-bold text-4xl mb-4">Registrarse</h1>

                <label htmlFor="nombre" className="text-slate-500 mb-2 block text-sm">Nombre</label>
                <input type="text"
                    {...register("nombre",
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />

                <label htmlFor="apellido" className="text-slate-500 mb-2 block text-sm">Apellido</label>
                <input type="text"
                    {...register("apellido",
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />

                <label htmlFor="rut" className="text-slate-500 mb-2 block text-sm">Rut</label>
                <input type="text"
                    {...register("rut",
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />


                <label htmlFor="correo" className="text-slate-500 mb-2 block text-sm">Correo</label>
                <input type="email"
                    {...register("correo",
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />

                <label htmlFor="fecha_de_nacimiento" className="text-slate-500 mb-2 block text-sm">Fecha de Nacimiento</label>
                <input 
                    type="date"
                    {...register("fecha_de_nacimiento", 
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />


                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">Contraseña</label>
                <input type="password"
                    {...register("password", 
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                            }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />

                <label htmlFor="confirmPassword" className="text-slate-500 mb-2 block text-sm">Confirmar Contraseña</label>
                <input type="password"
                    {...register("confirmPassword", 
                        {
                            required: {
                                value: true,
                                message: "Este campo es obligatorio"
                             }
                        }
                    )}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                />

                <button className="w-full bg-blue-400 text-white p-3 rounded-lg">Aceptar</button>
            </form>
        </div>
    );
}

export default RegisterPage;
