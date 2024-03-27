"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/login/password", {
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
                throw new Error("Invalid username or password");
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
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <label >Username</label>
                <input placeholder="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                <label >Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login