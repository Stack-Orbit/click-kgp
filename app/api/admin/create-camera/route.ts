import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    await prisma.camera.create({
        data: {
            name: body.name,
            serialNumber: body.serialNumber,
            holderId: session.user.id, // Assign to creator initially? Or null? Let's assign to creator to keep the "Always Held" rule.
            status: 'AVAILABLE'
        }
    });

    return NextResponse.json({ success: true });
}
