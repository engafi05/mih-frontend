// C:\MIH_Web\frontend\web-site\app\admin\specialties\page.tsx

import React from 'react';
import SpecialtiesTable from '@/components/Admin/Specialties/SpecialtiesTable';
import { FaHospitalSymbol } from 'react-icons/fa';

export default function AdminSpecialtiesPage() {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <header className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaHospitalSymbol className="ml-3 text-indigo-600" />
          إدارة التخصصات
        </h2>
        {/* سيتم إضافة زر "إضافة تخصص جديد" هنا لاحقًا */}
      </header>
      
      {/* الجدول والمكونات الفعلية لإدارة التخصصات */}
      <SpecialtiesTable />
    </div>
  );
}