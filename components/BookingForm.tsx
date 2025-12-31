"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Phone, ClipboardList, CheckCircle } from 'lucide-react';

export default function BookingForm() {
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        name: '', phone: '', specialtyId: '', doctorId: '', date: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // جلب التخصصات عند التحميل
        axios.get('http://engafi05-001-site1.stempurl.com/api/public/specialties').then(res => setSpecialties(res.data));
    }, []);

    const handleSpecialtyChange = (id: string) => {
        setFormData({ ...formData, specialtyId: id, doctorId: '' });
        // جلب أطباء هذا التخصص فقط
        axios.get(`http://engafi05-001-site1.stempurl.com/api/public/doctors?specialtyId=${id}`).then(res => setDoctors(res.data));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://engafi05-001-site1.stempurl.com/api/public/appointments', formData);
            setSubmitted(true);
        } catch (error) { alert("حدث خطأ أثناء الحجز، يرجى المحاولة لاحقاً."); }
    };

    if (submitted) return (
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-green-100">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />
            <h2 className="text-2xl font-black text-[#001F3F]">تم استلام طلب الحجز!</h2>
            <p className="text-slate-500 mt-2">سيتواصل معك فريقنا لتأكيد الموعد قريباً.</p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-50">
            <h2 className="text-3xl font-black text-[#001F3F] mb-8 text-center">احجز موعدك الآن</h2>
            
            <div className="space-y-6">
                {/* الاسم */}
                <div className="relative">
                    <User className="absolute right-4 top-4 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="الاسم الكامل" required
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                {/* الجوال */}
                <div className="relative">
                    <Phone className="absolute right-4 top-4 text-slate-400" size={20} />
                    <input 
                        type="tel" placeholder="رقم الجوال" required
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>

                {/* التخصص */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <ClipboardList className="absolute right-4 top-4 text-slate-400" size={20} />
                        <select 
                            required className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl appearance-none outline-none"
                            onChange={(e) => handleSpecialtyChange(e.target.value)}
                        >
                            <option value="">اختر التخصص</option>
                            {specialties.map((s: any) => <option key={s.SpecialtyID} value={s.SpecialtyID}>{s.Name}</option>)}
                        </select>
                    </div>

                    <div className="relative">
                        <User className="absolute right-4 top-4 text-slate-400" size={20} />
                        <select 
                            required className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl appearance-none outline-none"
                            onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                            disabled={!formData.specialtyId}
                        >
                            <option value="">اختر الطبيب</option>
                            {doctors.map((d: any) => <option key={d.DoctorID} value={d.DoctorID}>{d.Name}</option>)}
                        </select>
                    </div>
                </div>

                {/* التاريخ */}
                <div className="relative">
                    <Calendar className="absolute right-4 top-4 text-slate-400" size={20} />
                    <input 
                        type="date" required
                        className="w-full pr-12 pl-4 py-4 bg-slate-50 border-none rounded-2xl outline-none"
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                </div>

                <button type="submit" className="w-full bg-[#003366] text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                    تأكيد الحجز المبدئي
                </button>
            </div>
        </form>
    );
}