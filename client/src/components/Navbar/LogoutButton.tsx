"use client";
import { useRouter } from "next/navigation";
export const LogoutButton = () => {
    const router = useRouter();
    return (
        <button onClick={() => fetch("http://localhost:3001/logout", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                console.log("Logged out");
                router.refresh()
            }
        })}>
            Logout
        </button>
    )
}