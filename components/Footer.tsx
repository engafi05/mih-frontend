import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#001f3f] text-white pt-20 pb-10 border-t-8 border-blue-600">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* معلومات المستشفى */}
                    <div>
                        <h2 className="text-3xl font-black mb-6 tracking-tighter">مستشفى مصر الدولى <span className="text-blue-500 text-sm block font-light">مستشفى مصر الدولى</span></h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            نحن ملتزمون بتقديم أعلى مستويات الرعاية الصحية في المنطقة، بدمج الخبرات الطبية العالمية مع الرعاية الإنسانية الفائقة.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"><Facebook size={18} /></a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"><Instagram size={18} /></a>
                        </div>
                    </div>

                    {/* روابط سريعة */}
                    <div>
                        <h3 className="text-xl font-black mb-8 border-r-4 border-blue-600 pr-4">روابط تهمك</h3>
                        <ul className="space-y-4 text-slate-400 font-bold">
                            <li><Link href="/doctors" className="hover:text-blue-400 transition-all">ابحث عن طبيب</Link></li>
                            <li><Link href="/services" className="hover:text-blue-400 transition-all">تخصصاتنا الطبية</Link></li>
                            <li><Link href="/careers" className="hover:text-blue-400 transition-all">انضم لفريقنا</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-all">اتصل بنا</Link></li>
                        </ul>
                    </div>

                    {/* ساعات العمل */}
                    <div>
                        <h3 className="text-xl font-black mb-8 border-r-4 border-blue-600 pr-4">أوقات العمل</h3>
                        <div className="space-y-4 text-slate-400">
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-blue-500" />
                                <div>
                                    <p className="text-sm font-bold">الطوارئ: 24/7</p>
                                    <p className="text-xs">على مدار الساعة طوال أيام الأسبوع</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                <div className="text-sm font-bold">العيادات الخارجية:</div>
                                <div className="text-xs">08:00 ص - 10:00 م</div>
                            </div>
                        </div>
                    </div>

                    {/* تواصل معنا */}
                    <div>
                        <h3 className="text-xl font-black mb-8 border-r-4 border-blue-600 pr-4">اتصل بنا</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Phone size={20} />
                                </div>
                                <span className="font-black text-lg">16010</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <span className="font-bold">info@misrhospital.org</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* حقوق النشر */}
                <div className="border-t border-slate-800 pt-10 text-center text-slate-500 text-sm font-bold">
                    <p className="flex items-center justify-center gap-2">
                        تم التطوير بكل <Heart size={14} className="text-red-500 fill-red-500" /> لمستشفى مصر الدولى © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </footer>
    );
}