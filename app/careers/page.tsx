"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, MapPin, Clock, Send, Building2, Search } from 'lucide-react';
import JobModal from '@/components/Home/JobModal';

export default function CareersPage() {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        axios.get('http://engafi05-001-site1.stempurl.com/api/public/jobs')
            .then(res => setJobs(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleApply = (job: any) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#001F3F] text-white py-28 text-center">
                <div className="container mx-auto px-6">
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-xs font-black mb-4 inline-block uppercase">وظائف مستشفى مصر الدولى</span>
                    <h1 className="text-5xl font-black mb-6">انضم إلى فريقنا</h1>
                    <p className="text-blue-100/70 max-w-2xl mx-auto font-light">مستشفى مصر الدولي تبحث عن الكفاءات الطبية والإدارية المتميزة.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {jobs.map((job: any) => (
                        <div key={job.JobID} className="group p-8 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Briefcase size={30} />
                            </div>
                            
                            <span className="text-blue-600 font-bold text-xs mb-2 block">{job.Type}</span>
                            <h3 className="text-2xl font-black text-[#001F3F] mb-4">{job.Title}</h3>
                            
                            <div className="space-y-2 mb-8 text-slate-400 text-sm font-bold">
                                <div className="flex items-center gap-2"><MapPin size={16} /> {job.Location}</div>
                                <div className="flex items-center gap-2"><Clock size={16} /> {new Date(job.PostedDate).toLocaleDateString('ar-EG')}</div>
                            </div>

                            <button 
                                onClick={() => handleApply(job)}
                                className="w-full py-4 bg-slate-50 text-[#001F3F] rounded-2xl font-black group-hover:bg-[#001F3F] group-hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> قدم الآن
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <JobModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                selectedJob={selectedJob} 
            />
        </div>
    );
}