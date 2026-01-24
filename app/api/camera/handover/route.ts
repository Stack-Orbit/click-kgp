import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cameraId, newHolderId } = await request.json();

    // Validate new holder exists
    const newHolder = await prisma.user.findUnique({
        where: { id: newHolderId }
    });

    if (!newHolder) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Perform Handover
    // We set status to IN_USE implicitly because the new person just got it? 
    // Or keep it as is? User said "mark that camera as available ... if someone hands over...".
    // Usually when you receive it, you start using it or holding it. Let's default to IN_USE or just keep previous status?
    // User said "he should easily able to upadate the status if someone hands over".
    // Let's assume Handover resets to IN_USE (or whatever the default busy state is) so the new person acknowledges it?
    // Let's set it to 'IN_USE' (Red) so they have to explicitly mark it 'Available' (Green) if they are just holding it.

    await prisma.camera.update({
        where: { id: cameraId },
        data: {
            holderId: newHolderId,
            status: 'IN_USE', // Reset to busy upon transfer
            lastUpdate: new Date()
        }
    });

    return NextResponse.json({ success: true });
}
