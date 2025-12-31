'use client';

import React, { useState } from 'react';
import axios from 'axios'; // استيراد أكسيوس

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
        // إرسال البيانات الفعلي إلى Backend
        const response = await axios.post('http://engafi05-001-site1.stempurl.com/api/public/contact', formData);

        if (response.status === 200) {
            setSubmitStatus('success');
            // تفريغ النموذج بعد النجاح
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 transform transition-all">
      <h2 className="text-3xl font-black text-[#001F3F] mb-6">أرسل لنا رسالة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* الاسم */}
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">الاسم الكامل</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        {/* البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* الموضوع */}
        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-1">الموضوع</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        {/* الرسالة */}
        <div>
          <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-1">الرسالة</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        {/* رسائل الحالة */}
        {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl font-bold text-center border border-green-100 animate-in fade-in duration-500">
                تم استلام رسالتك بنجاح! سنرد عليك قريباً.
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl font-bold text-center border border-red-100">
                حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى لاحقاً.
            </div>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#001F3F] text-white font-black py-4 rounded-xl hover:bg-blue-600 transition duration-300 disabled:bg-slate-400 shadow-lg shadow-blue-900/10"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;