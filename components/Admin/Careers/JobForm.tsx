'use client';
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface JobFormProps {
    job?: {
        JobID?: number;
        Title: string;
        SpecialtyID: number | null;
        Location: string;
        Type: string;
        Description: string;
        Requirements: string;
        IsActive: boolean;
    } | null;
    onSuccess: () => void;
    specialties: Array<{ SpecialtyID: number; SpecialtyName: string }>;
}

const JobForm: React.FC<JobFormProps> = ({ job, onSuccess, specialties }) => {
    const [formData, setFormData] = useState({
        title: '',
        specialtyId: '',
        location: 'الرياض، السعودية',
        type: 'دوام كامل',
        description: '',
        requirements: '',
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (job) {
            setFormData({
                title: job.Title,
                specialtyId: job.SpecialtyID?.toString() || '',
                location: job.Location,
                type: job.Type,
                description: job.Description,
                requirements: job.Requirements,
                isActive: job.IsActive
            });
        }
    }, [job]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('admin_token');
            const url = job?.JobID 
                ? `http://engafi05-001-site1.stempurl.com/api/admin/jobs/${job.JobID}`
                : 'http://engafi05-001-site1.stempurl.com/api/admin/jobs';

            const method = job?.JobID ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    specialtyId: formData.specialtyId ? parseInt(formData.specialtyId) : null
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'فشل حفظ البيانات');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving job:', error);
            alert(error.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">المسمى الوظيفي *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">التخصص</label>
                    <select
                        name="specialtyId"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.specialtyId}
                        onChange={handleChange}
                    >
                        <option value="">اختر التخصص</option>
                        {specialties.map(specialty => (
                            <option key={specialty.SpecialtyID} value={specialty.SpecialtyID}>
                                {specialty.SpecialtyName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">موقع العمل</label>
                    <input
                        type="text"
                        name="location"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">نوع الدوام</label>
                    <select
                        name="type"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="دوام كامل">دوام كامل</option>
                        <option value="دوام جزئي">دوام جزئي</option>
                        <option value="عن بعد">عن بعد</option>
                        <option value="عقود">عقود</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">الوصف الوظيفي *</label>
                <textarea
                    name="description"
                    rows={4}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">المتطلبات</label>
                <textarea
                    name="requirements"
                    rows={4}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="اكتب كل متطلب في سطر جديد"
                />
            </div>

            <div className="flex items-center justify-between pt-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                        الوظيفة نشطة
                    </label>
                </div>

                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={onSuccess}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 ${
                            loading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري الحفظ...
                            </>
                        ) : 'حفظ'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default JobForm;