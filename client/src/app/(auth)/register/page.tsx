"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleRegister = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/sign-up", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                res.json()
                router.push("/login")
            })
            .then((data) => {
                console.log(data);
            });
    };
    return (
        <div>
            <h1>Register</h1>
            <form action="" method="POST">
                <label >Username</label>
                <input placeholder="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                <label >Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button onClick={handleRegister}>Register</button>
            </form>
        </div>
    )
}

export default Register