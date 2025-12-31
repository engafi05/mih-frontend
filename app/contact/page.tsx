// C:\MIH_Web\frontend\web-site\app\contact\page.tsx

import React from 'react';
import ContactInfo from '@/components/Contact/ContactInfo';
import ContactForm from '@/components/Contact/ContactForm';
import ContactMap from '@/components/Contact/ContactMap';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* العنوان الرئيسي */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4">
          تواصل معنا
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          فريق مستشفى مصر الدولى مستعد للإجابة على جميع استفساراتكم ومساعدتكم في أي وقت.
        </p>
      </header>
      
      {/* 1. معلومات الاتصال (هاتف، بريد، عنوان) */}
      <ContactInfo />

      {/* 2. نموذج الاتصال والخريطة */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* نموذج الاتصال (الجزء الأيمن) */}
        <ContactForm />
        
        {/* الخريطة (الجزء الأيسر) */}
        <ContactMap />

      </div>
    </div>
  );
}