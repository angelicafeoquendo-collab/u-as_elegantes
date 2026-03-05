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
    return (
        <div className= "min-h screen flex items-center Justify-center bg-pink-100">
        <form onSubmit= {handlelogin}

    )

}