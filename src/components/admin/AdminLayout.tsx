'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  showSearch?: boolean;
}

export default function AdminLayout({ 
  title, 
  children, 
  headerActions,
  showSearch = false 
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          actions={headerActions}
          showSearch={showSearch}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}