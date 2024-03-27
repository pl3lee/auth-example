"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleRegister = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/register/password", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);
                router.push("/")
                router.refresh()
            }).catch((error) => {
                console.error(error);
            })
    };
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label >Username</label>
                <input placeholder="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                <label >Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register