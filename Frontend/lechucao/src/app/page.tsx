// import Image from "next/image";
'use client'
import Image from "next/image"


export default function Home() {
  return (
    <div className="bg-slate-200 flex flex-col justify-center items-center h-screen p-5 align-middle">
      <div className=" bg-slate-50 p-6 justify-center text-center shadow-lg rounded-sm  ">
        <div className="flex justify-center">
          <Image
            src="/lechuza.png"
            alt="LechuCAO"
            width="500"
            height="500"
          />
        </div>
        <div className="justify-center align-middle text-center">
          <h1 className="text-4xl font-bold mb-5">Bienvenido a LechuCAO</h1>
        </div>
        <div className="mb-5 text-slate-700 text-xl">
          <p>Tu sistema de consulta de documentos y planos de obras.</p>
        </div>

        <div className="flex flex-row justify-between gap-5 w-full">
          {/* <Button >Sign In</Button> */}
          <div className="flex w-full">
            <button
              className="flex justify-center bg-green-600 rounded-sm p-2  w-full text-white font-semibold"
              onClick={(e) => location.href = "/login"}>Login</button>
          </div>
          <div className="flex w-full">
            <button
              className=" bg-blue-500 rounded-sm p-2 w-full  text-white  font-semibold"
              onClick={(e) => location.href = "https://lechuza.epen.gov.ar/lechuza/registro.php"}>Registrarse</button>
          </div>

        </div>
      </div>
    </div>
  )
}