import { useState } from "react";
import {supabase} from "../lib /"supabaseclient"

  export default function login() {
    const [email,setEmail]= useState(" ")
    const [password, setPassword] = useState (" ")

    const handlelogin= async (e) => {
        e.preventDefault ()
        const {error} = await 
        supabase.auth.signInwithpassword ( {
            email,
            password,
        } )
        if (error) alert (error=message)
        
    }
    return 
        <div className= "min-h screen flex items-center Justify-center bg-pink-100">
         <form onSubmit= {handlelogin}
         className="bg-white p-6 rounded shadow-md w-80"
       >

        <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
          Spa de Uñas Elegantes
        </h2>
         
        {errorMensaje && (
          <p className="text-red-500 text-sm mb-3">
            {errorMensaje}
          </p>
        )}

        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-pink-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text - sm mt-3 text-center">
            ¿no tienes cuenta?
             <a href="/register" className="text-pink-600">
                Registrarse<a/a>
                </p>

      </form>

    </div>
   }
   

