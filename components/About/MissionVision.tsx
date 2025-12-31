// C:\MIH_Web\frontend\web-site\components\About/MissionVision.tsx

import React from 'react';
import { FaEye, FaBullseye, FaHeart } from 'react-icons/fa';

const MissionVision: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-sm font-semibold uppercase text-indigo-600 mb-2 tracking-widest">
                جوهر عملنا
            </h2>
            <h3 className="text-4xl font-extrabold text-gray-900">
                رؤيتنا، رسالتنا، وقيمنا
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* الرؤية */}
            <div className="p-6 border-t-4 border-indigo-600 bg-gray-50 rounded-lg shadow-md">
                <FaEye className="text-4xl text-indigo-600 mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-3">رؤيتنا</h4>
                <p className="text-gray-600">
                    أن نكون المستشفى الرائد على مستوى المنطقة، والمعروف بتميزه في الرعاية المتخصصة والابتكار الطبي، ليصبح مصر الدولى الخيار الأول للمرضى.
                </p>
            </div>
            
            {/* الرسالة */}
            <div className="p-6 border-t-4 border-red-500 bg-gray-50 rounded-lg shadow-md">
                <FaBullseye className="text-4xl text-red-500 mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-3">رسالتنا</h4>
                <p className="text-gray-600">
                    توفير رعاية صحية عالية الجودة، تتمحور حول المريض، ويقدمها فريق من الخبراء ملتزم بالتعاطف، والشفافية، واستخدام أحدث التقنيات.
                </p>
            </div>
            
            {/* القيم */}
            <div className="p-6 border-t-4 border-green-500 bg-gray-50 rounded-lg shadow-md">
                <FaHeart className="text-4xl text-green-500 mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-3">قيمنا الأساسية</h4>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                    <li>الرعاية المتمركزة حول المريض.</li>
                    <li>النزاهة والشفافية.</li>
                    <li>الابتكار والتعلم المستمر.</li>
                    <li>العمل الجماعي والتعاطف.</li>
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;