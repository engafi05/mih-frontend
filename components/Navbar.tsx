"use client";
import React, { useState } from 'react'; // أضفنا useState
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Stethoscope, Briefcase, Phone, Info, Menu, X } from 'lucide-react'; // أضفنا Menu و X

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // حالة لفتح وإغلاق القائمة

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: <Home size={18} /> },
    { name: 'عن المستشفى', href: '/about', icon: <Info size={18} /> },
    { name: 'خدماتنا', href: '/services', icon: <Stethoscope size={18} /> },
    { name: 'الأطباء', href: '/doctors', icon: <Users size={18} /> },
    { name: 'التوظيف', href: '/careers', icon: <Briefcase size={18} /> },
    { name: 'اتصل بنا', href: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black text-[#003366] tracking-tighter flex items-center gap-1">
            مستشفى مصر الدولى<span className="text-blue-600">.</span>
          </Link>

          {/* القائمة للشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 font-bold text-sm transition-all py-2 px-3 rounded-xl ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-[#003366] hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* أزرار التواصل (تختفي في الموبايل الصغير جداً) */}
          <div className="hidden md:flex gap-2">
            <a href="tel:01118011563" className="bg-[#003366] text-white px-4 py-2 rounded-full font-bold text-[10px] hover:bg-blue-700 transition-all">
              طوارئ 24/7
            </a>
            <a href="tel:01118011563" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-[10px] hover:bg-blue-800 transition-all"> 
              حجز العيادات
            </a>
          </div>

          {/* زر الموبايل (Hamburger Menu) */}
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* قائمة الموبايل المنسدلة */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 pb-6 transition-all">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 font-bold ${
                  pathname === link.href ? 'text-blue-700 bg-blue-50' : 'text-slate-600'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 mt-4">
               <a href="tel:01118011563" className="bg-[#003366] text-white p-3 rounded-xl text-center font-bold text-sm">طوارئ 24/7</a>
               <a href="tel:01118011563" className="bg-blue-600 text-white p-3 rounded-xl text-center font-bold text-sm">حجز العيادات</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}