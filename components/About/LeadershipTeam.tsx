// C:\MIH_Web\frontend\web-site\components\About/LeadershipTeam.tsx

import React from 'react';
import Image from 'next/image';
import { FaTwitter, FaLinkedin } from 'react-icons/fa';

const leaders = [
    { name: "أ.د. أحمد الشريف", title: "الرئيس التنفيذي", image: "/images/leader-1.jpg" },
    { name: "أ.د. محمد الشريف", title: "نائب الرئيس التنفيذى", image: "/images/leader-2.jpg" },
    { name: "أ. أشرف عدلى", title: "رئيس قطاع التخطيط", image: "/images/leader-4.jpg" },
    { name: "أ. محمد مسعود", title: "رئيس قطاع الماليه", image: "/images/leader-5.jpg" },
    { name: "م. أحمد فتحى", title: "رئيس قطاع تكنولوجيا المعلومات", image: "/images/leader-3.jpg" },
    { name: "د. محمود نجيب", title: "مدير الدخل للخدمات الطبيه", image: "/images/leader-6.jpg" },
    
];

const LeadershipTeam: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-sm font-semibold uppercase text-indigo-600 mb-2 tracking-widest">
            القيادة الحكيمة
        </h2>
        <h3 className="text-4xl font-extrabold text-gray-900 mb-12">
            فريق مصر الدولى التنفيذي
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-2xl">
              
              <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100">
                <Image
                  src={leader.image || "/images/default-person.png"} // **مطلوب:** صور شخصية للقيادات
                  alt={leader.name}
                  fill
                  sizes="33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h4>
              <p className="text-indigo-600 font-medium mb-3">{leader.title}</p>
              
              <div className="flex justify-center space-x-3 space-x-reverse text-gray-500">
                <a href="#" className="hover:text-indigo-600 transition"><FaLinkedin /></a>
                <a href="#" className="hover:text-indigo-600 transition"><FaTwitter /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;