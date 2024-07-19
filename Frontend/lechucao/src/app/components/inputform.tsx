'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Input from './input';
import Button from './button';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Acme, Content } from 'next/font/google';
import { headers } from 'next/headers';
// import { useForm } from 'react-hook-form';


function InputForm() {
    const [numFilas, setNumFilas] = useState(1); // Estado para la cantidad de filas
    const [obra, setObra] = useState("")
    const router = useRouter();
    const [error, setError] = useState("");
    const [obras, setObras] = useState([""]);
    const API_URL = process.env.API_URL;
    // const { handleSubmit } = useForm(); // Using useForm hook

    useEffect(() => {
        const fetchData = async () => {
            console.log(localStorage.getItem("jwtToken"))
            try {
                const res = await axios.get(`${API_URL}/t_check`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                console.log(res.statusText)

                if (res.statusText != "OK") {
                    // throw new Error(`Error fetching data: ${res.status}`);
                    router.push('/login');
                }


                console.log("El mensaje es: " + res.data.message)
                console.log("El nuevo token es: " + res.data.token)
                localStorage.setItem("jwtToken", res.data.token)
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');
                router.push('/login');
            }
        };

        fetchData();
        const ets = async () => {

            try {
                const res = await axios.get(`${API_URL}/home`);

                if (res.statusText != "OK") {
                    // throw new Error(`Error fetching data: ${res.status}`);
                    router.push('/login');
                }
                setObras(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');

            }
        };

        ets();
    }, []);


    const handleChange = (event: { target: { value: string } }) => {
        const nuevoValor = parseInt(event.target.value, 10); // Manejo de errores
        setNumFilas(isNaN(nuevoValor) ? 0 : nuevoValor); // Manejo de errores
    };


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('Token no encontrado o inválido. Por favor, inicie sesión.');
            return;
        }

        const formData = new FormData(event.currentTarget);
        formData.append('numDocs', String(formData.get('numDocs'))); // Ensure numeric value
        type FileInputElement = HTMLInputElement extends HTMLElement ? HTMLInputElement : never;

        for (let i = 1; i <= numFilas; i++) {
            formData.append(`fileCod${i}`, String(formData.get(`fileCod${i}`)));
            formData.append(`fileDesc${i}`, String(formData.get(`fileDesc${i}`)));
            formData.append(`fileRev${i}`, String(formData.get(`fileRev${i}`)));
            formData.append(`fileDate${i}`, String(formData.get(`fileDate${i}`)));

            const element: FileInputElement | null = event.currentTarget.elements[Number(`file${i}`)] as FileInputElement;
            if (element && element.files && element.files.length > 0) {
                formData.append('fileDoc', element.files[0]);
            } else {
                // Handle case where no file is selected (optional)
            }
        }

        try {
            const response = await axios.post(`${API_URL}/ingreso_docs`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.status);
            if (response.status=201){
                router.push("/home");
            }else{
                alert("Error al ingresar el documento");
                
            }
            // Handle successful submission (e.g., reset form, show success message)
        } catch (error) {
            console.error('Error:', error);
            setError('Error al enviar el formulario. Intente nuevamente.');
        }
    };


    return (
        <div className='flex flex-col justify-center items-center'>


            {/* <form className="flex flex-col items-center w-full space-y-1 bg-slate-100 p-1 text-sm shadow-xl"
                method="post"
                encType="multipart/form-data"
                action={`${API_URL}/ingreso_docs`} > */}
            <form className="flex flex-col items-center w-full space-y-1 bg-slate-100 p-1 text-sm shadow-xl"
                onSubmit={handleSubmit}
                encType="multipart/form-data">

                <div className='flex flex-col justify-center text-center items-center'>
                    <label htmlFor="numFilas">Número de Documentos:</label>
                    <input
                        className="bg-gray-50 border
                border-gray-300 
                text-gray-900 
                text-sm rounded-lg 
                mb-5
                focus:ring-blue-500 
                focus:border-blue-500 
                block 
                p-2.5 
                dark:bg-gray-100 
                dark:border-gray-600 
                dark:placeholder-gray-400 
                dark:text-gray-600
                dark:focus:ring-blue-500 
                dark:focus:border-blue-500 w-1/3"
                        type="number"
                        id="numFilas"
                        value={numFilas}
                        onChange={handleChange}
                        min="1" // Valor mínimo para el número de filas
                        name="numDocs"
                    />
                </div>
                <div className='mb-5 mt-5 flex flex-col justify-center text-center items-center'>
                    <label className='mt-2' htmlFor="obra">Selecciones una obra:</label>
                    <select
                        name="obra"
                        id="obra"
                        className="block w-full px-3 py-2 mt-2 border rounded-md bg-white max-w-sm"
                        value={obra}
                        onChange={(e) => setObra(e.target.value)}>

                        {obras.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}

                    </select>
                </div>
                <div>
                    {Array.from({ length: numFilas }, (_, i) => (
                        <div key={i} className='flex m-auto'>
                            {/* <label htmlFor={`fila${i + 1}`}>Fila {i + 1}:</label> */}
                            {/* <Input type="text" id={`fila${i + 1}`} /> */}
                            <Input type="text" name={`fileCod${i + 1}`} id={`fileCod${i + 1}`} placeholder="Código" required />
                            <Input type="text" name={`fileDesc${i + 1}`} id={`fileDesc${i + 1}`} placeholder="Descripción" required />
                            <Input type="text" name={`fileRev${i + 1}`} id={`fileRev${i + 1}`} placeholder="Revisión" required />
                            <Input type="date" name={`fileDate${i + 1}`} id={`fileDate${i + 1}`} placeholder="Última modificación" required />
                            <div className='flex w-full pr-2' >
                                <Input type="file" name="fileDoc" id={`file${i + 1}`} placeholder="Ingrese el archivo" accept='application/pdf' required />
                            </div>

                        </div>
                    ))}
                </div>
                <div className="flex space-x-2 items-center">
                    <div className='mt-4'>
                        {/* <Button variant="primary" >Ingresar</Button> */}
                        <button className='bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-sm font-semibold'>Ingresar</button>
                    </div>
                    <div className='mt-4'>
                        <Button variant="outline">
                            <Link href="/home" >Volver</Link>
                        </Button>
                    </div>
                </div>
            </form>
        </div >
    );
}

export default InputForm;

