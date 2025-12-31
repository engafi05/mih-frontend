"use client";
import React, { useState } from 'react';
import { Search, UserRound, Calendar, Stethoscope } from 'lucide-react';
import BookingModal from '@/components/Home/BookingModal'; // تأكد من المسار الصحيح

export default function DoctorFilter({ doctors, specialties }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpec, setSelectedSpec] = useState('all');

    // --- حالات التحكم في النافذة المنبثقة ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

    const openBooking = (docId: number) => {
        setSelectedDoctorId(docId);
        setIsModalOpen(true);
    };

    const filtered = doctors?.filter((doc: any) => {
        const matchesSearch = doc.Name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpec = selectedSpec === 'all' || doc.SpecialtyID?.toString() === selectedSpec;
        return matchesSearch && matchesSpec;
    }) || [];

    return (
        <div>
            {/* شريط البحث والفلترة */}
            <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-blue-100/50 mb-12 -mt-20 relative z-30 flex flex-col md:flex-row gap-4 border border-slate-100">
                <div className="flex-1 relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="ابحث باسم الطبيب..." 
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="md:w-64 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-600 border-none cursor-pointer"
                    onChange={(e) => setSelectedSpec(e.target.value)}
                >
                    <option value="all">جميع التخصصات</option>
                    {specialties?.map((s: any) => (
                        <option key={s.SpecialtyID} value={s.SpecialtyID}>{s.SpecialtyName}</option>
                    ))}
                </select>
            </div>

            {/* شبكة عرض الأطباء */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filtered.map((doc: any) => (
                        <div key={doc.DoctorID} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
                            <div className="h-64 bg-slate-100 flex items-center justify-center relative shadow-inner">
                                {doc.ProfileImagePath ? (
                                    <img 
                                        src={`http://localhost:5000${doc.ProfileImagePath}`} 
                                        alt={doc.Name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                ) : (
                                    <UserRound size={80} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                )}
                                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                                    <Stethoscope size={12} />
                                    {doc.SpecialtyName}
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-xl font-black text-slate-800 mb-1">د. {doc.Name}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-6">{doc.Title || 'استشاري أول'}</p>
                                
                                {/* تصحيح الزر هنا */}
                                <button 
                                    onClick={() => openBooking(doc.DoctorID)}
                                    className="w-full py-4 bg-[#003366] text-white rounded-2xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <Calendar size={18} /> 
                                    <span>احجز موعدك الآن</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold text-lg">عذراً، لم نجد أطباء يطابقون بحثك حالياً</p>
                </div>
            )}

            {/* استدعاء المودال ليعمل داخل صفحة الأطباء أيضاً */}
            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                selectedDoctorId={selectedDoctorId} 
                doctors={doctors}
                specialties={specialties}
            />
        </div>
    );
}