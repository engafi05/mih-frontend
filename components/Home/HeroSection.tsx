import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, Search } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-[650px] md:h-[800px] w-full overflow-hidden">
      {/* صورة الخلفية مع Overlay متدرج للفخامة */}
      <div className="absolute inset-0 z-0">
 	<Image
       	 src="/images/hero-bg.jpg" // **مطلوب:** ضع صورة خلفية جذابة هنا (في public/images)
        	alt="صورة خلفية للمستشفى"
        	fill
        	sizes="100vw"
        	style={{ objectFit: 'cover' }}
        	className="brightness-[0.7] transition duration-500"
      	  	priority
     	 />
        {/* تدرج لوني لجعل النص واضحاً وفخماً */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#001f3f]/80 via-[#001f3f]/40 to-transparent" />
      </div>

      {/* المحتوى النصي */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="max-w-3xl text-right">
          <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-black mb-6 animate-fade-in">
            رعاية طبية تفوق التوقعات
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            نعتني بك... <br /> 
            <span className="text-blue-400 font-light italic">بأحدث التقنيات</span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-50 font-medium mb-10 max-w-xl leading-relaxed opacity-90">
            مستشفى مصر الدولى : نجمع بين الخبرة العالمية وأحدث الابتكارات الطبية لتقديم رعاية صحية متكاملة تليق بك وبعائلتك.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-start">
            <Link 
              href="/doctors" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-blue-600/30 transition-all flex items-center gap-2 group"
            >
              <Search size={20} />
              ابحث عن طبيبك
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/contact" 
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-black py-4 px-10 rounded-2xl hover:bg-white/20 transition-all"
            >
              اتصل بنا
            </Link>
          </div>

          {/* أرقام سريعة أسفل الهيرو (اختياري) */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-r-2 border-blue-500/30 pr-8">
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">+200</div>
              <div className="text-blue-200 text-xs font-bold">طبيب بين أستاذ وإستشاري</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">+50</div>
              <div className="text-blue-200 text-xs font-bold">قسم متخصص</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">24/7</div>
              <div className="text-blue-200 text-xs font-bold">رعاية طارئة</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">300</div>
              <div className="text-blue-200 text-xs font-bold">سرير تنويم مجهز</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">79</div>
              <div className="text-blue-200 text-xs font-bold">سرير عناية مركزه</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl tracking-tighter">11</div>
              <div className="text-blue-200 text-xs font-bold">غرف علميات مجهزة لجميع أنواع العمليات</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;