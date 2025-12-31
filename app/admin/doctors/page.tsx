// C:\MIH_Web\frontend\web-site\app\admin\doctors\page.tsx

import React from 'react';
import DoctorsTable from '@/components/Admin/Doctors/DoctorsTable';
import { FaUserMd } from 'react-icons/fa';

export default function AdminDoctorsPage() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <header className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUserMd className="ml-3 text-indigo-600" />
          إدارة الأطباء
        </h2>
      </header>
      
      <DoctorsTable />
    </div>
  );
}