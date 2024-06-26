import { headers } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { validateRequest } from './lib/validateRequest';

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/protected')) {
        try {
            const user = await validateRequest()
            if (user.id !== '') {
                return NextResponse.next();
            } else {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        } catch (error) {
            console.error('Error checking login status from middleware:', error);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
    
    

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}