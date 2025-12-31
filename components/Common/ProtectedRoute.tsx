"use client";
import React, { useState, useEffect } from 'react'; 
import { useRouter, usePathname } from 'next/navigation'; // تصحيح الاستيراد

// @ts-ignore
import { checkPermission } from '../../utils/permissions'; 

const ProtectedRoute = ({ children, requiredPermission = 'view' }: any) => {
    const router = useRouter();
    const pathname = usePathname(); // للحصول على المسار الحالي في Next.js الجديد
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                // ملاحظة: تأكد أن هذا الرابط يعمل على الباكيند الجديد الخاص بك
                const response = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Unauthorized');
                
                const userData = await response.json();
                setUser(userData);
                
                // استخدام pathname بدلاً من router.pathname
                const hasPermission = checkPermission(userData, pathname, requiredPermission);
                if (!hasPermission) {
                    router.push('/admin/unauthorized');
                }
            } catch (error) {
                console.error("Auth error:", error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname, requiredPermission]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return user ? children : null;
};

export default ProtectedRoute;