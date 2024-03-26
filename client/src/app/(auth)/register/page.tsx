"use client"

const Register = () => {
    const handleLogout = () => {
        window.location.href = "http://localhost:3001/logout";
    };
    return (
        <div>
            <h1>Register</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Register