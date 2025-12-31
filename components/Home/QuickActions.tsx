// C:\MIH_Web\frontend\web-site\components\Home\QuickActions.tsx

import React from 'react';
import { FaCalendarAlt, FaAmbulance, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import Link from 'next/link';

const actions = [
  { 
    icon: FaCalendarAlt, 
    title: "احجز موعداً", 
    description: "تحديد زيارة للعيادات الخارجية", 
    href: "#", 
    bgColor: "bg-red-500" 
  },
  { 
    icon: FaAmbulance, 
    title: "الطوارئ 24/7", 
    description: "للحالات الحرجة والمستعجلة", 
    href: "tel:16010", 
    bgColor: "bg-gray-700" 
  },
  { 
    icon: FaUserMd, 
    title: "ابحث عن طبيب", 
    description: "اطلع على فريق الأطباء المتخصص", 
    href: "/doctors", 
    bgColor: "bg-indigo-500" 
  },
  { 
    icon: FaMapMarkerAlt, 
    title: "تحديد الموقع", 
    description: "خريطة الوصول إلى المستشفى", 
    href: "#", 
    bgColor: "bg-green-500" 
  },
];

const QuickActions: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto -mt-20 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <Link 
            key={index} 
            href={action.href} 
            className={`${action.bgColor} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 block`}
          >
            <action.icon className="text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-1">{action.title}</h3>
            <p className="text-sm font-light">{action.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;