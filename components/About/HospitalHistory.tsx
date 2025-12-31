// C:\MIH_Web\frontend\web-site\components\About/HospitalHistory.tsx

import React from 'react';
import { FaCalendarAlt, FaStar, FaBuilding } from 'react-icons/fa';

const milestones = [
    { year: 1980, title: "التأسيس والرؤية", description: "وضع حجر الأساس للمستشفى برؤية ليكون مركزاً طبياً رائداً في المنطقة." , icon: FaBuilding},
    { year: 1983, title: "الافتتاح والتشغيل", description: "بدء استقبال المرضى وافتتاح الأقسام الرئيسية (الباطنية والجراحة).", icon: FaCalendarAlt},
    { year: 2010, title: "التوسع والاعتماد", description: "إضافة مركز القلب المتقدم والحصول على أول اعتماد دولي للجودة.", icon: FaStar},
    { year: 2025, title: "التحول الرقمي", description: "إطلاق نظام إدارة معلومات المستشفى (HIS) وتحسين تجربة المريض الرقمية.", icon: FaStar},
];

const HospitalHistory: React.FC = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase text-indigo-600 mb-2 tracking-widest">
                رحلتنا فى 
            </h2>
            <h3 className="text-4xl font-extrabold text-gray-900">
                مستشفى مصر الدولى: قصة التميز في الرعاية
            </h3>
        </div>

        {/* عرض التاريخ بأسلوب TimeLine بسيط */}
        <div className="relative">
            {/* الخط العمودي (التايم لاين) */}
            <div className="absolute hidden lg:block w-1 bg-indigo-200 h-full right-1/2 transform translate-x-1/2"></div>
            
            <div className="space-y-12">
                {milestones.map((item, index) => (
                    <div 
                        key={index} 
                        className={`flex flex-col lg:flex-row items-center w-full ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}
                    >
                        {/* النقطة الزمنية (التي تظهر في المنتصف على الشاشات الكبيرة) */}
                        <div className="hidden lg:flex w-1/2 justify-center absolute z-10">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center ring-8 ring-gray-100 shadow-xl">
                                <item.icon className="text-white text-xl" />
                            </div>
                        </div>

                        {/* المحتوى */}
                        <div 
                            className={`lg:w-[45%] p-6 bg-white rounded-lg shadow-xl border border-gray-200 transition duration-300 hover:shadow-2xl ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12 lg:text-right'}`}
                        >
                            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2 block">{item.year}</span>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default HospitalHistory;