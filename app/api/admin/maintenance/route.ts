import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';

export async function GET() {
    try {
        const setting = await prisma.systemSettings.findUnique({
            where: { key: 'maintenance_mode' }
        });
        return NextResponse.json({ enabled: setting?.value === 'true' });
    } catch (error) {
        // Fallback if table doesn't exist yet
        return NextResponse.json({ enabled: false });
    }
}

export async function POST(request: Request) {
    // Verify Admin
    const session = cookies().get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await decrypt(session);
    if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // Toggle Logic
        const current = await prisma.systemSettings.findUnique({
            where: { key: 'maintenance_mode' }
        });

        const newValue = current?.value === 'true' ? 'false' : 'true';

        await prisma.systemSettings.upsert({
            where: { key: 'maintenance_mode' },
            update: { value: newValue },
            create: { key: 'maintenance_mode', value: newValue }
        });

        return NextResponse.json({ success: true, enabled: newValue === 'true' });
    } catch (error) {
        console.error("Maintenance Toggle Error:", error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
