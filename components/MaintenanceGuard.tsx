'use client';

import { usePathname } from 'next/navigation';
import MaintenancePage from '@/app/maintenance/page';

export default function MaintenanceGuard({
    isMaintenance,
    isAdmin,
    children
}: {
    isMaintenance: boolean,
    isAdmin: boolean,
    children: React.ReactNode
}) {
    const pathname = usePathname();

    // If maintenance is OFF, update: render children
    if (!isMaintenance) return <>{children}</>;

    // If Admin, render children (they can see everything)
    if (isAdmin) return <>{children}</>;

    // If Maintenance ON and NOT Admin:

    // 1. Allow Login Page so Admin can log in
    if (pathname.startsWith('/login')) return <>{children}</>;

    // 2. Allow API routes (maybe needed for login?)
    if (pathname.startsWith('/api')) return <>{children}</>;

    // 3. Otherwise, block access and show Maintenance Page
    return <MaintenancePage />;
}
