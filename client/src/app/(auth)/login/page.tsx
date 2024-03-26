"use client"

import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = (event) => {
        event.preventDefault();
        fetch("http://localhost:3001/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                res.json()
                console.log(res)
            })
            .then((data) => {
                console.log(data);
            });
    };
    return (
        <div>
            <h1>Login</h1>
            <form action="" method="POST">
                <label >Username</label>
                <input placeholder="username" type="text" onChange={(e) => setUsername(e.target.value)} value={username} />
                <label >Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                <button onClick={handleLogin}>Login</button>
            </form>
        </div>
    )
}

export default Login