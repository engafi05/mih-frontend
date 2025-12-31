'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaToggleOn, FaToggleOff, FaEye } from 'react-icons/fa';
import AdminModal from '../AdminModal';
import JobForm from './JobForm';
//import { format } from 'date-fns';
//import { ar } from 'date-fns/locale/ar';
import Link from 'next/link';

interface Job {
    JobID: number;
    Title: string;
    SpecialtyID: number | null;
    SpecialtyName?: string;
    Location: string;
    Type: string;
    Description: string;
    Requirements: string;
    PostedDate: string;
    IsActive: boolean;
}

const JobsTable = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [specialties, setSpecialties] = useState<Array<{SpecialtyID: number, SpecialtyName: string}>>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const [jobsRes, specialtiesRes] = await Promise.all([
                fetch('http://engafi05-001-site1.stempurl.com/api/admin/jobs', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://engafi05-001-site1.stempurl.com/api/admin/specialties', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            const jobsData = await jobsRes.json();
            const specialtiesData = await specialtiesRes.json();
            
            setJobs(jobsData);
            setSpecialties(specialtiesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('فشل تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleAdd = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };

    const handleEdit = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الوظيفة؟')) return;
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://engafi05-001-site1.stempurl.com/api/admin/jobs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('فشل حذف الوظيفة');
            }

            setJobs(jobs.filter(job => job.JobID !== id));
            alert('تم حذف الوظيفة بنجاح');
        } catch (error: any) {
            console.error('Error deleting job:', error);
            alert(error.message || 'حدث خطأ أثناء حذف الوظيفة');
        }
    };

    const toggleJobStatus = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://engafi05-001-site1.stempurl.com/api/admin/jobs/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'فشل تغيير حالة الوظيفة');
            }

            setJobs(jobs.map(job => 
                job.JobID === id ? { ...job, IsActive: result.isActive } : job
            ));
        } catch (error: any) {
            console.error('Error toggling job status:', error);
            alert(error.message || 'حدث خطأ أثناء تغيير حالة الوظيفة');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">إدارة الوظائف الشاغرة</h2>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <FaPlus /> إضافة وظيفة جديدة
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                المسمى الوظيفي
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                التخصص
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الموقع
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                النوع
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                تاريخ النشر
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {jobs.map((job) => (
                            <tr key={job.JobID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {job.Title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {job.SpecialtyName || 'لا يوجد'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {job.Location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {job.Type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(job.PostedDate).toLocaleDateString('ar-SA', {
   					 year: 'numeric',
 					 month: '2-digit',
   					 day: '2-digit'
							})}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => toggleJobStatus(job.JobID, job.IsActive)}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            job.IsActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {job.IsActive ? (
                                            <FaToggleOn className="ml-1" />
                                        ) : (
                                            <FaToggleOff className="ml-1" />
                                        )}
                                        {job.IsActive ? 'نشطة' : 'غير نشطة'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Link 
                                            href={`/jobs/${job.JobID}`} 
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-900"
                                            title="عرض"
                                        >
                                            <FaEye />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(job)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="تعديل"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.JobID)}
                                            className="text-red-600 hover:text-red-900"
                                            title="حذف"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingJob(null);
                }}
                title={editingJob ? 'تعديل الوظيفة' : 'إضافة وظيفة جديدة'}
            >
                <JobForm 
                    job={editingJob} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingJob(null);
                        fetchJobs();
                    }}
                    specialties={specialties}
                />
            </AdminModal>
        </div>
    );
};

export default JobsTable;