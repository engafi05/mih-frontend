import React from 'react';
import { CheckCircle2, Award, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AboutUsSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* الجزء الأيسر: الصور والتصميم البصري */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                            {/* يمكنك استبدال مصدر الصورة بصورة حقيقية للمستشفى لاحقاً */}
                            <div className="bg-slate-200 w-full h-[500px] flex items-center justify-center">
                                <Activity size={100} className="text-blue-600 opacity-20" />
                            </div>
                        </div>
                        
                        {/* بطاقة إحصائية عائمة */}
                        <div className="absolute -bottom-10 -right-10 bg-[#003366] p-8 rounded-[2.5rem] shadow-2xl z-20 hidden md:block border-4 border-white">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500 p-3 rounded-2xl">
                                    <Award className="text-white" size={30} />
                                </div>
                                <div>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">خبرة تمتد لـ</p>
                                    <p className="text-white text-3xl font-black">25+ عاماً</p>
                                </div>
                            </div>
                        </div>

                        {/* زخرفة خلفية */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-50 rounded-full -z-0 opacity-50"></div>
                    </div>

                    {/* الجزء الأيمن: المحتوى النصي */}
                    <div className="lg:w-1/2">
                        <div className="mb-8">
                            <span className="text-blue-600 font-black text-sm uppercase tracking-[0.3em] mb-4 block">
                                مرحباً بكم في مصر الدولى
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-[#003366] leading-tight mb-6">
                                رعاية طبية عالمية <br /> 
                                <span className="text-blue-600">بلمسة إنسانية</span>
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                في مستشفى مصر الدولى،، نجمع بين أحدث التقنيات الطبية في العالم وبين فريق من أمهر الاستشاريين لنقدم لك تجربة علاجية متكاملة تفوق التوقعات. رؤيتنا هي أن نكون المرجع الأول للرعاية الصحية المتميزة في المنطقة.
                            </p>
                        </div>

                        {/* نقاط القوة */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {[
                                "أحدث الأجهزة التشخيصية",
                                "رعاية طوارئ 24/7",
                                "نخبة من الأطباء العالميين",
                                "بيئة استشفاء فاخرة"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <CheckCircle2 className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-slate-800 font-bold">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/about" className="px-8 py-4 bg-[#003366] text-white rounded-2xl font-black text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                                اكتشف رؤيتنا
                            </Link>
                            <Link href="/contact" className="px-8 py-4 bg-white text-[#003366] border-2 border-[#003366] rounded-2xl font-black text-center hover:bg-slate-50 transition-all">
                                اتصل بنا
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}