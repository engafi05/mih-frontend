// C:\MIH_Web\frontend\web-site\app\admin\login\page.tsx

import React from 'react';
import LoginForm from '@/components/Admin/LoginForm';
import { FaUserShield } from 'react-icons/fa';

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 rtl">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        
        {/* رأس الصفحة */}
        <header className="text-center mb-8">
          <FaUserShield className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            تسجيل الدخول للمسؤول
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            أدخل بيانات الاعتماد للوصول إلى لوحة التحكم
          </p>
        </header>

        {/* نموذج تسجيل الدخول */}
        <LoginForm />

      </div>
    </div>
  );
}