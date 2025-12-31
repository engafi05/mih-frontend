"use client";
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Quote } from 'lucide-react';

export default function SuccessStories({ stories }: { stories: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!stories || stories.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % stories.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 text-center mb-16">
                <h2 className="text-4xl font-black text-[#001F3F]">تجارب نعتز بها</h2>
                <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-12">
                {/* الأزرار الجانبية */}
                <button onClick={prev} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                    <ChevronRight size={30} />
                </button>
                <button onClick={next} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                    <ChevronLeft size={30} />
                </button>

                {/* عرض القصة الحالية */}
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-900/5 border border-slate-100 flex flex-col items-center text-center animate-in slide-in-from-left duration-500">
                    <Quote className="text-blue-100 mb-6" size={60} fill="currentColor" />
                    <h3 className="text-3xl font-black text-[#001F3F] mb-6">{stories[currentIndex].Title}</h3>
                    <p className="text-xl text-slate-600 leading-relaxed italic mb-8 max-w-3xl">
                        "{stories[currentIndex].ShortExcerpt}"
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#003366] rounded-full flex items-center justify-center text-white font-black text-xl">
                            {stories[currentIndex].PatientName?.charAt(0)}
                        </div>
                        <div className="text-right">
                            <p className="font-black text-[#001F3F]">{stories[currentIndex].PatientName}</p>
                            <p className="text-sm text-blue-600 font-bold">قصة نجاح طبية</p>
                        </div>
                    </div>
                </div>
                
                {/* مؤشرات النقاط */}
                <div className="flex justify-center gap-2 mt-8">
                    {stories.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}></div>
                    ))}
                </div>
            </div>
        </section>
    );
}