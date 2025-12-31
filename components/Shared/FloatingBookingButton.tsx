"use client";
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import BookingModal from '@/components/Home/BookingModal';
import axios from 'axios';

export default function FloatingBookingButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState({ doctors: [], specialties: [] });

    // جلب البيانات اللازمة للمودال ليعمل في أي صفحة
    useEffect(() => {
        const loadData = async () => {
            try {
                const [docsRes, specRes] = await Promise.all([
                    axios.get('http://engafi05-001-site1.stempurl.com/api/public/doctors'),
                    axios.get('http://engafi05-001-site1.stempurl.com/api/public/specialties')
                ]);
                setData({ doctors: docsRes.data, specialties: specRes.data });
            } catch (err) {
                console.error("Error loading modal data:", err);
            }
        };
        loadData();
    }, []);

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="fixed bottom-10 right-10 z-[100] bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 hover:bg-[#001F3F] transition-all flex items-center gap-3 animate-bounce border-4 border-white"
            >
                <Calendar size={24} />
                <span className="font-black">احجز موعدك الان</span>
            </button>

            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                doctors={data.doctors}
                specialties={data.specialties}
            />
        </>
    );
}