// C:\MIH_Web\frontend\web-site\components\About\AboutBanner.tsx

import React from 'react';
import Image from 'next/image';

const AboutBanner: React.FC = () => {
  return (
    <section className="relative h-96 overflow-hidden">
      <Image
        src="/images/about-bg.jpg" // **مطلوب:** صورة بانر للمستشفى
        alt="بانر صفحة عن المستشفى"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        className="brightness-[0.6] transition duration-500"
        priority
      />

      <div className="absolute inset-0 flex items-center justify-center text-white bg-indigo-900/40">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 border-b-4 border-white pb-2 inline-block">
            عن مستشفى مصر الدولى
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto mt-4">
            نحن هنا لخدمتك: رعاية استثنائية مبنية على الثقة والجودة.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;