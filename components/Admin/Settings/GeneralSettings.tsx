'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Save, 
    UserPlus, 
    Trash2, 
    Shield, 
    X, 
    Settings, 
    Users, 
    Activity, 
    UserCog 
} from 'lucide-react';

interface Settings {
    HospitalName?: string;
    ContactEmail?: string;
    ContactPhone?: string;
    Address?: string;
    FacebookUrl?: string;
    TwitterUrl?: string;
    InstagramUrl?: string;
    WorkingHours?: string;
    HospitalLogo?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface Log {
    id: number;
    action: string;
    user: string;
    timestamp: string;
}

const GeneralSettings = () => {
    // State
    const [activeTab, setActiveTab] = useState<'general' | 'users' | 'logs'>('general');
    const [settings, setSettings] = useState<Settings>({});
    const [users, setUsers] = useState<User[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{type: string; text: string}>({ type: '', text: '' });
    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch data based on active tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('admin_token');
                const config = {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                };

                if (activeTab === 'general') {
                    const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/settings', config);
                    setSettings(response.data);
                    if (response.data.HospitalLogo) {
                        setImagePreview(`http://localhost:5000/${response.data.HospitalLogo}`);
                    }
                } else if (activeTab === 'users') {
                    const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/users', config);
                    setUsers(Array.isArray(response.data) ? response.data : []);
                } else if (activeTab === 'logs') {
                    const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/logs', config);
                    setLogs(Array.isArray(response.data) ? response.data : []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage({
                    type: 'error',
                    text: 'حدث خطأ في جلب البيانات'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setImagePreview(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setSettings(prev => ({ ...prev, HospitalLogo: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('admin_token');
            const formData = new FormData();
            
            Object.entries(settings).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            if (fileInputRef.current?.files?.[0]) {
                formData.append('image', fileInputRef.current.files[0]);
            } else if (!imagePreview) {
                formData.append('removeImage', 'true');
            }

            const response = await axios.put('http://engafi05-001-site1.stempurl.com/api/admin/settings', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
            setSettings(response.data);
            
            if (response.data.HospitalLogo) {
                setImagePreview(`http://localhost:5000/${response.data.HospitalLogo}`);
            } else {
                setImagePreview(null);
            }
            
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({
                type: 'error',
                text: 'حدث خطأ أثناء حفظ الإعدادات'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setShowAddUserModal(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        
        try {
            const token = localStorage.getItem('admin_token');
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            await axios.delete(`http://engafi05-001-site1.stempurl.com/api/admin/users/${userId}`, config);
            const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/users', config);
            setUsers(response.data);
            
            setMessage({ type: 'success', text: 'تم حذف المستخدم بنجاح' });
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage({
                type: 'error',
                text: 'حدث خطأ أثناء حذف المستخدم'
            });
        }
    };

    const handleSaveUser = async (userData: any) => {
        try {
            const token = localStorage.getItem('admin_token');
            const config = {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            if (selectedUser) {
                await axios.put(
                    `http://engafi05-001-site1.stempurl.com/api/admin/users/${selectedUser.id}`,
                    {
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        isActive: userData.isActive,
                        ...(userData.password && { password: userData.password })
                    },
                    config
                );
            } else {
                if (!userData.password) {
                    throw new Error('كلمة المرور مطلوبة');
                }
                await axios.post(
                    'http://engafi05-001-site1.stempurl.com/api/admin/users',
                    {
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        role: userData.role,
                        isActive: userData.isActive
                    },
                    config
                );
            }

            const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/users', config);
            setUsers(response.data);
            setShowAddUserModal(false);
            setSelectedUser(null);
            
            setMessage({
                type: 'success',
                text: selectedUser ? 'تم تحديث المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح'
            });

        } catch (error) {
            console.error('Error saving user:', error);
            setMessage({
                type: 'error',
                text: 'حدث خطأ أثناء حفظ بيانات المستخدم'
            });
        }
    };

    // Render Functions
    const renderGeneralSettings = () => (
        <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Hospital Logo */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    شعار المستشفى
                </label>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {imagePreview ? (
                            <div className="relative group">
                                <img 
                                    src={imagePreview} 
                                    alt="شعار المستشفى" 
                                    className="h-24 w-24 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="h-24 w-24 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-gray-400">لا يوجد شعار</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                            id="hospital-logo"
                        />
                        <label
                            htmlFor="hospital-logo"
                            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            اختر صورة
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                            الصيغ المدعومة: JPG, PNG, GIF. الحجم الأقصى: 2 ميجابايت
                        </p>
                    </div>
                </div>
            </div>

            {/* Hospital Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستشفى
                </label>
                <input
                    type="text"
                    name="HospitalName"
                    value={settings.HospitalName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>

            {/* Contact Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                </label>
                <input
                    type="email"
                    name="ContactEmail"
                    value={settings.ContactEmail || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>

            {/* Contact Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                </label>
                <input
                    type="tel"
                    name="ContactPhone"
                    value={settings.ContactPhone || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                </label>
                <textarea
                    name="Address"
                    value={settings.Address || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    required
                ></textarea>
            </div>

            {/* Working Hours */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    ساعات العمل
                </label>
                <input
                    type="text"
                    name="WorkingHours"
                    value={settings.WorkingHours || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="مثال: من الأحد إلى الخميس، من 8 صباحاً إلى 4 مساءً"
                    required
                />
            </div>

            {/* Social Media Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        فيسبوك
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://facebook.com/
                        </span>
                        <input
                            type="text"
                            name="FacebookUrl"
                            value={settings.FacebookUrl?.replace('https://facebook.com/', '') || ''}
                            onChange={(e) => {
                                setSettings(prev => ({
                                    ...prev,
                                    FacebookUrl: e.target.value ? `https://facebook.com/${e.target.value.replace('https://facebook.com/', '')}` : ''
                                }));
                            }}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="username"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        تويتر
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://twitter.com/
                        </span>
                        <input
                            type="text"
                            name="TwitterUrl"
                            value={settings.TwitterUrl?.replace('https://twitter.com/', '') || ''}
                            onChange={(e) => {
                                setSettings(prev => ({
                                    ...prev,
                                    TwitterUrl: e.target.value ? `https://twitter.com/${e.target.value.replace('https://twitter.com/', '')}` : ''
                                }));
                            }}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="username"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        انستغرام
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            https://instagram.com/
                        </span>
                        <input
                            type="text"
                            name="InstagramUrl"
                            value={settings.InstagramUrl?.replace('https://instagram.com/', '') || ''}
                            onChange={(e) => {
                                setSettings(prev => ({
                                    ...prev,
                                    InstagramUrl: e.target.value ? `https://instagram.com/${e.target.value.replace('https://instagram.com/', '')}` : ''
                                }));
                            }}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="username"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </form>
    );

    const renderUsersTab = () => (
        <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">إدارة المستخدمين</h3>
                <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    onClick={() => {
                        setSelectedUser(null);
                        setShowAddUserModal(true);
                    }}
                >
                    <UserPlus className="ml-2 h-4 w-4" />
                    إضافة مستخدم
                </button>
            </div>
            
            {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    لا توجد بيانات متاحة
                </div>
            ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">اسم المستخدم</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">البريد الإلكتروني</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الدور</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الحالة</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">الإجراءات</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.username}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.isActive ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="تعديل"
                                            >
                                                <UserCog className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="حذف"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderLogsTab = () => (
        <div className="overflow-x-auto">
            <h3 className="text-lg font-medium mb-4">سجل الأحداث</h3>
            {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    لا توجد سجلات متاحة
                </div>
            ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">الإجراء</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">المستخدم</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">التاريخ والوقت</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {logs.map((log, index) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                        {index + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.action}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.user}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString('ar-SA')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    // User Modal Component
    const UserModal = ({ 
        user, 
        onClose, 
        onSave 
    }: { 
        user: User | null; 
        onClose: () => void; 
        onSave: (data: any) => Promise<void> 
    }) => {
        const [formData, setFormData] = useState({
            username: user?.username || '',
            email: user?.email || '',
            password: '',
            role: user?.role || 'user',
            isActive: user?.isActive ?? true
        });

        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
                await onSave(formData);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg w-full max-w-md">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {user ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    اسم المستخدم
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            
                            {!user && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        كلمة المرور
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full p-2 border rounded-md"
                                        required={!user}
                                        minLength={6}
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الدور
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="user">مستخدم عادي</option>
                                    <option value="admin">مدير</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    className="ml-2 h-4 w-4 text-blue-600 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">
                                    حساب نشط
                                </label>
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 text-white rounded-md ${
                                        isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'جاري الحفظ...' : (user ? 'حفظ التغييرات' : 'إضافة مستخدم')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`${
                            activeTab === 'general'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Settings className="ml-1 h-4 w-4" />
                        الإعدادات العامة
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`${
                            activeTab === 'users'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Users className="ml-1 h-4 w-4" />
                        المستخدمون
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`${
                            activeTab === 'logs'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                        <Activity className="ml-1 h-4 w-4" />
                        سجل الأحداث
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-lg shadow">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {message.text && (
                            <div className={`mb-4 p-3 rounded-md ${
                                message.type === 'error' 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                {message.text}
                            </div>
                        )}
                        {activeTab === 'general' && renderGeneralSettings()}
                        {activeTab === 'users' && renderUsersTab()}
                        {activeTab === 'logs' && renderLogsTab()}
                    </>
                )}
            </div>

            {/* User Modal */}
            {showAddUserModal && (
                <UserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowAddUserModal(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default GeneralSettings;