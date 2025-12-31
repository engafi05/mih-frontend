// C:\MIH_Web\frontend\web-site\components/About/QualityAccreditations.tsx

import React from 'react';
import { FaCertificate, FaHandshake, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

const accreditations = [
   // { name: "JCI - Joint Commission International", logo: "/images/logo-jci.png" },
    { name: "GAHAR - الهيئة العامة للاعتماد والرقابة الصحية ", logo: "/images/logo-ghahar.jpg" },
    { name: "ISO 9001 - شهادة إدارة الجودة", logo: "/images/logo-iso.jpg" },
    { name: "A.H.A - جمعية القلب الأمريكيه ", logo: "/images/logo-aha.jpg" },
    { name: "E.H.C - المجلس الصحى المصرى", logo: "/images/logo-ehc.jpg" },
];

const QualityAccreditations: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* الجزء الأيمن: النص والرسالة */}
            <div className="lg:w-1/2">
                <h2 className="text-sm font-semibold uppercase text-indigo-600 mb-2 tracking-widest">
                    ثقتك هي هدفنا
                </h2>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-6 leading-snug">
                    الالتزام بأعلى معايير الجودة العالمية
                </h3>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    نحن في مستشفى مصر الدولى نضع الجودة وسلامة المريض في صدارة أولوياتنا. نحمل بفخر العديد من شهادات الاعتماد المحلية والدولية التي تؤكد التزامنا بتطبيق أفضل الممارسات الصحية.
                </p>
                <div className="flex items-center text-indigo-600 font-semibold text-lg space-x-3 space-x-reverse">
                    <FaCertificate />
                    <span>لأن صحتك لا تقبل المساومة.</span>
                </div>
            </div>

            {/* الجزء الأيسر: الشعارات */}
            <div className="lg:w-1/2 grid grid-cols-3 gap-6 p-4 border rounded-xl bg-white shadow-xl">
                {accreditations.map((acc, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-2">
                            {/* يمكن استبدال هذه الصورة بشعار حقيقي في public/images */}
                             <Image 
                                src={acc.logo || "/images/default-accreditation.png"}
                                alt={acc.name}
                                fill
                                sizes="25vw"
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <p className="text-center text-xs font-medium text-gray-600 mt-2">{acc.name}</p>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
};

export default QualityAccreditations;