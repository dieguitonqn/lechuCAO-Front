"use client"
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Navbar = () => {
    const [nav, setNav] = useState(false);

    const[isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const API_URL = process.env.API_URL;

    useEffect( ()=> {
        const fetchData = async () => {
            console.log(localStorage.getItem("jwtToken"))
            try {
                const res = await axios.get(`${API_URL}/t_admin_check`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                console.log(res.statusText)

                if (res.status != 202) {
                    // throw new Error(`Error fetching data: ${res.status}`);
                    setIsAdmin(false)
                }else{
                setIsAdmin(true)
                console.log(isAdmin)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsAdmin(false);
                router.push('/login');
            }
        };

        fetchData();
    },[])
    console.log(isAdmin)


    return (
        <div className="bg-white shadow-md w-full fixed top-0 z-50  " >
            <div className="container mx-auto flex items-center justify-between h-16">
                <div className="flex items-center">
                    <Image
                        src="/lechuza.png"
                        alt="LechuCAO"
                        width="50"
                        height="50"

                    />

                    <Link href="/home" className="text-2xl font-bold text-gray-800 hover:text-blue-500 ml-2">
                        LechuCAO
                    </Link>




                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {isAdmin && (
                        <Link href="/home/ingreso" className="px-4 py-2 rounded-sm bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-blue-500">
                        Ingreso de documentación
                    </Link>
                    )}
                    

                    <Link href="/login" className="px-4 py-2 rounded-sm bg-red-500 text-white hover:bg-red-600 hover:font-semibold">
                        Cerrar sesión
                    </Link>
                </div>

                <button className="md:hidden block p-2">
                    {nav ? <FaTimes onClick={() => setNav(!nav)} /> : <FaBars onClick={() => setNav(!nav)} />}
                </button>

                {nav && (
                    <div className="md:hidden bg-white shadow-md absolute top-full w-full z-10">
                        <div className="container mx-auto flex flex-col items-center mt-4">
                            <Link href="/" className="text-lg font-medium text-gray-800 hover:text-blue-500">
                                Inicio
                            </Link>
                            { isAdmin && (
                            <Link href="/ingreso" className="mt-2 text-lg font-medium text-gray-800 hover:text-blue-500">
                                Ingreso de documentación
                            </Link>
                            )}
                            <button className="mt-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Cerrar sesión</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
