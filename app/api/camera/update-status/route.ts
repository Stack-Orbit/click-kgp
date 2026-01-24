import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cameraId, status } = await request.json();

    if (status !== 'IN_USE' && status !== 'AVAILABLE') {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update
    await prisma.camera.update({
        where: { id: cameraId },
        data: {
            status: status,
            lastUpdate: new Date()
        }
    });

    return NextResponse.json({ success: true });
}
