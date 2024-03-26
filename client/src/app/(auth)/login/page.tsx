"use client"

const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:3001/login";
    };
    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login