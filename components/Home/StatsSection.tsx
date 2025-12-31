"use client";
import React from 'react';
import { 
    Building2, 
    Stethoscope, 
    Users2, 
    BedDouble, 
    Activity, 
    Baby, 
    Zap, 
    Scissors, 
    History, 
    HeartHandshake, 
    ShieldCheck 
} from 'lucide-react';
import CountUp from 'react-countup';
import { InView } from 'react-intersection-observer';

// مصفوفة البيانات (يجب أن تكون موجودة داخل الملف)
const stats = [
    { icon: Building2, value: 3, label: "مبانى بمساحة 1800م²", color: "text-blue-500", suffix: "" },  
    { icon: Stethoscope, value: 200, label: "طبيب استشاري وأستاذ", color: "text-emerald-500", suffix: "+" },
    { icon: Users2, value: 1800, label: "كوادر طبية وإدارية", color: "text-sky-500", suffix: "+" },
    { icon: BedDouble, value: 300, label: "سرير تنويم مجهز", color: "text-indigo-500", suffix: "" },
    { icon: Activity, value: 79, label: "سرير عناية مركزة", color: "text-red-500", suffix: "" },
    { icon: Baby, value: 9, label: "حضانات لحديثي الولادة", color: "text-pink-500", suffix: "" },
    { icon: Zap, value: 19, label: "سرير طوارئ مجهز", color: "text-amber-500", suffix: "" },
    { icon: Scissors, value: 11, label: "غرف عمليات متطورة", color: "text-slate-600", suffix: "" },
    { icon: History, value: 42, label: "سنة من الخبرة", color: "text-blue-700", suffix: "" },
    { icon: HeartHandshake, value: 50, label: "ألف مريض راضٍ سنوياً", color: "text-rose-500", suffix: "K+" },
    { icon: ShieldCheck, value: 0, label: "تقييم جودة الرعاية", color: "text-teal-500", textValue: "B+" },
];

const StatsSection: React.FC = () => {
    return (
        <section className="py-24 bg-[#001F3F] relative overflow-hidden">
            {/* زخرفة الخلفية */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4">أرقام وإنجازات نفتخر بها</h2>
                    <div className="w-24 h-1.5 bg-blue-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {stats.map((stat, index) => (
                        <InView key={index} triggerOnce={true} threshold={0.1}>
                            {({ inView, ref }) => (
                                <div 
                                    ref={ref}
                                    className="group bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 text-center"
                                >
                                    <div className={`mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                                        <stat.icon size={36} strokeWidth={1.5} />
                                    </div>
                                    
                                    <div className="text-3xl font-black text-white mb-1 tabular-nums tracking-tighter">
                                        {stat.textValue ? (
                                            stat.textValue
                                        ) : (
                                            <CountUp 
                                                start={0} 
                                                end={inView ? stat.value : 0} 
                                                duration={2.5} 
                                                suffix={stat.suffix}
                                                preserveValue={true}
                                            >
                                                {({ countUpRef }) => (
                                                    <span ref={countUpRef} />
                                                )}
                                            </CountUp>
                                        )}
                                    </div>
                                    
                                    <p className="text-blue-100/60 text-xs md:text-sm font-bold leading-relaxed">
                                        {stat.label}
                                    </p>
                                </div>
                            )}
                        </InView>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;