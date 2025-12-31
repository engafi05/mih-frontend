import React from 'react';
import axios from 'axios';
import { Activity, Heart, ShieldCheck, Microscope, Zap, Thermometer } from 'lucide-react';

const API_BASE_URL = 'https://engafi05-001-site1.stempurl.com/api';

// خريطة الأيقونات
const IconMap: any = {
    Heart: <Heart size={32} />,
    Zap: <Zap size={32} />,
    Activity: <Activity size={32} />,
    Microscope: <Microscope size={32} />,
    ShieldCheck: <ShieldCheck size={32} />
};

async function getServices() {
  try {
    const res = await axios.get(`${API_BASE_URL}/public/services`);
    return res.data;
  } catch (e) { return []; }
}

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#003366] py-24 text-center text-white relative">
        <div className="container mx-auto px-6">

  <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-xs font-black mb-4 uppercase tracking-widest">
                        خدمه طبيه تليق بك
                    </span>
          <h1 className="text-5xl font-black mb-4 tracking-tighter">خدماتنا الطبية</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
            نقدم في مستشفى مصر الدولي رعاية صحية متكاملة مدعومة بأحدث التكنولوجيات العالمية.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service: any) => (
            <div key={service.ServiceID} className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {IconMap[service.IconName] || <Activity size={32} />}
              </div>
              <h3 className="text-2xl font-black text-[#003366] mb-4">{service.ServicesName}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                {service.Description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}