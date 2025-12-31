'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaUserMd, FaBriefcase, FaEnvelope, FaCog, 
  FaChartPie, FaStethoscope, FaStar, FaUsersCog, FaSignOutAlt 
} from 'react-icons/fa';
import Cookies from 'js-cookie'; // تأكد من تثبيته: npm install js-cookie

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [userAuth, setUserAuth] = useState({
    role: '',
    pages: [] as string[],
    isLoaded: false
  });

  const menuItems = [
    { id: 'dashboard', name: 'الرئيسية', icon: FaChartPie, path: '/admin' },
    { id: 'services', name: 'الخدمات', icon: FaStethoscope, path: '/admin/services' },
    { id: 'doctors', name: 'الأطباء', icon: FaUserMd, path: '/admin/doctors' },
    { id: 'specialties', name: 'التخصصات', icon: FaStethoscope, path: '/admin/specialties' },
    { id: 'jobs', name: 'الوظائف', icon: FaBriefcase, path: '/admin/careers' },
    { id: 'messages', name: 'الرسائل', icon: FaEnvelope, path: '/admin/contact-messages' },
    { id: 'success-stories', name: 'قصص النجاح', icon: FaStar, path: '/admin/success-stories' },
    { id: 'users', name: 'إدارة المستخدمين', icon: FaUsersCog, path: '/admin/users' },
    { id: 'settings', name: 'الإعدادات', icon: FaCog, path: '/admin/settings' },
  ];

  useEffect(() => {
    const storedPages = localStorage.getItem('user_allowed_pages') || '';
    const storedRole = localStorage.getItem('user_role') || '';
    const pagesArray = storedPages === 'all' ? ['all'] : storedPages.split(',').map(p => p.trim());

    setUserAuth({
      role: storedRole,
      pages: pagesArray,
      isLoaded: true
    });

    if (storedRole !== 'Admin') {
      const currentItem = menuItems.find(item => item.path === pathname);
      if (currentItem && currentItem.id !== 'dashboard') {
        const hasAccess = pagesArray.includes('all') || pagesArray.includes(currentItem.id);
        if (!hasAccess) {
          router.push('/admin'); 
        }
      }
    }
  }, [pathname, router]);

  // وظيفة تسجيل الخروج
  const handleLogout = () => {
    // 1. مسح الكوكيز (لتعطيل الـ Middleware)
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    Cookies.remove('user_allowed_pages');

    // 2. مسح LocalStorage (لتنظيف المتصفح)
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_allowed_pages');

    // 3. التوجيه لصفحة الدخول
    router.push('/admin/login');
    router.refresh();
  };

  const canShow = (id: string) => {
    if (!userAuth.isLoaded) return false;
    if (userAuth.role === 'Admin' || userAuth.pages.includes('all')) return true;
    if (id === 'dashboard') return true;
    return userAuth.pages.includes(id);
  };

  if (!userAuth.isLoaded) return <div className="w-64 bg-slate-900 min-h-screen"></div>;

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col shadow-2xl overflow-y-auto">
      <div className="text-xl font-black mb-10 text-center py-6 border-b border-slate-800 tracking-tighter text-indigo-400 uppercase">
        لوحة الإدارة
      </div>
      
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          canShow(item.id) && (
            <Link 
              key={item.id} 
              href={item.path}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group ${
                pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <item.icon className={`text-lg ${pathname === item.path ? 'text-white' : 'group-hover:text-indigo-400'}`} />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          )
        ))}
      </nav>

      {/* قسم المستخدم وزر تسجيل الخروج */}
      <div className="mt-auto pt-4 space-y-3">
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black uppercase shadow-inner">
               {userAuth.role ? userAuth.role.substring(0,2) : '??'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">المسؤول</p>
              <p className="text-xs font-black text-white truncate">
                  {userAuth.role === 'Admin' ? 'مدير النظام' : 'محرر محتوى'}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-bold text-sm border border-transparent hover:border-red-500/20"
        >
          <FaSignOutAlt size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}