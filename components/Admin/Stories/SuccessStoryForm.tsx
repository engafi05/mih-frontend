'use client';
import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface SuccessStoryFormProps {
    story?: {
        StoryID?: number;
        Title: string;
        PatientName: string | null;
        DoctorID: number | null;
        StoryDate: string;
        FullStory: string;
        ShortExcerpt: string;
        ImagePath: string | null;
        IsPublished: boolean;
    } | null;
    onSuccess: () => void;
    doctors: Array<{DoctorID: number, Name: string, Title: string}>;
}

const SuccessStoryForm: React.FC<SuccessStoryFormProps> = ({ story, onSuccess, doctors }) => {
    const [formData, setFormData] = useState({
        title: '',
        patientName: '',
        doctorId: '',
        storyDate: new Date().toISOString().split('T')[0],
        fullStory: '',
        shortExcerpt: '',
        isPublished: true
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (story) {
            setFormData({
                title: story.Title,
                patientName: story.PatientName || '',
                doctorId: story.DoctorID?.toString() || '',
                storyDate: story.StoryDate.split('T')[0],
                fullStory: story.FullStory,
                shortExcerpt: story.ShortExcerpt || story.FullStory.substring(0, 200),
                isPublished: story.IsPublished
            });
            if (story.ImagePath) {
                setImagePreview(`http://https://engafi05-001-site1.stempurl.com${story.ImagePath}`);
            }
        }
    }, [story]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        if (formData.patientName) formDataToSend.append('patientName', formData.patientName);
        if (formData.doctorId) formDataToSend.append('doctorId', formData.doctorId);
        formDataToSend.append('storyDate', formData.storyDate);
        formDataToSend.append('fullStory', formData.fullStory);
        formDataToSend.append('shortExcerpt', formData.shortExcerpt || formData.fullStory.substring(0, 200));
        formDataToSend.append('isPublished', String(formData.isPublished));
        
        // If there's a new image, append it
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput?.files?.[0]) {
            formDataToSend.append('image', fileInput.files[0]);
        }

        try {
            const token = localStorage.getItem('admin_token');
            const url = story?.StoryID 
                ? `https://engafi05-001-site1.stempurl.com/api/admin/success-stories/${story.StoryID}`
                : 'https://engafi05-001-site1.stempurl.com/api/admin/success-stories';

            const method = story?.StoryID ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'فشل حفظ البيانات');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving success story:', error);
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

        // Update short excerpt if full story changes and no custom excerpt is set
        if (name === 'fullStory' && !formData.shortExcerpt) {
            setFormData(prev => ({
                ...prev,
                shortExcerpt: value.substring(0, 200)
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <form 
    onSubmit={handleSubmit} 
    className="space-y-6 text-right" 
    dir="rtl"
    encType="multipart/form-data"
>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">العنوان *</label>
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
                    <label className="block text-sm font-bold mb-1">اسم المريض</label>
                    <input
                        type="text"
                        name="patientName"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.patientName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">الطبيب المشرف</label>
                    <select
                        name="doctorId"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.doctorId}
                        onChange={handleChange}
                    >
                        <option value="">اختر الطبيب</option>
                        {doctors.map(doctor => (
                            <option key={doctor.DoctorID} value={doctor.DoctorID}>
                                {doctor.Name} - {doctor.Title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">تاريخ القصة</label>
                    <input
                        type="date"
                        name="storyDate"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.storyDate}
                        onChange={handleChange}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">القصة الكاملة *</label>
                    <textarea
                        name="fullStory"
                        rows={6}
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.fullStory}
                        onChange={handleChange}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">ملخص القصة</label>
                    <textarea
                        name="shortExcerpt"
                        rows={3}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.shortExcerpt}
                        onChange={handleChange}
                        placeholder="سيتم ملء هذا الحقل تلقائياً من بداية القصة إذا تركته فارغاً"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">صورة القصة</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <div className="text-sm text-gray-500 mb-1">معاينة الصورة:</div>
                            <img 
                                src={imagePreview} 
                                alt="معاينة الصورة" 
                                className="h-40 w-full object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPublished"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="mr-2 block text-sm text-gray-900">
                        نشر القصة
                    </label>
                </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 space-x-reverse">
                <button
                    type="button"
                    onClick={onSuccess}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                >
                    إلغاء
                </button>
                <button
                    type="submit"
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري الحفظ...
                        </>
                    ) : 'حفظ'}
                </button>
            </div>
        </form>
    );
};

export default SuccessStoryForm;