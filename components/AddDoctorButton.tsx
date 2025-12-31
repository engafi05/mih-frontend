// C:\MIH_Web\frontend\web-site\components\AddDoctorButton.tsx

"use client"; // <== تحويل هذا المكون إلى Client Component

import React from 'react';

export default function AddDoctorButton() {
    
    const handleAddClick = () => {
        // لاحقاً سنضع هنا منطق فتح النافذة المنبثقة لإضافة طبيب
        alert('زر إضافة طبيب جديد يعمل بنجاح! هنا سنضيف نافذة الإدخال.');
    };

    return (
        <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            onClick={handleAddClick} // الآن يمكننا استخدام onClick بأمان
        >
            + إضافة طبيب جديد
        </button>
    );
}