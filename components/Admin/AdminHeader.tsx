// C:\MIH_Web\frontend\web-site\components\Admin\AdminHeader.tsx

import React from 'react';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const AdminHeader: React.FC = () => {
  // يجب إضافة منطق تسجيل الخروج هنا لاحقًا (useRouter, clear token)
  const handleLogout = () => {
      console.log("Logout clicked");
      // توجيه إلى صفحة تسجيل الدخول وإزالة الرمز المميز (Token)
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md border-b">
      <h1 className="text-2xl font-semibold text-gray-800">
        لوحة التحكم في مستشفى مصر الدولى
      </h1>
      
      <div className="flex items-center space-x-4 space-x-reverse">
        
        {/* معلومات المستخدم (وهمية حالياً) */}
        <div className="flex items-center space-x-2 space-x-reverse text-gray-700 hidden sm:flex">
          <FaUserCircle className="text-xl text-indigo-600" />
          <span className="font-medium">المسؤول (Admin)</span>
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition duration-150"
          title="تسجيل الخروج"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="hidden md:inline">تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;