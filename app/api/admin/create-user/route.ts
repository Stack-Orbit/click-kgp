import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const hashedPassword = await bcrypt.hash(body.password, 10);

        await prisma.user.create({
            data: {
                name: body.name,
                username: body.username,
                password: hashedPassword,
                role: body.role || 'USER',
            }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("Create User Error:", e);
        return NextResponse.json({ error: e.message || "Unknown Error" }, { status: 500 });
    }
}
