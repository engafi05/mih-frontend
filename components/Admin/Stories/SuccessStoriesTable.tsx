'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaEye, FaImage, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import AdminModal from '../AdminModal';
import SuccessStoryForm from './SuccessStoryForm';
import Image from 'next/image';
import Link from 'next/link';

interface SuccessStory {
    StoryID: number;
    Title: string;
    PatientName: string | null;
    DoctorID: number | null;
    DoctorName: string | null;
    DoctorTitle: string | null;
    StoryDate: string;
    FullStory: string;
    ShortExcerpt: string;
    ImagePath: string | null;
    IsPublished: boolean;
}

interface Doctor {
    DoctorID: number;
    Name: string;
    Title: string;
}

const SuccessStoriesTable = () => {
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const [storiesRes, doctorsRes] = await Promise.all([
                fetch('http://engafi05-001-site1.stempurl.com/api/admin/success-stories', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch('http://engafi05-001-site1.stempurl.com/api/admin/doctors', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            const storiesData = await storiesRes.json();
            const doctorsData = await doctorsRes.json();
            
            setStories(storiesData);
            setDoctors(doctorsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('فشل تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = () => {
        setEditingStory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (story: SuccessStory) => {
        setEditingStory(story);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه القصة الناجحة؟')) return;
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://engafi05-001-site1.stempurl.com/api/admin/success-stories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('فشل حذف القصة الناجحة');
            }

            setStories(stories.filter(story => story.StoryID !== id));
            alert('تم حذف القصة الناجحة بنجاح');
        } catch (error: any) {
            console.error('Error deleting success story:', error);
            alert(error.message || 'حدث خطأ أثناء حذف القصة الناجحة');
        }
    };

    const togglePublishStatus = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`http://engafi05-001-site1.stempurl.com/api/admin/success-stories/${id}/publish`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isPublished: !currentStatus })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'فشل تغيير حالة النشر');
            }

            setStories(stories.map(story => 
                story.StoryID === id ? { ...story, IsPublished: result.isPublished } : story
            ));
        } catch (error: any) {
            console.error('Error toggling publish status:', error);
            alert(error.message || 'حدث خطأ أثناء تغيير حالة النشر');
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
                <h2 className="text-2xl font-bold">إدارة القصص الناجحة</h2>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <FaPlus /> إضافة قصة جديدة
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الصورة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                العنوان
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                اسم المريض
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الطبيب
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                التاريخ
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
                        {stories.map((story) => (
                            <tr key={story.StoryID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {story.ImagePath ? (
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                            <img 
                                                src={`http://localhost:5000${story.ImagePath}`}
                                                alt={story.Title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <FaImage className="text-gray-400" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{story.Title}</div>
                                    <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                                        {story.ShortExcerpt}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {story.PatientName || 'غير محدد'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {story.DoctorName ? `${story.DoctorName} - ${story.DoctorTitle}` : 'غير محدد'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(story.StoryDate).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => togglePublishStatus(story.StoryID, story.IsPublished)}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            story.IsPublished 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {story.IsPublished ? (
                                            <FaToggleOn className="ml-1" />
                                        ) : (
                                            <FaToggleOff className="ml-1" />
                                        )}
                                        {story.IsPublished ? 'منشور' : 'مسودة'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <Link 
                                            href={`/success-stories/${story.StoryID}`} 
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-900"
                                            title="عرض"
                                        >
                                            <FaEye />
                                        </Link>
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="تعديل"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.StoryID)}
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
                    setEditingStory(null);
                }}
                title={editingStory ? 'تعديل قصة نجاح' : 'إضافة قصة نجاح جديدة'}
                size="3xl"
            >
                <SuccessStoryForm 
                    story={editingStory} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        setEditingStory(null);
                        fetchData();
                    }}
                    doctors={doctors}
                />
            </AdminModal>
        </div>
    );
};

export default SuccessStoriesTable;