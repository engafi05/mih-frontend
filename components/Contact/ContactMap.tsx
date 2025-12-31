// C:\MIH_Web\frontend\web-site\components\Contact/ContactMap.tsx

import React from 'react';
import { FaWhatsapp, FaPhoneAlt, FaDirections } from 'react-icons/fa';

const ContactMap: React.FC = () => {
  // الرابط الرسمي الذي استخرجته من كود التضمين الخاص بك
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.332308722744!2d31.216666!3d30.033333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145846cd31191a37%3A0x28031d27931c8d55!2sEgypt%20International%20Hospital!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg";
  
  // رابط فتح الموقع في تطبيق الخرائط
  const googleMapsLink = "https://maps.app.goo.gl/BC2mTzaupFS6HUQk9"; // يفضل استبداله برابط Google Maps الفعلي للمستشفى

  return (
    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100" dir="rtl">
      {/* رأس القسم: العنوان وأزرار التواصل */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 leading-tight">موقعنا الجغرافي</h2>
          <p className="text-slate-500 font-medium mt-1">مستشفى مصر الدولي - الدقي</p>
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <a 
            href="tel:01118011563" 
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-6 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <FaPhoneAlt />
            <span>اتصال هاتفي</span>
          </a>
          <a 
            href="https://wa.me/201118011563" 
            target="_blank"
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-emerald-500 text-white py-3 px-6 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            <FaWhatsapp size={20} />
            <span>واتساب</span>
          </a>
        </div>
      </div>
      
      {/* حاوية الخريطة */}
      <div className="relative w-full h-[450px] rounded-[2rem] shadow-inner overflow-hidden group border-8 border-slate-50 bg-slate-100">
        
        {/* الخريطة التفاعلية */}
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Egypt International Hospital Location"
          className="grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000 ease-out"
        ></iframe>

        {/* طبقة حماية/نقر شفافة */}
        <a 
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 bg-black/0 cursor-pointer"
          title="افتح الموقع في خرائط جوجل"
        ></a>

        {/* زر الاتجاهات العائم */}
        <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur text-slate-900 py-4 px-8 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-4 border border-white transform group-hover:-translate-y-2 transition-all duration-500">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <FaDirections size={24} />
            </div>
            <div className="text-right">
              <span className="block text-xs text-slate-500 font-bold">احصل على</span>
              <span className="text-sm lg:text-base">اتجاهات السير عبر Google Maps</span>
            </div>
          </div>
        </div>
      </div>

      {/* تفاصيل العنوان */}
      <div className="mt-8 flex flex-col lg:flex-row gap-4 lg:items-center justify-between text-slate-600 p-2">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600">📍</span>
          <span className="font-bold text-sm lg:text-base">شارع السراي، فيني، الدقي، محافظة الجيزة</span>
        </div>
        <div className="text-xs font-bold text-slate-400 border-r-2 pr-4 border-slate-200">
          يعمل قسم الطوارئ 24 ساعة طوال أيام الأسبوع
        </div>
      </div>
    </div>
  );
};

export default ContactMap;