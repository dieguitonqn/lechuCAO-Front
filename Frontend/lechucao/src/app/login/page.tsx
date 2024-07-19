'use client'

import Link from "next/link";
import Image from "next/image";
import { Acme, Coming_Soon, Roboto,  } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormEvent } from 'react'
import axios from "axios"


const roboto = Roboto({
    weight: ["700"],
    style: ["italic"],
    subsets: ["latin"],

})

const comic = Coming_Soon({
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],

})
const acme = Acme({
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],

})
export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        // console.log(formData.get("username"))
        // console.log(formData.get("password"))

        const API_URL = process.env.API_URL;

        try {
            const res = await axios.post(`${API_URL}/login/`,
                formData,
                {
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }
            );

            // console.log(res)
            if (res.statusText.valueOf()!="OK") {
                throw new Error(`Login failed with status ${res.status}`);
            
            }else{
                const { token, token_type } = res.data;
                // console.log(response)

                if (token) {
                    // Store the JWT token in local storage (or a more secure mechanism)
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('token_type', token_type);
                    // console.log('JWT Token stored:', response.token);
                    console.log(localStorage.getItem("jwtToken"))
                    console.log(localStorage.getItem("token_type"))
                    router.push('/home');
                } else {
                    console.error('La respuesta no incluyó el Token JWT');
                }
            }
        } catch (error) {
            alert ( " Usuario o contraseña incorrectos")
            // console.error('Login error:', error);
        }

    }
    return (
        <div className="flex flex-col justify-center items-center h-screen sm:w-full ">
            <form onSubmit={HandleSubmit} className="bg-slate-200 mb-2 p-6 flex flex-col w-1/2  xl:w-1/6 text-black border-2 border-gray-300">
                {/* <form action="/api/login" method="POST" className="bg-slate-200 mb-2 p-6 flex flex-col w-1/2  xl:w-1/6 text-black border-2 border-gray-300"> */}
                <div className="flex justify-center mb-6 p-1 text-5xl font-bold text-gray-700">
                    <h1 className={roboto.className } >LechuCAO</h1>
                </div>

                <div className="flex justify-center shadow-md">
                    <Image
                        src="/lechuza.png"
                        alt="LechuCAO"
                        width="150"
                        height="150"
                    />
                </div>

                <div className="flex justify-center">
                    <h1 className="mb-6 p-1 text-3xl font-bold text-gray-700" >Inicio de Sesión</h1>
                </div>

                <label htmlFor="usr"> Nombre de usuario </label>
                <input
                    type="text"
                    className="border-gray-400  border-2 p-2 mb-6 w-full rounded "
                    name="usr"
                    id="usr"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label htmlFor="pwd"> Contraseña </label>
                <input
                    type="password"
                    className="border-gray-400 border-2 p-2 mb-8 w-full rounded"
                    name="pwd"
                    id="pwd"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className=" ">
                    <button className="p-2 bg-cyan-500 font-bold w-full">Ingresar</button>
                </div>
            </form>
            <div className="mt-4 text-center ">
                <p>
                    ¿No tienes una cuenta? <Link href="https://lechuza.epen.gov.ar/lechuza/registro.php" className=" text-green-400 font-bold " target="_blank">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}
