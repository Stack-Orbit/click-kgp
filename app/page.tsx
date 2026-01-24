import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch Current User
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!currentUser) {
    // Session invalid?
    redirect('/login');
  }

  // Fetch Data
  const cameras = await prisma.camera.findMany({
    include: { holder: true },
    orderBy: { name: 'asc' }
  });

  const allUsers = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  // Serialization to avoid Date object issues in Client Components
  const serializedCameras = cameras.map(c => ({
    ...c,
    lastUpdate: c.lastUpdate.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar user={currentUser} />
      <div className="container mx-auto py-8">
        <header className="px-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Inventory Status</h1>
          <p className="text-gray-400">Manage camera assignment and availability in real-time.</p>
        </header>
        <Dashboard
          initialCameras={serializedCameras}
          currentUser={{ id: currentUser.id, name: currentUser.name }}
          allUsers={allUsers}
        />

        {currentUser.role === 'ADMIN' && (
          // Dynamic import would be better but this is fine for now
          <AdminPanelWrapper />
        )}
      </div>
    </main>
  );
}

import AdminPanel from '@/components/AdminPanel';

function AdminPanelWrapper() {
  return <AdminPanel />;
}
