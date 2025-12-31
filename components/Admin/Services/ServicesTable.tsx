import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';

interface Service {
    ServiceID: number;
    ServicesName: string;
    Description: string | null;
    IconName: string | null;
    SpecialtyID: number | null;
    IsActive: boolean;
}

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    service: Service | null;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave,
    service 
}) => {
    const [formData, setFormData] = useState({
        ServicesName: '',
        Description: '',
        IconName: '',
        SpecialtyID: null as number | null,
        IsActive: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (service) {
            setFormData({
                ServicesName: service.ServicesName || '',
                Description: service.Description || '',
                IconName: service.IconName || '',
                SpecialtyID: service.SpecialtyID,
                IsActive: service.IsActive !== false
            });
        } else {
            setFormData({
                ServicesName: '',
                Description: '',
                IconName: '',
                SpecialtyID: null,
                IsActive: true
            });
        }
    }, [service, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Map frontend field names to backend field names
        const requestData = {
            servicesName: formData.ServicesName,
            description: formData.Description || '',
            iconName: formData.IconName || '',  // Changed from iconClass to iconName
            specialtyID: formData.SpecialtyID || null,
            isActive: formData.IsActive
        };

        console.log('Sending data:', JSON.stringify(requestData, null, 2));

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const url = service?.ServiceID 
            ? `http://engafi05-001-site1.stempurl.com/api/admin/services/${service.ServiceID}`
            : 'http://engafi05-001-site1.stempurl.com/api/admin/services';

        const method = service?.ServiceID ? 'put' : 'post';

        const response = await axios({
            method,
            url,
            data: requestData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Server response:', response.data);
        onSave();
        onClose();
    } catch (error: any) {
        console.error('Error saving service:', {
            name: error.name,
            message: error.message,
            response: error.response?.data
        });
        
        const errorMessage = service?.ServiceID 
            ? 'فشل في تحديث الخدمة' 
            : 'فشل في إضافة خدمة جديدة';
            
        alert(`${errorMessage}: ${error.response?.data?.message || error.message}`);
    } finally {
        setLoading(false);
    }
};

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">
                        {service?.ServiceID ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم الخدمة *
                        </label>
                        <input
                            type="text"
                            name="ServicesName"
                            value={formData.ServicesName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            الوصف
                        </label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            أيقونة (اسم الأيقونة)
                        </label>
                        <input
                            type="text"
                            name="IconName"
                            value={formData.IconName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="IsActive"
                                checked={formData.IsActive}
                                onChange={handleChange}
                                className="ml-2"
                            />
                            <span className="text-sm text-gray-700">نشط</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ServicesTable: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://engafi05-001-site1.stempurl.com/api/admin/services', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setServices(response.data);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching services:', error);
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;

        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://engafi05-001-site1.stempurl.com/api/admin/services/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            fetchServices(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting service:', error);
            alert(`فشل في حذف الخدمة: ${error.response?.data?.message || error.message}`);
        }
    };

    const filteredServices = services.filter(service => 
        (service.ServicesName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (service.Description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
                <button
                    onClick={() => {
                        setEditingService(null);
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                    <Plus size={18} className="ml-1" />
                    إضافة خدمة
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="بحث..."
                            className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">جاري التحميل...</div>
                ) : error ? (
                    <div className="p-4 text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
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
                                        الحالة
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        الإجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredServices.map((service) => (
                                    <tr key={service.ServiceID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {service.ServicesName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {service.Description || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                service.IsActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {service.IsActive ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setEditingService(service);
                                                    setShowModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.ServiceID)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ServiceFormModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingService(null);
                }}
                onSave={() => {
                    fetchServices();
                    setShowModal(false);
                }}
                service={editingService}
            />
        </div>
    );
};

export default ServicesTable;