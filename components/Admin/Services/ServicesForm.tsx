'use client';
import React, { useState, useEffect } from 'react';

interface ServicesFormProps {
    services?: {
        ServicesID?: number;
        ServicesName: string;
        Description: string;
        IconClass: string;
    } | null;
    onSuccess: () => void;
}

const ServicesForm: React.FC<ServicesFormProps> = ({ services, onSuccess }) => {
    const [formData, setFormData] = useState({
        servicesName: '',
        description: '',
        iconClass: 'fas fa-stethoscope'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (services) {
            setFormData({
                servicesName: services.ServicesName,
                description: services.Description || '',
                iconClass: services.IconClass || 'fas fa-stethoscope'
            });
        }
    }, [services]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('admin_token');
            const url = services?.ServicesID 
                ? `http://engafi05-001-site1.stempurl.com/api/admin/services/${services.ServicesID}`
                : 'http://engafi05-001-site1.stempurl.com/api/admin/services';

            const method = services?.ServicesID ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    servicesName: formData.servicesName,
                    description: formData.description,
                    iconClass: formData.iconClass
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'فشل حفظ البيانات');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving services:', error);
            alert(error.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
            <div>
                <label className="block text-sm font-bold mb-1">اسم التخصص *</label>
                <input
                    type="text"
                    name="servicesName"
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.servicesName}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">الوصف</label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">أيقونة الخدمه الطبيه</label>
                <div className="relative">
                    <select
                        name="iconClass"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.iconClass}
                        onChange={handleChange}
                    >
                        <option value="fas fa-stethoscope">Stethoscope</option>
                        <option value="fas fa-heart">Heart</option>
                        <option value="fas fa-brain">Brain</option>
                        <option value="fas fa-bone">Bone</option>
                        <option value="fas fa-eye">Eye</option>
                        <option value="fas fa-tooth">Tooth</option>
                        <option value="fas fa-baby">Baby</option>
                        <option value="fas fa-allergies">Allergies</option>
                        <option value="fas fa-ambulance">Ambulance</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <i className={formData.iconClass}></i>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
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
        </form>
    );
};

export default ServicesForm;