import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session');

    // Refresh session if exists
    await updateSession(request);

    if (!session && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/setup')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
