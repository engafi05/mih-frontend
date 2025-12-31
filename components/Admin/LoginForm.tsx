'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';
import Cookies from 'js-cookie'; // تثبيت: npm install js-cookie @types/js-cookie

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://engafi05-001-site1.stempurl.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'فشل الدخول');

            // 1. تخزين في الكوكيز للـ Middleware (Edge Runtime)
            const expiry = 1/3; // 8 ساعات
            Cookies.set('authToken', data.token, { expires: expiry });
            Cookies.set('userRole', data.user.role, { expires: expiry });
            Cookies.set('user_allowed_pages', data.user.allowedPages, { expires: expiry });

            // 2. تخزين في LocalStorage للـ Sidebar ومكونات المتصفح
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('user_role', data.user.role);
            localStorage.setItem('user_allowed_pages', data.user.allowedPages);

            router.push('/admin');
            router.refresh(); // لضمان تحديث الـ Middleware للحالة
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-indigo-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-indigo-500" required />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                {loading ? <FaSpinner className="animate-spin ml-2" /> : <FaSignInAlt className="ml-2" />}
                تسجيل الدخول
            </button>
        </form>
    );
};
export default LoginForm;