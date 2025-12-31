'use client';
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUserMd, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminModal from '../AdminModal';
import DoctorForm from './DoctorForm';

interface Doctor {
    DoctorID: number;
    Name: string;
    Title: string;
    SpecialtyName: string;
}

const DoctorsTable = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('يرجى تسجيل الدخول أولاً');
            }

            const res = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/doctors', {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'فشل جلب بيانات الأطباء');
            }
            
            const data = await res.json();
            setDoctors(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching doctors:', err);
            setError(err.message || 'حدث خطأ أثناء جلب بيانات الأطباء');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (doctorId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
            try {
                const token = localStorage.getItem('admin_token');
                const response = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/doctors/${doctorId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'فشل حذف الطبيب');
                }

                // Refresh the doctors list
                await fetchDoctors();
                alert('تم حذف الطبيب بنجاح');
            } catch (err: any) {
                console.error('Error deleting doctor:', err);
                alert(err.message || 'حدث خطأ أثناء حذف الطبيب');
            }
        }
    };

    const handleEdit = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setIsModalOpen(true);
    };

    useEffect(() => { 
        fetchDoctors(); 
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center">
                <FaSpinner className="animate-spin text-2xl inline-block mr-2" />
                <span>جاري تحميل بيانات الأطباء...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="mr-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaUserMd className="text-indigo-600" /> 
                    <span>قائمة الأطباء</span>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {doctors.length}
                    </span>
                </h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <FaUserMd className="text-white" />
                    <FaPlus className="text-white" />
                    <span>إضافة طبيب جديد</span>
                </button>

                <AdminModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingDoctor(null);
                    }}
                    title={editingDoctor ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
                >
                    <DoctorForm 
                   // بدلاً من:    doctor={editingDoctor}
                       doctor={editingDoctor as any}  // أضف "as any" هنا
                        onSuccess={() => {
                            setIsModalOpen(false);
                            setEditingDoctor(null);
                            fetchDoctors();
                        }} 
                    />
                </AdminModal>
            </div>

            {doctors.length === 0 ? (
                <div className="text-center py-10">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد أطباء</h3>
                    <p className="mt-1 text-sm text-gray-500">لم يتم إضافة أي أطباء بعد.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الاسم الكامل
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    اللقب
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التخصص
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctors.map((doctor) => (
                                <tr key={doctor.DoctorID} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {doctor.Name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doctor.Title || 'غير محدد'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doctor.SpecialtyName || 'غير محدد'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(doctor);
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="text-red-500 hover:text-red-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(doctor.DoctorID);
                                            }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DoctorsTable;