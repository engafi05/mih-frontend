"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { X, User, Phone, Calendar, Clock, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import Select from 'react-select'; // مكتبة الـ Autocomplete

export default function BookingModal({ isOpen, onClose, selectedDoctorId, doctors, specialties }: any) {
    const [formData, setFormData] = useState({
        patientName: '',
        patientPhone: '',
        specialtyId: null as any,
        doctorId: null as any,
        appointmentDate: '',
        appointmentTime: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // تجهيز خيارات التخصصات للـ Autocomplete
    const specialtyOptions = useMemo(() => 
        specialties.map((s: any) => ({ value: s.SpecialtyID, label: s.SpecialtyName })), 
    [specialties]);

    // فلترة الأطباء بناءً على التخصص المختار
    const filteredDoctors = useMemo(() => {
        const docs = formData.specialtyId 
            ? doctors.filter((d: any) => d.SpecialtyID === formData.specialtyId.value)
            : doctors;
        return docs.map((d: any) => ({ value: d.DoctorID, label: d.Name }));
    }, [formData.specialtyId, doctors]);

    // تحديث البيانات إذا تم فتح المودال من زر طبيب معين
    useEffect(() => {
        if (selectedDoctorId) {
            const doc = doctors.find((d: any) => d.DoctorID === selectedDoctorId);
            if (doc) {
                setFormData(prev => ({
                    ...prev,
                    doctorId: { value: doc.DoctorID, label: doc.Name },
                    specialtyId: { value: doc.SpecialtyID, label: doc.SpecialtyName }
                }));
            }
        } else {
            setFormData({ patientName: '', patientPhone: '', specialtyId: null, doctorId: null, appointmentDate: '', appointmentTime: '' });
        }
    }, [selectedDoctorId, isOpen, doctors]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                PatientName: formData.patientName,
                PatientPhone: formData.patientPhone,
                DoctorID: formData.doctorId?.value,
                SpecialtyID: formData.specialtyId?.value,
                AppointmentDate: formData.appointmentDate,
                AppointmentTime: formData.appointmentTime
            };
            await axios.post('http://engafi05-001-site1.stempurl.com/api/public/bookings', payload);
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 3000);
        } catch (err) {
            alert("خطأ في الحجز");
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-red-500"><X size={30} /></button>
                
                {success ? (
                    <div className="text-center py-10">
                        <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black">تم الحجز بنجاح وسوف يتم التواصل معكم فى خلال 24 ساعه!</h2>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-2xl font-black text-center text-blue-900 mb-8">نموذج طلب حجز موعد طبي</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* الاسم والهاتف */}
                            <div className="space-y-2">
                                <label className="font-bold flex items-center gap-2"><User size={16}/> اسم المريض</label>
                                <input required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" 
                                    value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold flex items-center gap-2"><Phone size={16}/> رقم الهاتف</label>
                                <input required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" 
                                    value={formData.patientPhone} onChange={e => setFormData({...formData, patientPhone: e.target.value})} />
                            </div>

                            {/* التخصص (Autocomplete) */}
                            <div className="space-y-2">
                                <label className="font-bold">التخصص</label>
                                <Select 
                                    options={specialtyOptions}
                                    placeholder="ابحث عن تخصص..."
                                    isClearable
                                    value={formData.specialtyId}
                                    onChange={(opt: any) => setFormData({...formData, specialtyId: opt, doctorId: null})}
                                    className="react-select-container"
                                />
                            </div>

                            {/* الطبيب (Autocomplete - يتأثر بالتخصص) */}
                            <div className="space-y-2">
                                <label className="font-bold">الطبيب</label>
                                <Select 
                                    options={filteredDoctors}
                                    placeholder="ابحث عن طبيب..."
                                    noOptionsMessage={() => "اختر التخصص أولاً أو لا يوجد أطباء"}
                                    value={formData.doctorId}
                                    onChange={(opt: any) => setFormData({...formData, doctorId: opt})}
                                />
                            </div>

                            {/* التاريخ والوقت */}
                            <div className="space-y-2">
                                <label className="font-bold flex items-center gap-2"><Calendar size={16}/> التاريخ</label>
                                <input required type="date" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" 
                                    value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold flex items-center gap-2"><Clock size={16}/> الوقت</label>
                                <select required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                                    value={formData.appointmentTime} onChange={e => setFormData({...formData, appointmentTime: e.target.value})}>
                                    <option value="">اختر الوقت</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="06:00 PM">06:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <button disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-800 transition-all flex justify-center">
                            {loading ? <Loader2 className="animate-spin" /> : 'تأكيد طلب الحجز الآن'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}