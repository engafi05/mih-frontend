import React from 'react';
import axios from 'axios';
import { Stethoscope, Award, Clock, MapPin, ChevronRight, UserRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = 'https://engafi05-001-site1.stempurl.com/api';

async function getDoctorDetails(id: string) {
    try {
        const res = await axios.get(`${API_BASE_URL}/public/doctors/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        return null;
    }
}

export default async function DoctorDetailsPage({ params }: { params: { id: string } }) {
    const doctor = await getDoctorDetails(params.id);

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">عذراً، لم يتم العثور على الطبيب</h2>
                    <Link href="/doctors" className="text-blue-600 hover:underline font-bold">العودة لقائمة الأطباء</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* الجزء العلوي - خلفية زرقاء */}
            <div className="bg-[#003366] h-64 w-full relative">
                <div className="container mx-auto px-6 h-full flex items-end">
                    <nav className="flex text-blue-100 text-sm mb-8 gap-2 items-center">
                        <Link href="/">الرئيسية</Link> <ChevronRight size={14} />
                        <Link href="/doctors">الأطباء</Link> <ChevronRight size={14} />
                        <span className="text-white font-bold">{doctor.Name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-32">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* الجانب الأيمن: بطاقة التعريف */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 sticky top-8">
                            <div className="aspect-square bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center overflow-hidden">
                                <UserRound size={120} className="text-slate-300" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 text-center mb-2">د. {doctor.Name}</h1>
                            <p className="text-blue-600 font-bold text-center mb-6 uppercase tracking-wider">{doctor.SpecialtyName}</p>
                            
                            <div className="space-y-4 border-t border-slate-50 pt-6">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">الدرجة العلمية</p>
                                        <p className="font-bold text-sm">{doctor.Title || 'استشاري أول'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">الترخيص</p>
                                        <p className="font-bold text-sm">ممارس معتمد</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-4 bg-[#003366] text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                                احجز موعد الآن
                            </button>
                        </div>
                    </div>

                    {/* الجانب الأيسر: المعلومات التفصيلية */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* نبذة عن الطبيب */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-[#003366] mb-6 flex items-center gap-3">
                                <Stethoscope className="text-blue-600" /> نبذة عن الطبيب
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                {doctor.Bio || `الدكتور ${doctor.Name} من الكفاءات الوطنية المتميزة في تخصص ${doctor.SpecialtyName}، يمتلك خبرة واسعة في تشخيص وعلاج الحالات المعقدة، ويسعى دائماً لتطبيق أحدث البروتوكولات الطبية العالمية لضمان سلامة المرضى.`}
                            </p>
                        </div>

                        {/* ساعات العمل / المواقع */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-black text-[#003366] mb-4 flex items-center gap-3">
                                    <Clock className="text-blue-600" /> أوقات العمل
                                </h3>
                                <ul className="space-y-3 text-slate-600 font-bold">
                                    <li className="flex justify-between border-b pb-2"><span>الأحد - الخميس</span> <span>09:00 ص - 05:00 م</span></li>
                                    <li className="flex justify-between text-slate-300"><span>الجمعة - السبت</span> <span>مغلق</span></li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                <h3 className="text-xl font-black text-[#003366] mb-4 flex items-center gap-3">
                                    <MapPin className="text-blue-600" /> موقع العيادة
                                </h3>
                                <p className="text-slate-600 font-bold leading-relaxed">
                                    مستشفى المركز الطبي الدولي <br />
                                    المبنى الرئيسي - الطابق الثالث <br />
                                    عيادة رقم 302
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}