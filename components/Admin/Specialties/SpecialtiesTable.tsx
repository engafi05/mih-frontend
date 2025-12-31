'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import AdminModal from '../AdminModal';
import SpecialtyForm from './SpecialtyForm';

interface Specialty {
    SpecialtyID: number;
    SpecialtyName: string;
    Description: string;
    IconClass: string;
}

const SpecialtiesTable = () => {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);

    const fetchSpecialties = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/specialties', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSpecialties(data);
        } catch (error) {
            console.error('Error fetching specialties:', error);
            alert('فشل تحميل التخصصات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const handleAdd = () => {
        setEditingSpecialty(null);
        setIsModalOpen(true);
    };

    const handleEdit = (specialty: Specialty) => {
        setEditingSpecialty(specialty);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا التخصص؟')) return;
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/specialties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'فشل حذف التخصص');
            }

            setSpecialties(specialties.filter(s => s.SpecialtyID !== id));
            alert('تم حذف التخصص بنجاح');
        } catch (error: any) {
            console.error('Error deleting specialty:', error);
            alert(error.message || 'حدث خطأ أثناء حذف التخصص');
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
                <h2 className="text-2xl font-bold">إدارة التخصصات الطبية</h2>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <FaPlus /> إضافة تخصص جديد
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الاسم
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الوصف
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الأيقونة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {specialties.map((specialty) => (
                            <tr key={specialty.SpecialtyID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {specialty.SpecialtyName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {specialty.Description || 'لا يوجد وصف'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <i className={specialty.IconClass || 'fas fa-stethoscope'}></i>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(specialty)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(specialty.SpecialtyID)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash />
                                    </button>
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
                    setEditingSpecialty(null);
                }}
                title={editingSpecialty ? 'تعديل التخصص' : 'إضافة تخصص جديد'}
            >
                <SpecialtyForm 
                    specialty={editingSpecialty} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingSpecialty(null);
                        fetchSpecialties();
                    }} 
                />
            </AdminModal>
        </div>
    );
};

export default SpecialtiesTable;