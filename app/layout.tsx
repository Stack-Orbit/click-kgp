import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth';
import MaintenanceGuard from '@/components/MaintenanceGuard';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Click KGP - Camera Tracking',
  description: 'Equipment tracking system for Click KGP',
}

// Prevent caching so maintenance mode updates immediately
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check Maintenance Mode
  const maintenanceSetting = await prisma.systemSettings.findUnique({
    where: { key: 'maintenance_mode' }
  }).catch(() => null);

  const isMaintenanceMode = maintenanceSetting?.value === 'true';

  // Check Admin
  let isAdmin = false;
  const session = cookies().get('session')?.value;
  if (session) {
    const payload = await decrypt(session);
    if (payload?.role === 'ADMIN') {
      isAdmin = true;
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <MaintenanceGuard isMaintenance={isMaintenanceMode} isAdmin={isAdmin}>
          {children}
        </MaintenanceGuard>
      </body>
    </html>
  )
}
