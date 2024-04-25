import { headers } from 'next/headers'
import { User } from '@/types/User'
import { unstable_noStore as noStore } from 'next/cache';

export const validateRequest = async (): Promise<User> => {
    noStore();
    try {
        const response = await fetch("http://localhost:3001/validate", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // need to explicitly get cookie here since this is on server side instead of client side
                "Cookie": headers().get("cookie") || "",
            },
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return data.user as User;
        } else {
            console.error('Unauthorized');
            return { id: '', username: '' };
        }
    } catch (error) {
        console.error('Error checking login status from getUser:', error);
        return { id: '', username: '' };
    }
    
}