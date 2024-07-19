'use client'


import InputForm from "../../components/inputform";
import Image from "next/image";
import { Acme } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FormEvent } from "react";

const acme = Acme({
    weight: ["400"],
    style: ['normal'],
    subsets: ["latin"]

})

export default function ingreso() {
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const API_URL = process.env.API_URL;

    useEffect(() => {
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
                    router.push('/home')
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsAdmin(false);
                router.push('/login');
            }
        };

        fetchData();
    }, [])
    console.log(isAdmin)




    return (
        <div className="flex flex-col w-full items-center justify-center">
            <div>
                <Image
                    src="/lechuza.png"
                    alt="LechuCAO"
                    width="100"
                    height="100"

                />
            </div>
            <div className='flex justify-center w-full mb-10 text-4xl'>
                <h1 className={acme.className} >Ingreso de documentacion</h1>
            </div>
            <div className="flex flex-col w-full items-center justify-center">
                <InputForm />
            </div >




        </div >
    )
}