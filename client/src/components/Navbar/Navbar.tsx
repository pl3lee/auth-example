import Link from "next/link"
import styles from "./Navbar.module.scss"
import { LogoutButton } from "./LogoutButton"
import { validateRequest } from "@/lib/validateRequest"



export const Navbar = async () => {
    const user = await validateRequest()
    return (
        <nav className={styles.root}>
            <Link href="/">
                Home
            </Link>
            {user.id && <Link href="/protected">
                Protected Route
            </Link>}
            {!user.id && <Link href="/login">
                Login
            </Link>}
            {!user.id && <Link href="/register">
                Register
            </Link>}
            {user.id && <p>Signed in as {user.username}</p>}
            {user.id && <LogoutButton />}
        </nav>
    )
}