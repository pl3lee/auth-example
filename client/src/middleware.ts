import { headers } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    try {
        const response = await fetch("http://localhost:3001/loggedin", {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await response.json(); // Now 'data' holds the resolved JSON object
        console.log(data);
    } catch (error) {
        console.log(error)
    }
    

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}