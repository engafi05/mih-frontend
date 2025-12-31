// C:\MIH_Web\frontend\web-site\app\admin\layout.tsx (النسخة المحدثة)

'use client'; // 🛑 يجب أن يكون هذا المكون client component للتحقق من التوكن

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { FaLock, FaSpinner } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. التحقق من وجود التوكن
    const token = localStorage.getItem('admin_token');
    
    // 2. إذا لم يكن هناك توكن
    if (!token) {
      // إذا كنا بالفعل على صفحة تسجيل الدخول، لا تفعل شيئاً
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      setIsAuthenticated(false);
    } else {
      // 3. (ملاحظة: هنا يجب إضافة منطق التحقق من صلاحية التوكن عبر الـ Backend)
      // حالياً، سنفترض أن وجود التوكن يعني المصادقة
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, [pathname, router]);

  // إذا كنا في صفحة تسجيل الدخول، نعرضها مباشرة دون التخطيط
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // شاشة تحميل أثناء التحقق من التوكن
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  // إذا تم التحقق وعمل التوكن، اعرض لوحة التحكم
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100 rtl">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // إذا لم يتم المصادقة ويحاول الوصول لصفحة محمية (يجب أن يتم توجيهه لـ login)
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
      <FaLock className="text-2xl ml-2" />
      <span>غير مصرح لك بالدخول. جاري التوجيه لتسجيل الدخول...</span>
    </div>
  );
}