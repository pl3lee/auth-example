"use client"

import Link from "next/link"
import styles from "./Navbar.module.scss"
export const Navbar = () => {
    return (
        <nav className={styles.root}>
            <Link href="/">
                Home
            </Link>
            <Link href="/protected">
                Protected Route
            </Link>
            <Link href="/login">
                Login
            </Link>
            <Link href="/register">
                Register
            </Link>
            <button onClick={() => fetch("http://localhost:3001/logout", {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.ok) {
                    console.log("Logged out");
                }
            })}>
                Logout
            </button>
        </nav>
    )
}