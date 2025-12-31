// C:\MIH_Web\frontend\web-site\components\DoctorCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserMd, FaStar, FaCalendarCheck } from 'react-icons/fa';

// تعريف النوع هنا (للتوضيح)
interface DoctorData {
    DoctorID: number;
    Name: string;
    Title: string;
    ExperienceYears: number;
    SpecialtyName: string;
    ProfileImagePath: string | null;
    AppointmentLink: string | null;
}

interface DoctorCardProps {
    doctor: DoctorData;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    
    // صورة افتراضية في حالة عدم وجود مسار صورة
    const defaultImage = "/images/default-doctor.png"; 
    // **تنبيه:** يجب التأكد من وجود هذه الصورة في مجلد public/images 
    // أو استخدم أي صورة متاحة لديك.

    // مسار الصورة (يجب أن يكون المسار كاملاً إذا كان من DB)
    const imagePath = doctor.ProfileImagePath || defaultImage; 

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
            <div className="relative h-60 w-full">
                {/* هنا نستخدم مكون الصورة الخاص بـ Next.js */}
                <Image 
                    src={imagePath}
                    alt={`صورة الدكتور ${doctor.Name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition duration-500 group-hover:scale-105"
                    priority={false} // لا يتطلب التحميل الفوري
                />
            </div>

            <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.Name}
                </h3>
                <p className="text-md text-indigo-600 font-semibold mb-2">
                    {doctor.Title}
                </p>
                
                <div className="flex items-center justify-center text-sm text-gray-600 mb-3 space-x-2 space-x-reverse">
                    <FaUserMd className="text-indigo-500" />
                    <span>{doctor.SpecialtyName}</span>
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4 space-x-2 space-x-reverse">
                    <FaStar className="text-yellow-500" />
                    <span>{doctor.ExperienceYears} سنة خبرة</span>
                </div>

                <Link 
                    href={`/doctors/${doctor.DoctorID}`}
                    className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-lg transition duration-300 w-full"
                >
                    عرض الملف الشخصي
                </Link>
                
                {doctor.AppointmentLink && (
                    <a 
                        href={doctor.AppointmentLink} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center mt-3 bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 w-full space-x-2 space-x-reverse"
                    >
                         <FaCalendarCheck />
                         <span>احجز الآن</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;