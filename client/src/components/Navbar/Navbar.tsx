import Link from "next/link"
import styles from "./Navbar.module.scss"
import { LogoutButton } from "./LogoutButton"
import { getUser } from "@/lib/getUser"
import { revalidatePath } from "next/cache"



export const Navbar = async () => {
    const user = await getUser();
    revalidatePath('/', 'layout');
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
            {user.id && <LogoutButton />}
        </nav>
    )
}