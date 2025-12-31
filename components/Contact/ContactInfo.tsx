// C:\MIH_Web\frontend\web-site\components\Contact/ContactInfo.tsx

import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const contactDetails = [
  { 
    icon: FaPhoneAlt, 
    title: "هاتف الطوارئ", 
    value: "16010", 
    description: "متاح 24 ساعة يومياً، 7 أيام في الأسبوع.", 
    color: "text-red-600" 
  },
  { 
    icon: FaEnvelope, 
    title: "البريد الإلكتروني", 
    value: "info@misrhospital.org", 
    description: "نرد على استفساراتكم في غضون 48 ساعة من أيام العمل الرسميه.", 
    color: "text-indigo-600" 
  },
  { 
    icon: FaMapMarkerAlt, 
    title: "العنوان", 
    value: "جمهورية مصر العربيه", 
    description: "شارع السراي، فيني، الدقي، محافظة الجيزة", 
    color: "text-green-600" 
  },
  { 
    icon: FaClock, 
    title: "أوقات العيادات", 
    value: "من 8:00 صباحاً - 10:00 مساءً", 
    description: "جميع أيام الأسبوع ", 
    color: "text-yellow-600" 
  },
];

const ContactInfo: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {contactDetails.map((detail, index) => (
        <div key={index} className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-xl transition duration-300">
          <detail.icon className={`text-4xl ${detail.color} mb-3`} />
          <h3 className="text-xl font-bold text-gray-900 mb-1">{detail.title}</h3>
          <p className="text-indigo-700 font-semibold mb-2">{detail.value}</p>
          <p className="text-sm text-gray-500">{detail.description}</p>
        </div>
      ))}
    </section>
  );
};

export default ContactInfo;