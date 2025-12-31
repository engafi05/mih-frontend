import React from 'react';
import axios from 'axios';
import DoctorFilter from './DoctorFilter'; // تأكد أن ملف الفلترة موجود في نفس المجلد

const API_BASE_URL = 'http://engafi05-001-site1.stempurl.com/api';

async function getDoctorsData() {
    try {
        // جلب البيانات من المسارات العامة التي أضفناها للسيرفر
        const [docsRes, specsRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/public/doctors`),
            axios.get(`${API_BASE_URL}/public/specialties`)
        ]);

        return {
            doctors: docsRes.data || [],
            specialties: specsRes.data || []
        };
    } catch (error) {
        console.error("Error fetching doctors data:", error);
        return { doctors: [], specialties: [] };
    }
}

export default async function DoctorsPage() {
    const { doctors, specialties } = await getDoctorsData();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* الجزء العلوي - Banner */}
            <div className="bg-[#003366] text-white py-24 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute transform -rotate-45 -left-20 -top-20 w-80 h-80 bg-white rounded-full"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter">فريقنا الطبي</h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
                        نخبة من أمهر الأطباء والاستشاريين مكرسون لتقديم أفضل رعاية صحية لك ولعائلتك
                    </p>
                </div>
            </div>

            {/* قسم الفلترة وعرض الأطباء */}
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <DoctorFilter doctors={doctors} specialties={specialties} />
            </div>
        </div>
    );
}