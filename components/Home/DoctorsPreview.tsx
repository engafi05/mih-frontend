"use client";
import React from 'react';
import { Calendar, Stethoscope, UserRound } from 'lucide-react';

export default function DoctorsPreview({ doctors, onBookClick }: { doctors: any[], onBookClick: (id: number) => void }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doc) => (
                <div key={doc.DoctorID} className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-100 border border-slate-50 group hover:-translate-y-2 transition-all duration-500">
                    <div className="aspect-square bg-slate-100 rounded-[2rem] mb-6 overflow-hidden relative">
                        {doc.ProfileImagePath ? (
                            <img src={`https://engafi05-001-site1.stempurl.com${doc.ProfileImagePath}`} alt={doc.Name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <UserRound size={80} />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <h4 className="text-xl font-black text-[#001F3F]">د. {doc.Name}</h4>
                        <p className="text-blue-600 font-bold text-sm mb-6">{doc.SpecialtyName || 'استشاري'}</p>
                        
                        <button 
                            onClick={() => onBookClick(doc.DoctorID)}
                            className="w-full bg-[#001F3F] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                        >
                            <Calendar size={18} />
                            حجز موعد
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}