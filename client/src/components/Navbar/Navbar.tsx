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
            <button>
                Logout
            </button>
        </nav>
    )
}