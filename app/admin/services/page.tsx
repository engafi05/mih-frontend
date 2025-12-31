'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Dynamically import the ServicesTable component with SSR disabled
const ServicesTable = dynamic(
  () => import('@/components/Admin/Services/ServicesTable'),
  { ssr: false }
);

export default function ServicesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsMounted(true);
    }
  }, [router]);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة الخدمات</h1>
      <ServicesTable />
    </div>
  );
}