'use client';
import React, { useState, useEffect } from 'react';

interface Doctor {
    DoctorID?: number;
    Name: string;
    Title: string;
    SpecialtyID: number | null;
    Bio: string;
    ProfileImagePath?: string;
}

interface DoctorFormProps {
    doctor?: Doctor | null;
    onSuccess: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSuccess }) => {
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Doctor>({
        Name: '',
        Title: '',
        SpecialtyID: null,
        Bio: '',
        ProfileImagePath: ''
    });

    // Initialize form with doctor data if editing
    useEffect(() => {
        if (doctor) {
            setFormData({
                Name: doctor.Name || '',
                Title: doctor.Title || '',
                SpecialtyID: doctor.SpecialtyID || null,
                Bio: doctor.Bio || '',
                ProfileImagePath: doctor.ProfileImagePath || ''
            });
        }
    }, [doctor]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const res = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/specialties', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSpecialties(data);
                }
            } catch (error) {
                console.error('Error fetching specialties:', error);
            }
        };
        fetchSpecialties();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('admin_token');
            const method = doctor?.DoctorID ? 'PUT' : 'POST';
            const url = doctor?.DoctorID 
                ? `https://engafi05-001-site1.stempurl.com/api/admin/doctors/${doctor.DoctorID}`
                : 'https://engafi05-001-site1.stempurl.com/api/admin/doctors';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: formData.Name,
                    title: formData.Title,
                    specialtyId: formData.SpecialtyID,
                    bio: formData.Bio,
                    ProfileImagePath: formData.ProfileImagePath
                })
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'فشل حفظ البيانات');
            }

            onSuccess();
        } catch (error: any) {
            console.error('Error saving doctor:', {
                error,
                response: error.response,
                message: error.message,
                stack: error.stack
            });
            alert(error.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'SpecialtyID' ? (value ? parseInt(value) : null) : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
            <div>
                <label className="block text-sm font-bold mb-1">الاسم الكامل</label>
                <input 
                    type="text" 
                    name="Name"
                    required 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.Name}
                    onChange={handleChange}
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold mb-1">اللقب المهني (مثال: أخصائي جراحة)</label>
                <input 
                    type="text" 
                    name="Title"
                    required 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.Title}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label className="block text-sm font-bold mb-1">التخصص</label>
                <select 
                    name="SpecialtyID"
                    required 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.SpecialtyID || ''}
                    onChange={handleChange}
                >
                    <option value="">اختر التخصص</option>
                    {specialties.map(s => (
                        <option key={s.SpecialtyID} value={s.SpecialtyID}>
                            {s.SpecialtyName}
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-bold mb-1">صورة الطبيب (رابط)</label>
                <input 
                    type="text" 
                    name="ProfileImagePath"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.ProfileImagePath || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/doctor.jpg"
                />
            </div>
            
            <div>
                <label className="block text-sm font-bold mb-1">نبذة عن الطبيب</label>
                <textarea 
                    name="Bio"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none h-32"
                    value={formData.Bio}
                    onChange={handleChange}
                ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
                <button 
                    type="button" 
                    onClick={() => onSuccess()} 
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={loading}
                >
                    إلغاء
                </button>
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
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

export default DoctorForm;