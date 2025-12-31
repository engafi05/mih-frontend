"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // عنوان API تسجيل الدخول
  const LOGIN_API_URL = 'http://engafi05-001-site1.stempurl.com/api/auth/login'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
        setError('الرجاء إدخال اسم المستخدم وكلمة المرور.');
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post(LOGIN_API_URL, {
        username,
        password // تم التعديل لإرسال كلمة المرور التي يكتبها المستخدم فعلياً
      });

      // ... داخل try بعد الـ axios.post
const { token, user } = response.data; // استلام الكائن user بالكامل

      // 1. تخزين البيانات في الكوكيز لسهولة الوصول إليها من Middleware
     const cookieConfig = { expires: 1/3 }; // 8 ساعات
      
Cookies.set('authToken', token, cookieConfig);
Cookies.set('userRole', user.role, cookieConfig);
      // 2. تخزين الصلاحيات (مهم جداً للـ Sidebar والتحكم في الصفحات)
Cookies.set('user_allowed_pages', user.allowedPages, cookieConfig);

      // 2. تخزين الصلاحيات (مهم جداً للـ Sidebar والتحكم في الصفحات)
    
      
      // أيضاً تخزينهم في LocalStorage كدعم إضافي للـ Components التي تستخدمه
localStorage.setItem('admin_token', token);
localStorage.setItem('user_role', user.role);
localStorage.setItem('user_allowed_pages', user.allowedPages);

      // 3. إعادة التوجيه إلى لوحة الإدارة
      router.push('/admin'); 

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'فشل تسجيل الدخول. تأكد من صحة البيانات وحالة السيرفر.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 text-right" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-indigo-700">دخول الإدارة</h2>
          <p className="text-gray-500 text-sm">مجموعة المعاهد الطبية - لوحة التحكم</p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all shadow-lg shadow-indigo-100 ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحقق...
              </span>
            ) : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">نظام إدارة المحتوى الخاص بمجموعة MIH © 2025</p>
        </div>
      </div>
    </div>
  );
}