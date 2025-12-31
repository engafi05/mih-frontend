"use client";
import React, { useState } from 'react';
import { X, User, Mail, Phone, Briefcase, Send, Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function JobModal({ isOpen, onClose, selectedJob }: any) {
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Phone: '',
        ExperienceYears: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://engafi05-001-site1.stempurl.com/api/public/apply', {
                ...formData,
                JobID: selectedJob.JobID
            });
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 3000);
        } catch (err) {
            alert("حدث خطأ أثناء التقديم");
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001F3F]/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-6 left-6 text-slate-400 hover:text-red-500"><X size={28} /></button>

                {success ? (
                    <div className="text-center py-10">
                        <CheckCircle size={80} className="text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black text-blue-900">تم إرسال طلبك بنجاح</h2>
                        <p className="text-slate-500 mt-2">سيتواصل معك فريق الموارد البشرية قريباً</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-[#001F3F]">التقديم لوظيفة</h3>
                            <p className="text-blue-600 font-bold">{selectedJob?.Title}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute right-4 top-4 text-slate-400" size={20} />
                                <input required placeholder="الاسم الكامل" className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                                    onChange={e => setFormData({...formData, FullName: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Mail className="absolute right-4 top-4 text-slate-400" size={20} />
                                <input required type="email" placeholder="البريد الإلكتروني" className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                                    onChange={e => setFormData({...formData, Email: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Phone className="absolute right-4 top-4 text-slate-400" size={20} />
                                <input required placeholder="رقم الهاتف" className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                                    onChange={e => setFormData({...formData, Phone: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute right-4 top-4 text-slate-400" size={20} />
                                <input required type="number" placeholder="سنوات الخبرة" className="w-full bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                                    onChange={e => setFormData({...formData, ExperienceYears: e.target.value})} />
                            </div>
                        </div>

                        <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#001F3F] transition-all">
                            {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> إرسال الطلب الآن</>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}