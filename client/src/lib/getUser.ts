import { headers } from 'next/headers'
import { User } from '@/types/User'
import { unstable_noStore as noStore } from 'next/cache';

export const getUser = async (): Promise<User> => {
    noStore();
    try {
        const response = await fetch("http://localhost:3001/username", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // need to explicitly get cookie here since this is on server side instead of client side
                "Cookie": headers().get("cookie") || "",
            },
        })
        if (response.ok) {
            const data = await response.json();
            return data as User;
        } else {
            console.error('Unauthorized');
            return { id: '', username: '' };
        }
    } catch (error) {
        console.error('Error checking login status from getUser:', error);
        return { id: '', username: '' };
    }
    
}