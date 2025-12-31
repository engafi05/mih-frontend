"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '@/components/Home/HeroSection';
import StatsSection from '@/components/Home/StatsSection';
import SuccessStories from '@/components/Home/SuccessStories';
import DoctorsPreview from '@/components/Home/DoctorsPreview';
import BookingModal from '@/components/Home/BookingModal';
import { Activity, Heart, Zap, Microscope, ShieldCheck, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://engafi05-001-site1.stempurl.com/api';

const IconMap: any = {
    Heart: <Heart size={32} />,
    Zap: <Zap size={32} />,
    Activity: <Activity size={32} />,
    Microscope: <Microscope size={32} />,
    ShieldCheck: <ShieldCheck size={32} />
};

export default function HomePage() {
    // تحديث الـ State ليشمل التخصصات
    const [data, setData] = useState({ 
        services: [], 
        doctors: [], 
        stories: [], 
        specialties: [] 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    // تأكد من تسمية المتغير selectedDoctorId ليتوافق مع الـ Props في المودال
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchSafe = async (endpoint: string) => {
            try {
                const res = await axios.get(`${API_BASE_URL}${endpoint}`);
                return res.data;
            } catch (e) {
                console.error(`Error loading ${endpoint}:`, e);
                return [];
            }
        };

        const loadAll = async () => {
            const [services, doctors, stories, specialties] = await Promise.all([
                fetchSafe('/public/home/services'),
                fetchSafe('/public/home/doctors'),
                fetchSafe('/public/stories'),
                fetchSafe('/public/specialties') // جلب التخصصات للفورمة الذكية
            ]);
            setData({ services, doctors, stories, specialties });
        };
        loadAll();
    }, []);

    const openBooking = (docId?: number) => {
        setSelectedDoctorId(docId);
        setIsModalOpen(true);
    };

    return (
        <main className="bg-white min-h-screen relative">
            {/* زر الحجز العائم */}
            <button 
                onClick={() => openBooking()} 
                className="fixed bottom-10 right-10 z-[60] bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-3 animate-bounce"
            >
                <Calendar size={24} />
                <span className="font-black">احجز موعدك الان</span>
            </button>

            {/* قسم الهيرو */}
            <HeroSection />

            {/* قسم الخدمات */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 text-center mb-16">
                    <h2 className="text-4xl font-black text-[#001F3F]">خدماتنا المتميزة</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.services.length > 0 ? data.services.map((service: any) => (
                        <div key={service.ServiceID} className="bg-white p-10 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {IconMap[service.IconName] || <Activity size={32} />}
                            </div>
                            <h3 className="text-2xl font-black text-[#001F3F] mb-4">{service.Title || service.ServicesName}</h3>
                            <p className="text-slate-500 leading-relaxed">{service.Description}</p>
                        </div>
                    )) : (
                        <p className="col-span-full text-center text-slate-400 font-bold">جاري تحميل الخدمات...</p>
                    )}
                </div>
            </section>

            {/* قسم الإحصائيات */}
            <StatsSection />

            {/* قسم قصص النجاح */}
            <SuccessStories stories={data.stories} />

            {/* قسم الأطباء */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center mb-16">
                    <h2 className="text-4xl font-black text-[#001F3F]">نخبة الأطباء</h2>
                    <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                </div>
                <DoctorsPreview doctors={data.doctors} onBookClick={openBooking} />
            </section>

            {/* نافذة الحجز المنبثقة */}
            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                selectedDoctorId={selectedDoctorId} 
                doctors={data.doctors}
                specialties={data.specialties}
            />
        </main>
    );
}