'use client'
import Button from "../components/button"
import Input from "@/app/components/input"
import { useRouter } from "next/navigation";
import { AwaitedReactNode, FormEvent, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import axios from "axios";


interface Documento {
    codigo: string;
    descripcion: string;
    revision: string;
    ultima_mod: string;
    link_doc: string;
}
export default function HomePage() {

    const [data, setData] = useState([]);
    const [docs, setDocs] = useState<Documento[]>([]);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useState({ code: "", desc: "", rev: "", date: "" });
    const router = useRouter();
    const API_URL = process.env.API_URL;
    useEffect(() => {
        const fetchData = async () => {
            console.log(localStorage.getItem("jwtToken"))
            try {
                const res = await axios.get(`${API_URL}/t_check`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                });
                console.log(res)
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
                setData(res.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data. Please try again.');

            }
        };

        ets();
    }, []);


    if (error) {
        router.push('/login');
    }
    const [obra, setObra] = useState("")
    const HandleSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("obra", obra);

        console.log(formData.get("obra"))

        try {
            const res = await axios.post(`${API_URL}/documentos/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            console.log(res)
            if (res.statusText.valueOf() != "OK") {
                throw new Error(`Login failed with status ${res.status}`);
            }

            setDocs(res.data)
            console.log(docs)
        } catch (error) {
            console.error('Login error:', error);
        }

    }


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value)
        setSearchParams(prevParams => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const filteredDocs = docs.filter(doc => {
        return (
            doc.codigo.toLowerCase().includes(searchParams.code.toLowerCase()) &&
            doc.descripcion.toLowerCase().includes(searchParams.desc.toLowerCase()) &&
            doc.revision.toLowerCase().includes(searchParams.rev.toLowerCase()) &&
            doc.ultima_mod.toLowerCase().includes(searchParams.date.toLowerCase())
        );
    });
    
    return (

        <>
            <div className="flex flex-col justify-center items-center mt-20   ">
                <form onSubmit={HandleSubmit} className="w-full max-w-sm bg-gray-100 p-10 border-gray-200 border-4">
                    <label htmlFor="obra"
                        className="block mb-2  font-medium">
                        Seleccione la obra
                    </label>
                    <select
                        name="obra"
                        id="obra"
                        className="block w-full px-3 py-2 border rounded-md bg-white"
                        value={obra}
                        onChange={(e) => setObra(e.target.value)}>
                            <option> -- Elija una Obra --</option>
                        {data.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}

                    </select>
                    <div className="flex justify-center mt-4">
                        {/* <Button variant="secondary">Buscar</Button> */}
                        <button className="bg-blue-500 p-2 rounded-sm text-white hover:font-bold">Buscar</button>
                    </div>
                </form>
            </div >
            <div className="flex justify-center items-center mt-5">
                <table className=" border-spacing-px border border-slate-500 text-center max-w-screen-2xl ">
                    <thead >
                        <tr className="border-separate">
                            <th className=" border border-slate-500 shadow-lg m-2 pl-2 pr-2">Codigo <br />
                                <Input name="code" id="code" type="text" placeholder="Buscar..."value={searchParams.code} onChange={handleSearch}/>
                            </th>
                            <th className=" border border-slate-500 shadow-lg pl-2 pr-2 ">Descripción <br />
                                <Input name="desc" id="desc" type="text" placeholder="Buscar..."value={searchParams.desc} onChange={handleSearch} />
                            </th>
                            <th className=" border border-slate-500 shadow-lg pl-2 pr-2 ">Revisión <br />
                                <Input name="rev" id="rev" type="text" placeholder="Buscar..." value={searchParams.rev} onChange={handleSearch}/>
                            </th>
                            <th className=" border border-slate-500 shadow-lg pl-2 pr-2 ">Última modificación <br />
                                <Input name="date" id="date" type="text" placeholder="Buscar..." value={searchParams.date} onChange={handleSearch}/>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map((item, index) => (
                            <tr key={index} className="hover:bg-slate-200 hover:shadow-sm">
                                <td className="pr-2 pl-2 border border-slate-300">{item["codigo"]}</td>
                                <td className="pr-2 pl-2 border border-slate-300">
                                    <a className="text-blue-500 hover:underline font-semibold" href={`http://localhost:8000/pdfs?pdf_link=${item['link_doc']}`} target="_blank">
                                        {item["descripcion"]}
                                    </a>
                                </td>
                                <td className="pr-2 pl-2 border border-slate-300">{item["revision"]}</td>
                                <td className="pr-2 pl-2 border border-slate-300">{item["ultima_mod"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
